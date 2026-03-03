export interface WebAnalyze {
    id: string
    domain: string
    ip: string | null
    server_info: Record<string, any>
    server_status_info: Record<string, any>
    port_status_info: Record<string, any>
    headers_info: Record<string, any>
    whois_info: Record<string, any>
    ssl_info: Record<string, any>
    dns_record_info: Record<string, any>
    tech_stack_info: Record<string, any>
}