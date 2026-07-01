import requests
from bs4 import BeautifulSoup

url = "https://www.mcgill.ca/ipn/seminars"

# 模擬真人瀏覽器的外衣，防止被學校的防火牆當成惡意機器人阻擋
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print("正在連線到 McGill IPN 網站...")
response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("🎉 連線成功！正在抓取網頁內容...\n")
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 試著抓取網頁上所有的標題（h1, h2, h3），看看內容有沒有下載下來
    headings = soup.find_all(['h1', 'h2', 'h3'])
    for idx, h in enumerate(headings[:10], 1):
        print(f"[{idx}] {h.text.strip()}")
else:
    print(f"❌ 連線失敗，錯誤代碼：{response.status_code}")