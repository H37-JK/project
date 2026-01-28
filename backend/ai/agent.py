import base64
import time
import json
import re
import os
from playwright.sync_api import sync_playwright
import google.generativeai as genai
from PIL import Image
from backend.httpx.httpx_api import client
# from playwright_stealth import stealth_sync

genai.configure(api_key = os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

def save_image_from_element(element, filename):
    try:
        src = element.get_attribute("src")
        if not src:
            src = element.get_attribute("href")

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
                with client.stream("GET", src) as response:
                    if response.status_code == 200:
                        with open(f"downloads/{filename}.jpg", "wb") as file:
                            for chunk in response.iter_bytes():
                                file.write(chunk)
                            print(f"💾 [HTTPX] 저장 완료: downloads/{filename}.jpg")
                    else:
                        print(f"❌ 다운로드 실패 (상태 코드: {response.status_code})")
            except Exception as e:
                print(f"❌ HTTPX 요청 중 에러: {e}")

        else:
            print(f"❌ 알 수 없는 이미지 소스 입니다: {src[:30]}...")

    except Exception as e:
        print(f"❌ 저장 메인 로직 에러: {e}")



def get_ai_next_action(goal, history, screenshot_path):
    img = Image.open(screenshot_path)

    system_prompt = f"""
    너는 웹 브라우저 자동화 에이전트야.
    
    [사용자 목표]
    "{goal}"
    
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


def add_visual_tags(page):
    page.evaluate("""() => {
        document.querySelectorAll('.ai-label').forEach(element => element.remove());
        document.querySelectorAll('[data-ai-id]').forEach(element => {
            element.style.border = "";
            element.removeAttribute('data-ai-id');
        });
    }""")

    elements = page.query_selector_all('a, button, input, textarea, img, [role="button"]')
    visible_elements = []

    for index, element in enumerate(elements):
        if element.is_visible():
            visible_elements.append(element)
            page.evaluate("""([element, index]) => {
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

def run_browser_agent(goal):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless = False)
        page = browser.new_page()
        stealth_sync

        history = []

        for step in range(15):
            print(f"\n--- Step {step + 1} ---")

            try:
                visible_elements = add_visual_tags(page)
            except:
                visible_elements = []

            screenshot_path = "capture.png"
            page.screenshot(path = screenshot_path)

            print("🧠 생각 중...")
            action_data = get_ai_next_action(goal, history, screenshot_path)

            if not action_data:
                print("❌ AI 응답 실패. 재시도합니다.")
                continue

            print(f"🤖 AI의 결정: {action_data}")

            action_type = action_data.get("action")

            if action_type == "goto":
                url = action_data.get("url")
                print(f"🌐 이동: {url}")
                page.goto(url)
                history.append(f"Moved to {url}")

            elif action_type == "click":
                index = int(action_data.get("index"))
                if index < len(visible_elements):
                    print(f"🖱️ {index}번 요소 클릭")
                    visible_elements[index].click()
                    history.append(f"Clicked element {index}")

            elif action_type == "type":
                index = int(action_data.get("index"))
                text = action_data.get("text")
                if index < len(visible_elements):
                    print(f"⌨️ {index}번 요소에 '{text}' 입력")
                    visible_elements[index].fill(text)
                    history.append(f"Typed '{text}' into element {index}")

            elif action_type == "download":
                index = int(action_data.get("index"))
                if index < len(visible_elements):
                    target_element = visible_elements[index]
                    filename = f"image_{int(time.time())}"
                    save_image_from_element(target_element, filename)
                    history.append(f"Downloaded image index {index}")
                else:
                    print("❌ 잘못된 인덱스입니다.")

            elif action_type == "done":
                print("🎉 목표 달성! 종료 합니다.")
                break
            time.sleep(3)

        browser.close()


if __name__ == "__main__":
    goal1 = "네이버로 가서 아이디 these9907, 비밀번호 star8903!!??로 로그인 해줘"
    goal2 = "구굴로 가서 고양이 검색해서 아무 고양이 하나 이미지 다운 받아줘"

    run_browser_agent(goal2)