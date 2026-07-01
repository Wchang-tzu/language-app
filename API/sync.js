// ==========================================
// ☁️ 跨裝置同步 API
// 讀寫 Upstash Redis（透過 Vercel 自動注入的環境變數）
// 使用方式：
//   GET  /api/sync?code=你的同步碼      → 取得雲端資料
//   POST /api/sync  { code, data }      → 寫入雲端資料
// ==========================================

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function upstashGet(key) {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    if (!res.ok) throw new Error(`Upstash GET 失敗 (status ${res.status})`);
    const json = await res.json();
    return json.result; // 沒有資料時會是 null
}

async function upstashSet(key, value) {
    const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body: value // 直接把字串放在 body，Upstash 支援這種寫法
    });
    if (!res.ok) throw new Error(`Upstash SET 失敗 (status ${res.status})`);
    return res.json();
}

module.exports = async (req, res) => {
    // 允許同一個網域下的前端呼叫（同源即可，這行主要是保險）
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "伺服器尚未設定 KV_REST_API_URL / KV_REST_API_TOKEN 環境變數，請確認 Upstash 是否已 Connect to Project。" });
        return;
    }

    try {
        if (req.method === "GET") {
            const code = (req.query && req.query.code) || "";
            if (!code.trim()) {
                res.status(400).json({ error: "缺少同步碼 code" });
                return;
            }
            const key = `sync:${code.trim()}`;
            const raw = await upstashGet(key);

            if (!raw) {
                res.status(200).json({ found: false });
                return;
            }

            let data;
            try {
                data = JSON.parse(raw);
            } catch (e) {
                res.status(500).json({ error: "雲端資料格式錯誤，無法解析" });
                return;
            }

            res.status(200).json({ found: true, data });
            return;
        }

        if (req.method === "POST") {
            let body = req.body;
            if (typeof body === "string") {
                try { body = JSON.parse(body); } catch (e) { body = {}; }
            }
            const code = body && body.code;
            const data = body && body.data;

            if (!code || !String(code).trim()) {
                res.status(400).json({ error: "缺少同步碼 code" });
                return;
            }
            if (!data) {
                res.status(400).json({ error: "缺少要儲存的 data" });
                return;
            }

            const key = `sync:${String(code).trim()}`;
            const payload = JSON.stringify({ ...data, updatedAt: Date.now() });
            await upstashSet(key, payload);

            res.status(200).json({ success: true, updatedAt: Date.now() });
            return;
        }

        res.status(405).json({ error: "不支援的方法" });
    } catch (err) {
        res.status(500).json({ error: err.message || "伺服器發生錯誤" });
    }
};