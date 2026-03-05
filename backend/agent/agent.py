import base64
import shutil
import time
import json
import re
import os
import sys, asyncio
import uuid

from playwright.async_api import async_playwright
import google.generativeai as genai
from PIL import Image
from backend.httpx.httpx_api import client
from fastapi import WebSocket
import pyperclip

genai.configure(api_key = os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

async def save_image_from_element(element, filename):
    try:
        src = await element.get_attribute("src")
        if not src:
            src = await element.get_attribute("href")

        if not src:
            print("❌ 이미지 주소(src)를 찾을 수 없습니다.")
            return

        if src.startswith("data:image"):
            header, encoded = src.split(",", 1)
            data = base64.b64decode(encoded)
            with open(f"downloads/{filename}.jpg", "wb") as file:
                file.write(data)
            print(f"💾 [Base64] 저장 완료: downloads/{filename}.jpg")

        elif src.startswith("http"):
            try:
                async with client.stream("GET", src) as response:
                    if response.status_code == 200:
                        with open(f"downloads/{filename}.jpg", "wb") as file:
                            for chunk in response.iter_bytes():
                                file.write(chunk)
                            print(f"💾 [HTTPX] 저장 완료: /downloads/{filename}.jpg")
                    else:
                        print(f"❌ 다운로드 실패 (상태 코드: {response.status_code})")
            except Exception as e:
                print(f"❌ HTTPX 요청 중 에러: {e}")

        else:
            print(f"❌ 알 수 없는 이미지 소스 입니다: {src[:30]}...")

    except Exception as e:
        print(f"❌ 저장 메인 로직 에러: {e}")



def get_ai_next_action(prompt, history, screenshot_path):
    img = Image.open(screenshot_path)

    system_prompt = f"""
    너는 웹 브라우저 자동화 에이전트야.
    
    [사용자 목표]
    "{prompt}"
    
    [지금 까지의 행동 기록]
    {history}
    
    [현재 화면]
    스크린샷을 보고, 목표를 달성 하기 위해 **다음에 할 행동 단 하나**를 결정해.
    화면의 요소에는 빨간 박스와 번호(index)가 붙어 있어.
    
    [사용 가능한 행동 명령어]
    1. {{"action": "goto", "url": "https://..."}} -> 특정 주소로 이동할 때
    2. {{"action": "click", "index": 숫자}} -> 번호표 붙은 요소를 클릭할 때
    3. {{"action": "type", "index": 숫자, "text": "입력 할 내용"}} -> 검색창/로그인 창에 글 쓸 때
    4. {{"action": "download", "index": 숫자}} -> 해당 번호의 이미지를 내 컴퓨터에 저장 (이미지 검색 결과 등)
    5. {{"action": "done"}} -> 완료
    
    반드시 위의 JSON 형식 중 하나로 만 대답해. 설명은 필요 없어.
    """

    response = model.generate_content([system_prompt, img])

    try:
        text = response.text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except:
        pass
    return None


async def add_visual_tags(page):
    await page.evaluate("""() => {
        document.querySelectorAll('.ai-label').forEach(element => element.remove());
        document.querySelectorAll('[data-ai-id]').forEach(element => {
            element.style.border = "";
            element.removeAttribute('data-ai-id');
        });
    }""")

    elements = await page.query_selector_all('a[href], button, input, textarea, img')
    visible_elements = []

    for index, element in enumerate(elements):
        if await element.is_visible():
            visible_elements.append(element)
            await page.evaluate("""([element, index]) => {
                element.style.border = "2px solid red";
                element.setAttribute("data-ai-id", index);
                
                const label = document.createElement("div");
                label.className = "ai-label";
                label.innerText = index;
                label.style.position = "absolute";
                label.style.backgroundColor = "yellow";
                label.style.color = "black";
                label.style.fontSize = "14px";
                label.style.fontWeight = "bold";
                label.style.zIndex = "10000";
                
                
                const rect = element.getBoundingClientRect();
                label.style.top = (rect.top + window.scrollY) + "px";
                label.style.left = (rect.left + window.scrollX) + "px";
                document.body.appendChild(label);
                
        
            }""", [element, len(visible_elements) - 1])

    return visible_elements

async def capture(page, websocket):
    screenshot_path = "capture.png"
    await page.screenshot(path = screenshot_path)
    screenshot_bytes = await page.screenshot()
    try:
        if websocket and websocket.client_state.value == 1:
            img_str = base64.b64encode(screenshot_bytes).decode('utf-8')
            await websocket.send_text(img_str)
    except Exception as e:
        print(f"이미지 전송 중 루프 충돌 혹은 끊김: {e}")
    return screenshot_path

async def run_browser_agent(prompt, websocket: WebSocket = None):
    session_id = str(uuid.uuid4())
    user_data_dir = f"./user_data/{session_id}"
    os.makedirs(user_data_dir, exist_ok=True)
    history = []
    result = "failed"
    async with async_playwright() as p:
      try:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir,
            headless=True,
            channel="chrome",
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36", # 유저 에이전트 추가
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--window-size=1280,800"
            ]
        )
        page = await browser.new_page()

        for step in range(20):
            print(f"\n--- Step {step + 1} ---")

            await capture(page, websocket)
            try:
                visible_elements = await add_visual_tags(page)
            except Exception:
                visible_elements = []
            screenshot_path = await capture(page, websocket)
            print("🧠 생각 중...")
            action_data = get_ai_next_action(prompt, history, screenshot_path)

            if not action_data:
                print("❌ AI 응답 실패. 재시도 합니다.")
                continue

            print(f"🤖 AI의 결정: {action_data}")

            action_type = action_data.get("action")

            if action_type == "goto":
                url = action_data.get("url")
                print(f"🌐 이동: {url}")
                await page.goto(url)
                history.append(f"{url}로 이동")

            elif action_type == "click":
                index = int(action_data.get("index"))
                before_browser_count = len(browser.pages)
                if index < len(visible_elements):
                    print(f"🖱️ {index}번 요소 클릭")
                    await visible_elements[index].evaluate("element => element.click()")
                    history.append(f"{index}번 요소 클릭")

                    await asyncio.sleep(1)
                    if len(browser.pages) > before_browser_count:
                        print("새탭 감지")
                        page = browser.pages[-1]
                        await page.bring_to_front()
                        await page.wait_for_load_state()
                        history.append(f"{index}번 요소 클릭 (새 탭 전환됨)")

            elif action_type == "type":
                index = int(action_data.get("index"))
                text = action_data.get("text")
                if index < len(visible_elements):
                    print(f"⌨️ {index}번 요소에 '{text}' 입력")
                    await visible_elements[index].click()
                    await visible_elements[index].fill(text)
                    await page.keyboard.press("Control+v")
                    # await visible_elements[index].fill(text)
                    history.append(f"{index}번 요소에 {text} 입력")

            elif action_type == "download":
                index = int(action_data.get("index"))
                if index < len(visible_elements):
                    target_element = visible_elements[index]
                    filename = f"image_{int(time.time())}"
                    await save_image_from_element(target_element, filename)
                    history.append(f"{index}번 이미지 다운로드")
                else:
                    print("❌ 잘못된 인덱스 입니다.")

            elif action_type == "done":
                print("🎉 목표 달성! 종료 합니다.")
                history.append("🎉 성공")
                result = "성공"
                break
            await asyncio.sleep(1)
      except Exception as e:
        print(e)
        history.append("실패")
      finally:
          if websocket:
              try:
                  await websocket.send_text("STREAM_END")
              except Exception as e:
                  print(f"소켓 종료 중 에러: {e}")

      await browser.close()
      if os.path.exists(user_data_dir):
          shutil.rmtree(user_data_dir)
    return {
        "result": result,
        "history": history
    }


def agent_worker_thread(prompt: str, websocket):
    if sys.platform.startswith("win"):
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        return loop.run_until_complete(run_browser_agent(prompt, websocket))
    finally:
        try:
            loop.run_until_complete(asyncio.sleep(0))
        except Exception:
            pass
        loop.close()



