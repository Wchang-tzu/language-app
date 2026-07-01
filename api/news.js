// api/news.js
// Vercel Serverless Function：後端代理，負責呼叫 GNews API
// API Key 放在伺服器端，不會暴露給使用者

export default async function handler(req, res) {
    // 允許任何網域的前端呼叫此後端（CORS）
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 瀏覽器預檢請求，直接回傳 OK
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // 只接受 GET 請求
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 從 Vercel 環境變數讀取 API Key（不寫死在程式碼裡）
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API Key 未設定，請至 Vercel 後台設定 GNEWS_API_KEY 環境變數" });
    }

    // 從前端傳來的參數
    const { topic, lang, country, max = 3 } = req.query;

    // 基本參數驗證
    if (!topic || !lang || !country) {
        return res.status(400).json({ error: "缺少必要參數：topic, lang, country" });
    }

    try {
        // 向 GNews API 發出請求（在伺服器端，沒有 CORS 限制）
        const gnewsUrl = `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
        const response = await fetch(gnewsUrl);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: `GNews API 錯誤：${response.status}`,
                detail: errorData
            });
        }

        const data = await response.json();

        // 回傳結果給前端，同時設定快取 10 分鐘（減少 API 呼叫次數）
        res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
        return res.status(200).json(data);

    } catch (err) {
        console.error("代理請求失敗：", err);
        return res.status(500).json({ error: "伺服器內部錯誤", detail: err.message });
    }
}