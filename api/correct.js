// ==========================================
// 🤖 AI 寫作批改 API（伺服器端，Key 不會外流）
// 讀取 Vercel 環境變數 GEMINI_API_KEY
// 使用方式：
//   POST /api/correct  { lang, prompt, referenceText, referenceTrans, essay }
// ==========================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-latest"; // ⚠️ gemini-2.0-flash 已於 2026/6/1 停用；改用官方會自動指向目前最新 Flash 模型的別名，避免以後又要手動更新

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "不支援的方法" });
        return;
    }

    if (!GEMINI_API_KEY) {
        res.status(500).json({ error: "伺服器尚未設定 GEMINI_API_KEY 環境變數，請到 Vercel 專案設定新增。" });
        return;
    }

    try {
        let body = req.body;
        if (typeof body === "string") {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }

        const { lang, prompt, referenceText, referenceTrans, essay } = body || {};

        if (!essay || !String(essay).trim()) {
            res.status(400).json({ error: "缺少學生寫的文章內容 (essay)" });
            return;
        }

        const promptText = `
你是一位專業的語言老師。現在學生正在進行一項基於影音的寫作練習。
學習語言：${lang || "未指定"}
題目要求：${prompt || "（無）"}
參考正確核心句：${referenceText || ""} (${referenceTrans || ""})

學生寫的文章如下：
"""
${essay}
"""

請用「繁體中文」為這篇文章進行批改。回傳格式請包含：
1. 綜合評價（讚美鼓勵，並指出大體問題）
2. 文法與用詞修正（列出寫錯的地方、原因、以及更好的建議寫法）
3. 老師範文（提供一兩句最道地、符合該情境的完美寫法）
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const geminiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await geminiRes.json();

        if (!geminiRes.ok) {
            res.status(geminiRes.status).json({ error: data.error?.message || "呼叫 Gemini API 失敗" });
            return;
        }

        const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!feedback) {
            res.status(500).json({ error: "Gemini 回傳格式異常，未取得批改內容" });
            return;
        }

        res.status(200).json({ feedback });
    } catch (err) {
        res.status(500).json({ error: err.message || "伺服器發生錯誤" });
    }
};