import asyncio
import socket
import ssl
import time

import httpx
import asyncwhois
import dns.resolver
import warnings
warnings.filterwarnings("ignore", message=".*pkg_resources.*")

from datetime import datetime, timezone
from urllib.parse import urlparse
from Wappalyzer import Wappalyzer, WebPage

from backend.helper.format import format_list, format_date
from backend.httpx.httpx_api import client
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives.asymmetric import ec, rsa

TARGET_PORTS = [
    20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 143,
    156, 161, 162, 179, 194, 389, 443, 587, 993, 995,
    3000, 3306, 3389, 5060, 5900, 8000, 8080, 8888
]


def extract_domain(domain: str):
    if not domain.startswith("http"):
        domain = f"http://{domain}"
    return urlparse(domain).netloc


def extract_domain_https(domain: str):
    if not domain.startswith("http"):
        domain = f"https://{domain}"
    else:
        domain = domain
    return domain


async def get_server_info(domain: str):
    try:
        loop = asyncio.get_running_loop()
        ip_address = await loop.run_in_executor(None, socket.gethostbyname, domain)
        url = f"http://ip-api.com/json/{domain}?fields=status,message,country,city,isp,org,query,timezone,currency,lat,lon"

        response = await client.get(url, timeout = 5.0)
        if response.status_code == 200:
            return response.json()
        else:
            return {"ip": ip_address, "error": f"GeoIP API Status: {response.status_code}"}

    except socket.gaierror:
        return {"error": "Invalid Domain (DNS Lookup Failed)"}
    except httpx.RequestError as e:
        return {"error": f"HTTP Request Failed: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}


async def get_headers_info(domain: str):
    url = extract_domain_https(domain)
    try:
        response = await client.get(url, follow_redirects = True, timeout = 5.0)

        headers = {}

        for key, value in response.headers.items():
            headers[key.lower()] = value

        if "set-cookie" in headers:
            headers["set-cookie"] = response.headers.get_list("set-cookie")

        return headers
    except httpx.RequestError as e:
        return {"error": f"Connection Error: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}


async def get_whois_info(domain: str):
    url = extract_domain_https(domain)
    try:
        async with asyncio.timeout(5):
            _raw, data = await asyncwhois.aio_whois(url)
    except asyncio.TimeoutError:
        return {"error": "Whois lookup timed out after 5 seconds."}
    try:
        return {
            "creation_date": format_date(data.get("created")),
            "updated_date": format_date(data.get("updated")),
            "expiry_date": format_date(data.get("expires")),
            "registry_domain_id": data.get("registry_domain_id", "Unknown"),
            "registrar_whois_server": data.get("registrar_url", "Unknown"),
            "registrar": data.get("registrar", "Unknown"),
            "registrar_iana_id": data.get("registrar_iana_id", "Unknown"),
            "admin_country": data.get("admin_country", "Unknown"),
            "admin_city": data.get("admin_city", "Unknown"),
            "admin_address": data.get("admin_address", "Unknown"),
            "name_servers": format_list(data.get("name_servers"))
        }
    except Exception as e:
        return {"error": f"Whois Lookup Failed: {str(e)}"}


async def get_ssl_info(domain: str):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        conn = asyncio.open_connection(domain, 443, ssl = ctx)
        reader, writer = await asyncio.wait_for(conn, timeout = 5.0)

        ssl_object = writer.get_extra_info('ssl_object')
        der_cert = ssl_object.getpeercert(binary_form = True)

        writer.close()
        await writer.wait_closed()

        if not der_cert:
            return {"error": "No certificate found"}

        cert = x509.load_der_x509_certificate(der_cert, default_backend())

        subject = cert.subject.get_attributes_for_oid(NameOID.COMMON_NAME)
        issuer = cert.issuer.get_attributes_for_oid(NameOID.COMMON_NAME)
        organization = cert.issuer.get_attributes_for_oid(NameOID.ORGANIZATION_NAME)

        subject_str = subject[0].value if subject else "Unknown"
        issuer_str = issuer[0].value if issuer else "Unknown"

        if organization:
            issuer_str += f" ({organization[0].value})"

        serial_number = format(cert.serial_number, "X")
        fingerprint = cert.fingerprint(hashes.SHA256()).hex().upper()
        fingerprint_formatted = ":".join(fingerprint[i:i+2] for i in range(0, len(fingerprint), 2))

        public_key = cert.public_key()
        curve_info = "N/A"
        key_type = "Unknown"

        if isinstance(public_key, ec.EllipticCurvePublicKey):
            key_type = "Elliptic Curve (EC)"
            curve_name = public_key.curve.name
            curve_info = f"{curve_name} (NIST {curve_name})"
        elif isinstance(public_key, rsa.RSAPublicKey):
            key_type = f"RSA ({public_key.key_size} bits)"

        expire_date = cert.not_valid_after_utc
        now = datetime.now(timezone.utc)
        remaining = expire_date - now
        days_remaining = remaining.days

        return {
            "subject": subject_str,
            "issuer": issuer_str,
            "key_type": key_type,
            "curve": curve_info,
            "expires": cert.not_valid_after_utc.isoformat(),
            "renewed": cert.not_valid_before_utc.isoformat(),
            "days_remaining": days_remaining,
            "serial_number": serial_number,
            "fingerprint": fingerprint_formatted
        }

    except Exception as e:
        return {"error": str(e)}


async def get_dns_records_info(domain: str):
    loop = asyncio.get_running_loop()

    def _fetch_dns():
      results = {
          "A": [],
          "AAAA": [],
          "MX": [],
          "NS": [],
          "CNAME": [],
          "TXT": [],
      }

      resolver = dns.resolver.Resolver()
      resolver.timeout = 3
      resolver.lifetime = 3

      record_types = ["A", "AAAA", "MX", "NS", "CNAME", "TXT"]

      for record_type in record_types:
          try:
              answers = resolver.resolve(domain, record_type)

              for data in answers:
                  if record_type  == "MX":
                      results[record_type].append(f"{data.preference} {data.exchange.to_text()}")
                  elif record_type == "TXT":
                      txt_val = b"".join(data.strings).decode("utf-8")
                      results[record_type].append(txt_val)
                  else:
                      results[record_type].append(data.to_text())
          except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
              continue
          except Exception as e:
              continue

      return results

    return await loop.run_in_executor(None, _fetch_dns)


async def get_server_status_info(domain: str):
    url = extract_domain_https(domain)

    start_time = time.perf_counter()

    try:
        response = await client.get(url, follow_redirects = True, timeout = 10.0)
        end_time = time.perf_counter()

        duration_ms = (end_time - start_time) * 1000

        return {
            "is_up": True,
            "status_text": "✅ Online",
            "status_code": response.status_code,
            "response_time": f"{duration_ms:.0f}ms",
            "reason": response.reason_phrase
        }
    except httpx.TimeoutException:
        return {
            "is_up": False,
            "status_text": "❌ Offline (Timeout)",
            "status_code": 0,
            "response_time": "N/A",
            "error": "Connection Timed out"
        }
    except httpx.RequestError as e:
        return {
            "is_up": False,
            "status_text": "❌ Offline",
            "status_code": 0,
            "response_time": "N/A",
            "error": str(e)
        }
    except Exception as e:
        return {
            "is_up": False,
            "status_text": "❌ Error",
            "status_code": 0,
            "response_time": "N/A",
            "error": str(e)
        }


async def check_port(ip: str, port: int):
    try:
        conn = asyncio.open_connection(ip, port)
        reader, writer = await asyncio.wait_for(conn, timeout = 1.0)
        writer.close()
        await writer.wait_closed()
        return port, True
    except Exception as e:
        return port, False


async def get_port_status_info(domain: str):
    tasks = [check_port(domain, port) for port in TARGET_PORTS]
    results = await asyncio.gather(*tasks)

    open_ports = []
    failed_ports = []

    for port, is_open in results:
        if is_open:
            open_ports.append(port)
        else:
            failed_ports.append(port)

    return {
        "open_ports": open_ports,
        "failed_ports": failed_ports,
        "total_scanned": len(TARGET_PORTS)
    }


async def get_tech_stack_info(domain: str):
    url = extract_domain_https(domain)

    try:
        wappalyzer = Wappalyzer.latest()
        # response = await client.get(url)
        # webpage = WebPage(url, html = response.text, headers = response.headers)
        webpage = WebPage.new_from_url(url)
        tech_with_versions = wappalyzer.analyze_with_versions_and_categories(webpage)
        formatted_tech = []
        for tech_name, info in tech_with_versions.items():
            version = info["versions"][0] if info["versions"] else ""
            if version:
                formatted_tech.append(f"{tech_name} ({version})")
            else:
                formatted_tech.append(tech_name)
        return {
            "technologies": formatted_tech,
            "total_detected": len(formatted_tech)
        }
    except Exception as e:
        return {"error": str(e), "technologies": []}