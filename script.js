// ==========================================
// 1. 核心數據庫 (已防呆，請確保此處為唯一宣告)
// ==========================================
const defaultDatabase = {
    ja: [
        { text: "チェックインをお願いします。", trans: "麻煩請幫我辦理入住。", example: "ちぇっくいんを おねがいします", exTrans: "（讀音提示）", category: "hotel" },
        { text: "予約の名前は王です。", trans: "預約的名字是姓王。", example: "よやくの なまえは おうです", exTrans: "（讀音提示）", category: "hotel" },
        { text: "お会計をお願いします。", trans: "麻煩請幫我結帳。", example: "おかいけいを おねがいします", exTrans: "（讀音提示）", category: "restaurant" }
    ],
    ko: [{ text: "체크인하고 싶어요.", trans: "我想辦理入住手續。", example: "왕 씨 이름으로 예약했어요.", exTrans: "用王先生的名字預約的。", category: "hotel" }],
    en: [{ text: "I would like to check in, please.", trans: "我想辦理入住手續。", example: "Under the name of Wang.", exTrans: "預約名字是王。", category: "hotel" }],
    de: [{ text: "Guten Tag, Einchecken bitte.", trans: "你好，我想辦理入住。", example: "Ich habe ein Zimmer reserviert.", exTrans: "我有預訂一間房間。", category: "hotel" }],
    fr: [{ text: "Bonjour, je voudrais enregistrer.", trans: "你好，我想辦理入住手續。", example: "Mon nom est Wang.", exTrans: "我的名字是王。", category: "hotel" }],
    es: [{ text: "Hola, me gustaría hacer el registro, por favor.", trans: "你好，我想辦理入住手續。", example: "A nombre de Wang.", exTrans: "預約名字是王。", category: "hotel" }],
    nan: [{ text: "食飽未？", trans: "吃飽了嗎？", example: "Tshia̍h-pá--bē?", exTrans: "（羅馬拼音提示）", category: "restaurant" }]
};

const frenchConjugations = [
    { verb: "être (是)", pronoun: "Je", answer: "suis", options: ["suis", "es", "est", "sommes"] },
    { verb: "être (是)", pronoun: "Tu", answer: "es", options: ["suis", "es", "est", "êtes"] },
    { verb: "être (是)", pronoun: "Nous", answer: "sommes", options: ["sommes", "êtes", "sont", "suis"] }
];

const spanishConjugations = [
    { verb: "ser (是/本質)", pronoun: "Yo", answer: "soy", options: ["soy", "eres", "es", "somos"] },
    { verb: "ser (出/本質)", pronoun: "Tú", answer: "eres", options: ["soy", "eres", "sois", "es"] }
];

// 五十音資料庫與相關合併
const kanaData = [
    { hiragana: 'あ', katakana: 'ア', romaji: 'a' }, { hiragana: 'い', katakana: 'イ', romaji: 'i' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u' }, { hiragana: 'え', katakana: 'エ', romaji: 'e' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o' }, { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki' }, { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke' }, { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa' }, { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su' }, { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so' }, { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi' }, { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te' }, { hiragana: 'と', katakana: 'ト', romaji: 'to' },
    { hiragana: 'な', katakana: 'ナ', romaji: 'na' }, { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' }, { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no' }, { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' }, { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' }, { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma' }, { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu' }, { hiragana: 'め', katakana: 'メ', romaji: 'me' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo' }, { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' }, { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' }, { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru' }, { hiragana: 'れ', katakana: 'レ', romaji: 're' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' }, { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' }, { hiragana: 'ん', katakana: 'ン', romaji: 'n' }
];
const dakuon = [
    { hiragana: "が", katakana: "ガ", romaji: "ga" }, { hiragana: "ぎ", katakana: "ギ", romaji: "gi" },
    { hiragana: "ぐ", katakana: "グ", romaji: "gu" }, { hiragana: "げ", katakana: "ゲ", romaji: "ge" },
    { hiragana: "ご", katakana: "ゴ", romaji: "go" }, { hiragana: "ざ", katakana: "ザ", romaji: "za" },
    { hiragana: "じ", katakana: "ジ", romaji: "ji" }, { hiragana: "ず", katakana: "ズ", romaji: "zu" },
    { hiragana: "ぜ", katakana: "ゼ", romaji: "ze" }, { hiragana: "ぞ", katakana: "ゾ", romaji: "zo" },
    { hiragana: "だ", katakana: "ダ", romaji: "da" }, { hiragana: "ぢ", katakana: "ヂ", romaji: "ji" },
    { hiragana: "づ", katakana: "ヅ", romaji: "zu" }, { hiragana: "で", katakana: "デ", romaji: "de" },
    { hiragana: "ど", katakana: "ド", romaji: "do" }, { hiragana: "ば", katakana: "バ", romaji: "ba" },
    { hiragana: "び", katakana: "ビ", romaji: "bi" }, { hiragana: "ぶ", katakana: "ブ", romaji: "bu" },
    { hiragana: "べ", katakana: "ベ", romaji: "be" }, { hiragana: "ぼ", katakana: "ボ", romaji: "bo" }
];
const handakuon = [
    { hiragana: "ぱ", katakana: "パ", romaji: "pa" }, { hiragana: "ぴ", katakana: "ピ", romaji: "pi" },
    { hiragana: "ぷ", katakana: "プ", romaji: "pu" }, { hiragana: "ぺ", katakana: "ペ", romaji: "pe" },
    { hiragana: "ぽ", katakana: "ポ", romaji: "po" }
];
const specialKana = [
    { hiragana: "きゃ", katakana: "キャ", romaji: "kya" }, { hiragana: "きゅ", katakana: "キュ", romaji: "kyu" }, { hiragana: "きょ", katakana: "キョ", romaji: "kyo" },
    { hiragana: "しゃ", katakana: "シャ", romaji: "sha" }, { hiragana: "しゅ", katakana: "シュ", romaji: "shu" }, { hiragana: "しょ", katakana: "ショ", romaji: "sho" },
    { hiragana: "ちゃ", katakana: "チャ", romaji: "cha" }, { hiragana: "ちゅ", katakana: "チュ", romaji: "chu" }, { hiragana: "ちょ", katakana: "チョ", romaji: "cho" },
    { hiragana: "にゃ", katakana: "ニャ", romaji: "nya" }, { hiragana: "にゅ", katakana: "ニュ", romaji: "nyu" }, { hiragana: "にょ", katakana: "ニョ", romaji: "nyo" },
    { hiragana: "ひゃ", katakana: "ヒャ", romaji: "hya" }, { hiragana: "ひゅ", katakana: "ヒュ", romaji: "hyu" }, { hiragana: "ひょ", katakana: "ヒョ", romaji: "hyo" },
    { hiragana: "みゃ", katakana: "ミャ", romaji: "mya" }, { hiragana: "みゅ", katakana: "ミュ", romaji: "myu" }, { hiragana: "みょ", katakana: "ミョ", romaji: "myo" },
    { hiragana: "りゃ", katakana: "リャ", romaji: "rya" }, { hiragana: "りゅ", katakana: "リュ", romaji: "ryu" }, { hiragana: "りょ", katakana: "リョ", romaji: "ryo" },
    { hiragana: "ぎゃ", katakana: "ギャ", romaji: "gya" }, { hiragana: "ぎゅ", katakana: "ギュ", romaji: "gyu" }, { hiragana: "ぎょ", katakana: "ギョ", romaji: "gyo" },
    { hiragana: "じゃ", katakana: "ジャ", romaji: "ja" }, { hiragana: "じゅ", katakana: "ジュ", romaji: "ju" }, { hiragana: "じょ", katakana: "ジョ", romaji: "jo" },
    { hiragana: "びゃ", katakana: "ビャ", romaji: "bya" }, { hiragana: "びゅ", katakana: "ビュ", romaji: "byu" }, { hiragana: "びょ", katakana: "ビョ", romaji: "byo" },
    { hiragana: "ぴゃ", katakana: "ピャ", romaji: "pya" }, { hiragana: "ぴゅ", katakana: "ピュ", romaji: "pyu" }, { hiragana: "ぴょ", katakana: "ピョ", romaji: "pyo" },
    { hiragana: "っ", katakana: "ッ", romaji: "tsu" }
];
const chouon = [{ hiragana: "ー", katakana: "ー", romaji: "-" }];

const fullKanaDatabase = [...kanaData, ...dakuon, ...handakuon, ...specialKana, ...chouon];
let currentKanaQuiz = null;

// ==========================================
// 2. 全域變數與快取
// ==========================================
let userDatabase = JSON.parse(localStorage.getItem("multiLangDynamicDB_v8")) || defaultDatabase;

// 🌐 語言中繼資料：預設 7 種語言 + 使用者自訂新增的語言
const defaultLangMeta = [
    { code: "ja", name: "日文", icon: "🇯🇵", speechLang: "ja-JP" },
    { code: "ko", name: "韓文", icon: "🇰🇷", speechLang: "ko-KR" },
    { code: "en", name: "英文", icon: "🇺🇸", speechLang: "en-US" },
    { code: "de", name: "德文", icon: "🇩🇪", speechLang: "de-DE" },
    { code: "fr", name: "法文", icon: "🇫🇷", speechLang: "fr-FR" },
    { code: "es", name: "西文", icon: "🇪🇸", speechLang: "es-ES" },
    { code: "nan", name: "台語", icon: "🇹🇼", speechLang: "" }
];

let customLanguages = JSON.parse(localStorage.getItem("multiLangCustomLangs_v1")) || [];

function saveCustomLanguages() {
    localStorage.setItem("multiLangCustomLangs_v1", JSON.stringify(customLanguages));
}

function getAllLanguages() {
    return [...defaultLangMeta, ...customLanguages];
}

function getLangMeta(code) {
    return getAllLanguages().find(l => l.code === code) || { code, name: code, icon: "🌐", speechLang: "" };
}

let userLinks = JSON.parse(localStorage.getItem("multiLangLinks_v8")) || [
    { title: "NHK Web Easy (日文新聞)", url: "https://www3.nhk.or.jp/news/easy/", type: "news" },
    { title: "Duolingo 多鄰國", url: "https://www.duolingo.com/", type: "other" }
];

let currentLang = "ja";
const modeMapping = ["dialogue", "listening", "cloze", "conjugation", "kana"];
let currentMode = "dialogue";
let currentCat = "all"; // 當前選擇的情境

let currentQuizIndex = 0;
let currentConjIndex = 0;
let currentClozeIndex = 0;
let currentNewsRegion = "";

// ☁️ 跨裝置同步碼（存在 localStorage，兩台裝置輸入同一組碼即可互通）
let syncCode = localStorage.getItem("multiLangSyncCode_v1") || "";

// 儲存動態情境清單 (預設含四大情境)
let categories = JSON.parse(localStorage.getItem("multiLangCategories_v8")) || [
    { id: "all", name: "全部情境展示", icon: "🌐" },
    { id: "food", name: "餐飲美食", icon: "🍱" },
    { id: "hotel", name: "飯店住宿", icon: "🏨" },
    { id: "transport", name: "交通運輸", icon: "🚇" },
    { id: "shopping", name: "購物血拼", icon: "🛍️" },
    { id: "rare", name: "生僻字", icon: "🧠" }
];

// 🔄 舊使用者的 localStorage 裡可能還沒有「生僻字」這個情境，自動補上一次
if (!categories.some(c => c.id === "rare")) {
    categories.push({ id: "rare", name: "生僻字", icon: "🧠" });
    localStorage.setItem("multiLangCategories_v8", JSON.stringify(categories));
}

// DOM 元素快取 (加上安全防呆，免得 HTML 還沒完全渲染出來)
let mainContent = document.getElementById("mainContent");
let siteTitle = document.getElementById("siteTitle");
let langButtons = document.querySelectorAll(".lang-btn");
let modeButtons = document.querySelectorAll(".mode-btn");

function saveToStorage() {
    localStorage.setItem("multiLangDynamicDB_v8", JSON.stringify(userDatabase));
}

function saveLinksToStorage() {
    localStorage.setItem("multiLangLinks_v8", JSON.stringify(userLinks));
}

function saveCategoriesToStorage() {
    localStorage.setItem("multiLangCategories_v8", JSON.stringify(categories));
}

// ==========================================
// 3. 核心功能與發音引擎
// ==========================================
function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const meta = getLangMeta(lang);
        if (!meta.speechLang) return; // 沒有設定語音代碼的語言（例如台語、或未填寫的自訂語言）就不發聲
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = meta.speechLang;
        window.speechSynthesis.speak(utterance);
    }
}

function getFilteredList() {
    const list = userDatabase[currentLang] || [];
    if (currentCat === "all") return list;
    return list.filter(item => item.category === currentCat);
}

function buildQuizData() {
    const currentList = getFilteredList();
    if (currentList.length === 0) return null;
    const currentItem = currentList[currentQuizIndex % currentList.length];
    let allTranslations = currentList.map(item => item.trans);
    let wrongOptions = allTranslations.filter(t => t !== currentItem.trans);
    const buffers = ["請給我水", "多少錢？", "謝謝", "不用袋子"];
    while (wrongOptions.length < 3) {
        let randomBuf = buffers[Math.floor(Math.random() * buffers.length)];
        if (!wrongOptions.includes(randomBuf) && randomBuf !== currentItem.trans) wrongOptions.push(randomBuf);
    }
    let finalOptions = wrongOptions.slice(0, 3); finalOptions.push(currentItem.trans);
    finalOptions.sort(() => Math.random() - 0.5);
    return { item: currentItem, audioText: currentItem.text, answer: currentItem.trans, options: finalOptions };
}

// 🛠️ 快速編輯／刪除（讓字卡認識、聽力測驗、智慧拼寫都能直接在原地修改或刪除，不用跑去第五頁）
// 用「物件參照」在 userDatabase[currentLang] 裡找到正確位置，就算目前畫面有依情境過濾也不會找錯筆
function editWordItem(item) {
    const list = userDatabase[currentLang] || [];
    const idx = list.indexOf(item);
    if (idx === -1) { alert("找不到這筆資料，可能剛好被更新過，麻煩到第五頁管理中心操作。"); return; }

    const newText = prompt("1/3 修改外文內容：", item.text);
    if (newText === null) return;
    if (!newText.trim()) { alert("核心內容不能為空！"); return; }

    const newTrans = prompt("2/3 修改中文翻譯：", item.trans);
    if (newTrans === null) return;
    if (!newTrans.trim()) { alert("翻譯不能為空！"); return; }

    const newEx = prompt("3/3 修改延伸句子/音標提示：", item.example || "");
    if (newEx === null) return;

    list[idx] = { ...item, text: newText.trim(), trans: newTrans.trim(), example: newEx.trim() };
    saveToStorage();
    updateUI();
}

function deleteWordItem(item) {
    const list = userDatabase[currentLang] || [];
    const idx = list.indexOf(item);
    if (idx === -1) { alert("找不到這筆資料，可能剛好被更新過，麻煩到第五頁管理中心操作。"); return; }

    if (confirm(`確定要將「${item.text}」從字庫中徹底刪除嗎？`)) {
        list.splice(idx, 1);
        saveToStorage();
        updateUI();
    }
}

// ==========================================
// 4. 各頁面與特訓模式渲染引擎
// ==========================================

// 🌐 第一頁：語系選單動態渲染（預設語言 + 使用者自訂語言 + 新增按鈕）
function renderLangGrid() {
    const grid = document.getElementById("langGrid");
    if (!grid) return;

    const allLangs = getAllLanguages();

    grid.innerHTML = allLangs.map(lang => `
        <button class="lang-btn ${lang.code === currentLang ? 'active' : ''}" onclick="selectLanguage('${lang.code}')">${lang.icon} ${lang.name}</button>
    `).join('') + `
        <button class="lang-btn" onclick="addNewLanguageFlow()" style="border-style:dashed; color:#718096;">➕ 新增語言</button>
    `;
}

// 點擊語系按鈕：切換語言並重新渲染目前所在的頁面
window.selectLanguage = function (code) {
    currentLang = code;
    renderLangGrid();

    const activePage = document.querySelector('.app-page.active');
    if (activePage && activePage.id === "page5") renderPage5ImportCenter();
    else if (activePage && activePage.id === "page2") renderCategoryPage();
    else updateUI();
};

// 新增自訂語言的彈窗流程
window.addNewLanguageFlow = function () {
    const name = prompt("請輸入新語言名稱（例如：泰文、越南文、義大利文）：");
    if (!name || !name.trim()) return;

    const icon = prompt("請為這個語言選一個代表國旗/圖標的 Emoji（例如：🇹🇭、🇻🇳、🇮🇹）：", "🌐") || "🌐";

    const speechLang = prompt(
        "（選填）如果想開啟語音朗讀功能，請輸入該語言的語音代碼：\n例如泰文 th-TH、越南文 vi-VN、義大利文 it-IT。\n不確定可以留空——留空的話這個語言就不會有朗讀功能，但其他功能都正常。",
        ""
    ) || "";

    const code = "custom_" + Date.now();
    customLanguages.push({ code, name: name.trim(), icon, speechLang: speechLang.trim() });
    saveCustomLanguages();

    if (!userDatabase[code]) userDatabase[code] = [];
    saveToStorage();

    currentLang = code;
    renderLangGrid();
    alert(`🎉 已新增「${name.trim()}」！\n可以到第五頁「引進庫」開始新增這個語言的字句囉！`);
};

// 💡 核心修改：第二頁（情境選擇頁）專屬渲染函式
function renderCategoryPage() {
    const page2Container = document.getElementById("page2");
    if (!page2Container) return;

    page2Container.innerHTML = `
        <h2 style="text-align:center; color:#2d3748; margin-bottom:10px;">🧳 選擇學習情境</h2>
        <p style="text-align:center; color:#718096; font-size:14px; margin-bottom:25px;">點選下方情境，系統將引導你進入第三頁進行深度特訓</p>
        
        <div id="categoryGrid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:15px; padding:10px;">
            ${categories.map(cat => `
                <button onclick="selectCategoryAndGo('${cat.id}')" class="cat-card-btn" style="background:#fff; border:2px solid #e2e8f0; border-radius:16px; padding:20px 15px; cursor:pointer; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:all 0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">
                    <span style="font-size:32px;">${cat.icon}</span>
                    <span style="font-size:15px; font-weight:bold; color:#2d3748;">${cat.name}</span>
                </button>
            `).join('')}
            
            <button onclick="addNewCustomCategory()" class="cat-card-btn" style="background:#f7fafc; border:2px dashed #cbd5e0; border-radius:16px; padding:20px 15px; cursor:pointer; text-align:center; transition:all 0.2s; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;">
                <span style="font-size:32px; color:#a0aec0;">➕</span>
                <span style="font-size:15px; font-weight:bold; color:#718096;">自訂全新情境</span>
            </button>
        </div>
    `;
}

// 點擊情境按鈕的連動邏輯
window.selectCategoryAndGo = function (catId) {
    currentCat = catId;
    // 自動導向第三頁 (特訓練習頁)
    navigateToPage(3);
};

// 建立全新自訂情境的彈窗邏輯
window.addNewCustomCategory = function () {
    const catName = prompt("請輸入自訂情境名稱（例如：機場出入境、商務會議）：");
    if (!catName || !catName.trim()) return;

    const catIcon = prompt("請為這個情境選一個 Emoji 圖標（例如：✈️、💼）：", "📁");
    const catId = "custom_" + Date.now();

    categories.push({ id: catId, name: catName.trim(), icon: catIcon || "📁" });
    saveCategoriesToStorage();
    renderCategoryPage(); // 重繪情境牆
};

// 💡 第三頁（特訓模式切換與更新）
function updateUI() {
    if (siteTitle) siteTitle.innerText = `🌍 旅遊${getLangMeta(currentLang).name}隨身包`;

    // 重新抓取容器，維持 SPA 特性
    mainContent = document.getElementById("mainContent");
    if (!mainContent) return;
    mainContent.innerHTML = "";

    const exInputEl = document.getElementById("exInput");
    if (exInputEl) {
        exInputEl.placeholder = currentLang === "ja" ? "輸入平假名/片假名讀音 (推薦)" : "延伸句子/拼音提示 (選填)";
    }

    // 根據當前選擇的模式渲染第三頁主區塊
    if (currentMode === "cloze") renderClozeMode();
    else if (currentMode === "conjugation") renderConjugationMode();
    else if (currentMode === "dialogue") renderDialogueMode();
    else if (currentMode === "listening") renderListeningMode();
    else if (currentMode === "kana") renderKanaMode();
    else if (currentMode === "writing") renderWritingMode();

    // 同步重新整理第四頁看板（如果存在的話）
    renderNewsLinks();
    renderMyLinks();
}

function renderClozeMode() {
    const data = getFilteredList();
    if (data.length === 0) {
        mainContent.innerHTML = `<div style='text-align:center;color:#999;padding:40px;'>此情境 (${currentCat}) 沒有自訂字詞，無法產生拼字填空題！<br><br><button onclick="navigateToPage(2)" style="padding:8px 16px; background:#2b6cb0; color:#fff; border:none; border-radius:6px; cursor:pointer;">返回選擇其他情境</button></div>`;
        return;
    }
    const currentItem = data[currentClozeIndex % data.length];
    const fullText = currentItem.text;
    let displayPrompt = ""; let answerSegment = "";

    if (fullText.includes(" ")) {
        let words = fullText.split(" ");
        let targetIdx = Math.floor(words.length / 2);
        answerSegment = words[targetIdx].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?？。]/g, "");
        words[targetIdx] = words[targetIdx].replace(answerSegment, "_______");
        displayPrompt = words.join(" ");
    } else {
        let len = fullText.length;
        if (len <= 3) { answerSegment = fullText; displayPrompt = "___"; }
        else {
            let start = Math.floor(len / 4); let deleteLen = Math.ceil(len / 2);
            answerSegment = fullText.substr(start, deleteLen).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?？。]/g, "");
            displayPrompt = fullText.substring(0, start) + "_______" + fullText.substring(start + deleteLen);
        }
    }

    let hintHtml = (currentLang === "ja" && currentItem.example) ? `<div style="font-size: 14px; color: #6c757d; margin-bottom: 15px;">📢 讀音提示：${currentItem.example}</div>` : "";

    mainContent.innerHTML = `
        <div class="quiz-box">
            <h3>⌨️ 智慧拼寫與造句填空</h3>
            <div class="cloze-trans-prompt">🤝 中文提示：${currentItem.trans}</div>
            ${hintHtml}
            <div class="cloze-sentence-display">${displayPrompt}</div>
            <input type="text" id="clozeInput" class="cloze-input-field" placeholder="請在此輸入挖空處的正確外文" autocomplete="off">
            <button id="clozeSubmitBtn" class="submit-answer-btn">送出檢查</button>
            <p id="clozeFeedback" style="margin-top:20px; font-weight:bold; font-size:18px;"></p>
            <div style="display:flex; gap:8px; justify-content:center; margin-top:15px;">
                <button id="clozeEditBtn" style="background:#ecc94b; color:#744210; border:none; padding:6px 14px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:bold;">✏️ 編輯這句</button>
                <button id="clozeDeleteBtn" style="background:#e53e3e; color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:bold;">🗑️ 刪除這句</button>
            </div>
        </div>`;

    const inputField = document.getElementById("clozeInput");
    const feedback = document.getElementById("clozeFeedback");
    if (inputField) {
        inputField.focus();
        document.getElementById("clozeSubmitBtn").addEventListener("click", checkAns);
        inputField.addEventListener("keypress", (e) => { if (e.key === "Enter") checkAns(); });
    }
    document.getElementById("clozeEditBtn").addEventListener("click", () => editWordItem(currentItem));
    document.getElementById("clozeDeleteBtn").addEventListener("click", () => deleteWordItem(currentItem));

    function checkAns() {
        if (inputField.value.trim().toLowerCase() === answerSegment.trim().toLowerCase()) {
            feedback.innerHTML = `<span style='color:green'>⭕ 完美答對！ 正確答案：${fullText}</span>`;
            speak(fullText, currentLang);
            setTimeout(() => { currentClozeIndex++; updateUI(); }, 2000);
        } else {
            feedback.innerHTML = `<span style='color:red'>❌ 拼寫不對喔，再試一次！</span>`;
        }
    }
}

function renderConjugationMode() {
    if (currentLang !== "fr" && currentLang !== "es") {
        mainContent.innerHTML = `<div style='text-align:center; padding:30px; color:#666;'><p>💡 動詞變化目前特訓：<b>🇫🇷 法文</b> 與 <b>🇪🇸 西班牙文</b></p></div>`;
        return;
    }
    const pool = currentLang === "fr" ? frenchConjugations : spanishConjugations;
    const q = pool[currentConjIndex % pool.length];

    mainContent.innerHTML = `
        <div class="quiz-box">
            <h3>✍️ 動詞現在式特訓</h3>
            <div class="conjugation-prompt">${q.pronoun} [ _______ ]</div>
            <div class="conjugation-hint">目標動詞: <b>${q.verb}</b></div>
            <div class="options-grid" id="conjGrid"></div>
            <p id="conjFeedback" style="margin-top:20px; font-weight:bold; font-size:18px;"></p>
        </div>`;

    const grid = document.getElementById("conjGrid");
    const feedback = document.getElementById("conjFeedback");

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = option;
        btn.addEventListener("click", () => {
            if (option === q.answer) {
                feedback.innerHTML = "<span style='color:green'>⭕ 太棒了！</span>";
                speak(`${q.pronoun} ${q.answer}`, currentLang);
                setTimeout(() => { currentConjIndex++; updateUI(); }, 1200);
            } else {
                feedback.innerHTML = "<span style='color:red'>❌ 再想一下。</span>";
            }
        });
        grid.appendChild(btn);
    });
}

function renderDialogueMode() {
    const data = getFilteredList();
    if (data.length === 0) {
        mainContent.innerHTML = `<div style='text-align:center;color:#999;padding:40px;'>此情境目前沒有任何用語，快去第五頁管理中心新增一個吧！<br><br><button onclick="navigateToPage(5)" style="padding:8px 16px; background:#2b6cb0; color:#fff; border:none; border-radius:6px; cursor:pointer;">前往管理中心</button></div>`;
        return;
    }
    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "flashcard";

        const header = document.createElement("div");
        header.className = "card-header";
        header.innerHTML = `<span>${item.text}</span>`;

        const btn = document.createElement("button");
        btn.className = "audio-btn";
        btn.innerHTML = "🔊";
        btn.addEventListener("click", (e) => { e.stopPropagation(); speak(item.text, currentLang); });

        const editBtn = document.createElement("button");
        editBtn.className = "audio-btn";
        editBtn.style.background = "#ecc94b";
        editBtn.style.color = "#744210";
        editBtn.innerHTML = "✏️";
        editBtn.title = "編輯這句";
        editBtn.addEventListener("click", (e) => { e.stopPropagation(); editWordItem(item); });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "audio-btn";
        deleteBtn.style.background = "#e53e3e";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "刪除這句";
        deleteBtn.addEventListener("click", (e) => { e.stopPropagation(); deleteWordItem(item); });

        header.appendChild(btn);
        header.appendChild(editBtn);
        header.appendChild(deleteBtn);
        card.appendChild(header);

        const ex = document.createElement("div");
        ex.className = "card-example";
        ex.innerText = currentLang === "ja" ? "🔍 點擊顯示平假名讀音與翻譯" : (item.example ? `💡 延伸: ${item.example}` : "（無延伸句）");
        card.appendChild(ex);

        let isFlip = false;
        card.addEventListener("click", () => {
            isFlip = !isFlip;
            header.querySelector("span").innerText = isFlip ? item.trans : item.text;
            if (currentLang === "ja") {
                ex.innerHTML = isFlip ? `🎌 讀音: <b style="color:#007BFF">${item.example || '未設定'}</b>` : "🔍 點擊顯示平假名讀音與翻譯";
            } else {
                ex.innerText = isFlip ? `🤝 翻譯: ${item.exTrans || '—'}` : (item.example ? `💡 延伸: ${item.example}` : "（無延伸句）");
            }
            btn.style.display = isFlip ? "none" : "inline-flex";
            editBtn.style.display = isFlip ? "none" : "inline-flex";
            deleteBtn.style.display = isFlip ? "none" : "inline-flex";
        });
        mainContent.appendChild(card);
    });
}

const nanYouTubeVideos = {
    hotel: { id: "DLomdmQyY0Y", title: "輕輕鬆鬆學閩南語：生活會話入門", desc: "包含問候、住宿、日常對話等實用台語" },
    restaurant: { id: "4DDmhVlmDUQ", title: "由零開始學台語：第一堂台語課", desc: "包含飲食、點餐、日常用語等基礎台語" },
    transport: { id: "KdY3Qw5Mo6Q", title: "民視講台語當著時：聲調與基礎會話", desc: "包含問路、交通、方向等實用台語" },
    shopping: { id: "yH_MF08PPIQ", title: "民視講台語當著時：台語語言能力", desc: "包含討價還價、購物用語等實用台語" },
    all: { id: "DLomdmQyY0Y", title: "輕輕鬆鬆學閩南語：生活會話入門", desc: "涵蓋各種生活情境的實用台語會話" }
};

function renderListeningMode() {
    if (currentLang === "nan") {
        const videoInfo = nanYouTubeVideos[currentCat] || nanYouTubeVideos["all"];
        mainContent.innerHTML = `
            <div style="padding: 10px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; color: white;">
                    <div style="font-size: 15px; font-weight: bold; margin-bottom: 4px;">🎬 ${videoInfo.title}</div>
                    <div style="font-size: 12px; opacity: 0.9;">${videoInfo.desc}</div>
                </div>
                <div style="position: relative; width: 100%; padding-bottom: 56.25%; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                    <iframe src="https://www.youtube.com/embed/${videoInfo.id}?rel=0&modestbranding=1" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div style="margin-top: 14px; background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #276749; line-height: 1.6;">
                    💡 台語目前沒有標準語音引擎，改以真人教學影片輔助聽力練習。觀看影片後可切換至「字卡認識」繼續練習。
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <a href="https://www.youtube.com/watch?v=${videoInfo.id}" target="_blank" rel="noopener noreferrer" style="flex: 1; display: block; text-align: center; padding: 10px; background: #ff0000; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">▶ 在 YouTube 全螢幕觀看</a>
                    <a href="https://www.youtube.com/playlist?list=PLe8vfIFNtjRcbTvj_qwwwxbaaeIukdZTE" target="_blank" rel="noopener noreferrer" style="flex: 1; display: block; text-align: center; padding: 10px; background: #4a5568; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">📺 更多台語教學</a>
                </div>
            </div>`;
        return;
    }

    const quizData = buildQuizData();
    if (!quizData) {
        mainContent.innerHTML = "<p style='text-align:center;color:#999;padding:20px;'>此情境沒有用語可產生聽力題目！</p>";
        return;
    }
    mainContent.innerHTML = `
        <div class="quiz-box">
            <h3>🎧 情境聽力測驗</h3>
            <button class="play-quiz-btn" id="quizAudioBtn">📢 播放題目語音</button>
            <div class="options-grid" id="optionsGrid"></div>
            <p id="quizFeedback" style="margin-top:15px; font-weight:bold;"></p>
            <div style="display:flex; gap:8px; justify-content:center; margin-top:15px;">
                <button id="quizEditBtn" style="background:#ecc94b; color:#744210; border:none; padding:6px 14px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:bold;">✏️ 編輯這題</button>
                <button id="quizDeleteBtn" style="background:#e53e3e; color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:bold;">🗑️ 刪除這題</button>
            </div>
        </div>`;

    document.getElementById("quizAudioBtn").addEventListener("click", () => speak(quizData.audioText, currentLang));
    document.getElementById("quizEditBtn").addEventListener("click", () => editWordItem(quizData.item));
    document.getElementById("quizDeleteBtn").addEventListener("click", () => deleteWordItem(quizData.item));

    const grid = document.getElementById("optionsGrid");
    const feedback = document.getElementById("quizFeedback");

    quizData.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = option;
        btn.addEventListener("click", () => {
            if (option === quizData.answer) {
                feedback.innerHTML = "<span style='color:green'>⭕ 答對了！</span>";
                setTimeout(() => { currentQuizIndex++; updateUI(); }, 1000);
            } else {
                feedback.innerHTML = "<span style='color:red'>❌ 答錯囉！</span>";
            }
        });
        grid.appendChild(btn);
    });
}

function renderKanaMode() {
    if (currentLang !== 'ja') {
        mainContent.innerHTML = `
            <div style="text-align:center; padding:40px; color:#718096;">
                <h3>🇯🇵 五十音特訓為日文專屬功能</h3>
                <p>請先在上方「語系」切換為日文唷！</p>
            </div>`;
        return;
    }

    mainContent.innerHTML = `
        <div class="kana-container" style="width: 100%; max-width: 500px; margin: 0 auto;">
            <div class="kana-quiz-box" style="background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.08); text-align:center; margin-bottom:20px; border: 1px solid #e2e8f0;">
                <h4 style="margin:0 0 10px 0; color:#4a5568; font-size:16px;">🧠 五十音全字元隨機測驗</h4>
                <div id="kanaQuestion" style="font-size:56px; font-weight:bold; color:#2b6cb0; margin:10px 0; min-height:80px; display:flex; align-items:center; justify-content:center;">--</div>
                <p id="kanaPrompt" style="color:#718096; margin-bottom:15px; font-size:14px;">請輸入這個字的羅馬拼音</p>
                <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
                    <input type="text" id="kanaAnswerInput" placeholder="拼音..." style="padding:10px; border:2px solid #e2e8f0; border-radius:8px; width:120px; text-align:center; font-size:18px; outline:none;" autocomplete="off">
                    <button id="kanaSubmitBtn" style="background:#2b6cb0; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:15px;">對答案</button>
                </div>
                <div id="kanaResult" style="margin-top:15px; font-weight:bold; font-size:16px; min-height:24px;"></div>
            </div>

            <div class="kana-chart-box" style="background:#f7fafc; padding:15px; border-radius:12px; border: 1px solid #e2e8f0;">
                <h4 style="margin:0 0 12px 0; color:#4a5568; text-align:center; font-size:15px;">📋 五十音快速對照表 (目前顯示：清音)</h4>
                <div class="kana-grid" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:8px; max-height:240px; overflow-y:auto; padding:5px;">
                    ${kanaData.map(k => `
                        <div style="background:#fff; border:1px solid #edf2f7; border-radius:6px; padding:6px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                            <div style="font-size:15px; font-weight:bold; color:#2d3748;">${k.hiragana}${k.katakana}</div>
                            <div style="color:#a0aec0; font-size:11px; font-weight:500;">${k.romaji}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

    document.getElementById("kanaSubmitBtn").addEventListener("click", checkKanaAnswer);
    document.getElementById("kanaAnswerInput").addEventListener("keypress", (e) => { if (e.key === "Enter") checkKanaAnswer(); });
    generateKanaQuestion();
}

function generateKanaQuestion() {
    const qEl = document.getElementById('kanaQuestion');
    const pEl = document.getElementById('kanaPrompt');
    const iEl = document.getElementById('kanaAnswerInput');
    const rEl = document.getElementById('kanaResult');
    if (!qEl || !pEl || !iEl) return;

    const rand = fullKanaDatabase[Math.floor(Math.random() * fullKanaDatabase.length)];
    const isHiragana = Math.random() > 0.5;

    currentKanaQuiz = {
        question: isHiragana ? rand.hiragana : rand.katakana,
        answer: rand.romaji,
        type: isHiragana ? '平假名' : '片假名'
    };

    qEl.innerText = currentKanaQuiz.question;
    pEl.innerText = `請輸入這個 ${currentKanaQuiz.type} 的羅馬拼音 (小寫):`;
    iEl.value = '';
    iEl.focus();
    rEl.innerText = '';
}

function checkKanaAnswer() {
    const inputField = document.getElementById('kanaAnswerInput');
    const resultField = document.getElementById('kanaResult');
    if (!inputField || !resultField || !currentKanaQuiz) return;

    const userAnswer = inputField.value.trim().toLowerCase();

    if (userAnswer === currentKanaQuiz.answer) {
        resultField.style.color = '#38a169';
        resultField.innerText = '🎉 答對了！太厲害了！';
        setTimeout(generateKanaQuestion, 1200);
    } else {
        resultField.style.color = '#e53e3e';
        resultField.innerText = `❌ 答錯囉！答案是 [ ${currentKanaQuiz.answer} ]`;
    }
}

// ==========================================
// 4.5 ✍️ 寫作特訓（英文：依照使用者自己新增的單字/句子動態出題）
// ==========================================

// 段落儲存結構：{ en: { "單字文字": { text, savedAt } }, fr: {...} }
let writingParagraphs = JSON.parse(localStorage.getItem("multiLangWritingParagraphs_v1")) || {};
let writingIndex = 0;
let writingReviewOpen = false;

function saveWritingParagraphsToStorage() {
    localStorage.setItem("multiLangWritingParagraphs_v1", JSON.stringify(writingParagraphs));
}

function getWritingParagraph(word) {
    return (writingParagraphs[currentLang] || {})[word] || null;
}

function saveWritingParagraph(word, text) {
    if (!writingParagraphs[currentLang]) writingParagraphs[currentLang] = {};
    writingParagraphs[currentLang][word] = { text, savedAt: Date.now() };
    saveWritingParagraphsToStorage();
}

function countWrittenParagraphs() {
    return Object.keys(writingParagraphs[currentLang] || {}).length;
}

function renderWritingMode() {
    // 目前動態版只做英文；法文維持原本「下載 Word 練習檔＋手機草稿」的方式
    if (currentLang === 'fr') {
        mainContent.innerHTML = `
            <div class="quiz-box" style="padding: 15px; background: #fff; border-radius: 12px; box-shadow: inset 0 0 5px rgba(0,0,0,0.05); text-align: left;">
                <h3 style="color: #e53e3e; margin-top: 0;">🇫🇷 Compréhension Écrite</h3>
                
                <div style="background: #f7fafc; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #e53e3e;">
                    <strong style="display:block; margin-bottom: 5px;">💻 Envie d'écrire sur PC ?</strong>
                    <span style="font-size: 13px; color: #4a5568; display:block; margin-bottom: 10px;">點擊下方按鈕直接下載並使用 Word 開啟法文練習檔：</span>
                    <a href="./Comprehension_ecrit.docx" download class="btn-primary" style="display: inline-block; text-decoration: none; font-size: 14px; padding: 8px 16px; background: #e53e3e; color: white; border-radius: 6px;">
                        📥 開啟 Comprehension ecrit.docx
                    </a>
                </div>

                <div style="background: #f7fafc; padding: 12px; border-radius: 8px;">
                    <strong style="display:block; margin-bottom: 5px;">📱 Sur mobile ?</strong>
                    <span style="font-size: 13px; color: #4a5568; display:block; margin-bottom: 10px;">利用手機短暫時間，直接在下方輸入法文簡答：</span>
                    <textarea id="phoneWritingDraftFr" placeholder="Écrivez votre texte ici..." style="width: 100%; height: 120px; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e0; font-size: 15px; box-sizing: border-box; resize: vertical;"></textarea>
                    <button class="btn-primary" style="margin-top: 8px; font-size: 13px; padding: 6px 12px; background: #e53e3e; color: white; border-radius: 6px;" onclick="alert('📝 Brouillon enregistré !')">💾 Enregistrer</button>
                </div>
            </div>
        `;
        return;
    }

    if (currentLang !== 'en') {
        mainContent.innerHTML = `
            <div class="quiz-box" style="text-align: center; padding: 30px; color: #718096;">
                <h3>✍️ 寫作特訓</h3>
                <p>目前動態寫作特訓主要針對「英文」設計，其他語言可以先試試其他練習模式！</p>
            </div>
        `;
        return;
    }

    // 📚 回顧模式：顯示所有已完成的段落
    if (writingReviewOpen) {
        const entries = Object.entries(writingParagraphs[currentLang] || {});
        mainContent.innerHTML = `
            <div style="padding: 5px;">
                <div style="display:flex; gap:8px; margin-bottom:15px; flex-wrap:wrap;">
                    <button id="writingBackBtn" style="background:#718096; color:#fff; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-size:13px;">⬅️ 返回練習</button>
                    <button id="writingExportBtn" style="background:#2b6cb0; color:#fff; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-size:13px;">📥 匯出成 Word</button>
                </div>
                <h3 style="margin-bottom:15px;">📚 已完成的段落（${entries.length} 篇）</h3>
                ${entries.length === 0
                ? '<p style="color:#a0aec0; text-align:center;">還沒有任何已儲存的段落</p>'
                : entries.map(([word, data]) => `
                        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom:12px;">
                            <div style="font-weight:bold; color:#2b6cb0; margin-bottom:6px;">${word}</div>
                            <div style="font-size:14px; color:#4a5568; line-height:1.6; white-space:pre-wrap;">${data.text}</div>
                        </div>
                    `).join('')
            }
            </div>
        `;
        document.getElementById("writingBackBtn").addEventListener("click", () => {
            writingReviewOpen = false;
            updateUI();
        });
        document.getElementById("writingExportBtn").addEventListener("click", exportWritingToDocx);
        return;
    }

    // ✍️ 練習模式：依情境過濾出來的單字/句子清單，逐一出題
    const data = getFilteredList();
    if (data.length === 0) {
        mainContent.innerHTML = `<div style='text-align:center;color:#999;padding:40px;'>此情境目前沒有任何單字/句子，快去引進庫新增幾個，才能開始寫作特訓唷！<br><br><button onclick="navigateToPage(5)" style="padding:8px 16px; background:#2b6cb0; color:#fff; border:none; border-radius:6px; cursor:pointer;">前往引進庫</button></div>`;
        return;
    }

    const item = data[writingIndex % data.length];
    const saved = getWritingParagraph(item.text);
    const reviewCount = countWrittenParagraphs();

    mainContent.innerHTML = `
        <div class="quiz-box" style="text-align:left; padding: 15px;">
            <h3 style="text-align:center; margin-top:0;">🇬🇧 英文寫作特訓</h3>

            <div style="background: #ebf8ff; border-left: 4px solid #2b6cb0; padding: 12px 14px; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-size: 13px; color: #4a5568; margin-bottom: 4px;">請至少用 3-4 句話，寫一小段用到下面這個單字/句子的英文段落：</div>
                <div style="font-size: 22px; font-weight: bold; color: #2b6cb0;">${item.text}</div>
                <div style="font-size: 13px; color: #718096; margin-top: 4px;">中文意思：${item.trans}</div>
            </div>

            <textarea id="writingArea" placeholder="Write a short paragraph (at least 3-4 sentences) using the word/phrase above..." style="width: 100%; height: 160px; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e0; font-size: 15px; box-sizing: border-box; resize: vertical;">${saved ? saved.text : ''}</textarea>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <span id="writingWordCount" style="font-size:12px; color:#a0aec0;"></span>
                <span id="writingSaveStatus" style="font-size:12px; color:#38a169; font-weight:bold;"></span>
            </div>

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button id="writingSaveBtn" class="btn-primary" style="flex:1; padding:10px;">💾 儲存這段</button>
                <button id="writingNextBtn" style="flex:1; padding:10px; background:#718096; color:#fff; border:none; border-radius:25px; font-weight:bold; cursor:pointer;">下一個單字 ➡️</button>
            </div>

            ${reviewCount > 0 ? `
            <div style="margin-top:15px; display:flex; gap:16px; justify-content:center; align-items:center;">
                <button id="writingReviewBtn" style="background:none; border:none; color:#2b6cb0; text-decoration:underline; cursor:pointer; font-size:13px;">📚 查看所有已完成的段落（${reviewCount} 篇）</button>
                <button id="writingExportBtnInline" style="background:none; border:none; color:#38a169; text-decoration:underline; cursor:pointer; font-size:13px;">📥 匯出成 Word</button>
            </div>` : ''}
        </div>
    `;

    const textarea = document.getElementById("writingArea");
    const wordCountEl = document.getElementById("writingWordCount");
    const saveStatusEl = document.getElementById("writingSaveStatus");

    function updateCount() {
        const text = textarea.value.trim();
        const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const sentenceCount = (text.match(/[.!?]+/g) || []).length;
        wordCountEl.innerText = `${wordCount} 字・約 ${sentenceCount} 句`;
    }
    updateCount();
    textarea.addEventListener("input", updateCount);

    document.getElementById("writingSaveBtn").addEventListener("click", () => {
        const text = textarea.value.trim();
        if (!text) { alert("請先寫一點內容再儲存唷！"); return; }
        const sentenceCount = (text.match(/[.!?]+/g) || []).length;
        if (sentenceCount < 2) {
            if (!confirm("目前看起來還不到 2 句話，確定要先儲存嗎？（建議至少寫 3-4 句）")) return;
        }
        saveWritingParagraph(item.text, text);
        saveStatusEl.innerText = "✅ 已儲存！";
        setTimeout(() => { if (saveStatusEl) saveStatusEl.innerText = ""; }, 2000);
    });

    document.getElementById("writingNextBtn").addEventListener("click", () => {
        writingIndex++;
        updateUI();
    });

    const reviewBtn = document.getElementById("writingReviewBtn");
    if (reviewBtn) {
        reviewBtn.addEventListener("click", () => {
            writingReviewOpen = true;
            updateUI();
        });
    }

    const exportBtnInline = document.getElementById("writingExportBtnInline");
    if (exportBtnInline) exportBtnInline.addEventListener("click", exportWritingToDocx);
}

// 📥 把目前語言所有已儲存的寫作段落匯出成一份 Word 檔（每次都是重新產生完整檔案，不是在雲端偷偷改同一份檔案）
async function exportWritingToDocx() {
    if (typeof docx === "undefined") {
        alert("匯出功能需要的套件還沒載入完成，請確認網路連線後重新整理頁面再試一次！");
        return;
    }

    const entries = Object.entries(writingParagraphs[currentLang] || {});
    if (entries.length === 0) {
        alert("目前還沒有任何已儲存的段落，寫完段落後記得先按「💾 儲存這段」再匯出唷！");
        return;
    }

    try {
        const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
        const catName = (categories.find(c => c.id === currentCat) || {}).name || currentCat;

        const children = [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "✍️ My English Writing Practice", bold: true, size: 40, color: "2B6CB0" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [new TextRun({ text: `情境：${catName} ・ 匯出時間：${new Date().toLocaleString()}`, size: 20, color: "718096" })]
            })
        ];

        entries.forEach(([word, data], idx) => {
            children.push(new Paragraph({
                spacing: { before: 300, after: 80 },
                children: [new TextRun({ text: `${idx + 1}. ${word}`, bold: true, size: 26, color: "2B6CB0" })]
            }));
            children.push(new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: data.text, size: 22 })]
            }));
        });

        const doc = new Document({
            sections: [{
                properties: { page: { size: { width: 12240, height: 15840 } } },
                children
            }]
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "writing_exercise.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        alert("匯出失敗：" + err.message);
    }
}

// ==========================================
// 5. 第四頁：📰 官方推薦新聞導航看板
// ==========================================
const newsDatabase = {
    ja: { hasRegions: false, links: [{ name: "NHK NEWS WEB", url: "https://www3.nhk.or.jp/news/", desc: "最推薦！附帶平假名注音與簡單日文版" }, { name: "Yahoo!ニュース", url: "https://news.yahoo.co.jp/", desc: "日本最大綜合評論新聞網" }, { name: "読売新聞", url: "https://www.yomiuri.co.jp/", desc: "日本發行量極大的主流報紙" }, { name: "朝日新聞デジタル", url: "https://www.asahi.com/", desc: "內容深入，適合中高級學習者" }] },
    en: { hasRegions: true, regions: { us: [{ name: "CNN International", url: "https://edition.cnn.com/", desc: "美國最具代表性的即時新聞網" }, { name: "The New York Times", url: "https://www.nytimes.com/", desc: "紐約時報，字彙豐富適合深度閱讀" }, { name: "NPR News", url: "https://www.npr.org/", desc: "美國國家公共廣播，適合練習聽力" }], ca: [{ name: "CBC News", url: "https://www.cbc.ca/news", desc: "加拿大國家廣播公司新聞" }, { name: "The Globe and Mail", url: "https://www.theglobeandmail.com/", desc: "地球郵報，加拿大主流嚴肅媒體" }], uk: [{ name: "BBC News", url: "https://www.bbc.com/news", desc: "英國廣播公司，標準英式英語首選" }, { name: "The Guardian", url: "https://www.theguardian.com/uk", desc: "衛報，英國獨立高質感大報" }], au: [{ name: "ABC News Australia", url: "https://www.abc.net.au/news", desc: "澳洲廣播公司新聞網" }, { name: "The Sydney Morning Herald", url: "https://www.smh.com.au/", desc: "雪梨晨鋒報，澳洲歷史悠久媒體" }] } },
    fr: { hasRegions: true, regions: { france: [{ name: "Le Monde", url: "https://www.lemonde.fr/", desc: "法國世界報，極具權威性的法語學習素材" }, { name: "Le Figaro", url: "https://www.lefigaro.fr/", desc: "費加洛報，法國歷史悠久的主流媒體" }, { name: "France info", url: "https://www.francetvinfo.fr/", desc: "即時圖文新聞，用詞現代活潑" }], canada: [{ name: "Radio-Canada", url: "https://ici.radio-canada.ca/", desc: "加拿大法語廣播，魁北克法語首選" }, { name: "Le Devoir", url: "https://www.ledevoir.com/", desc: "蒙特婁獨立大報，探討深度加拿大議題" }] } },
    ko: { hasRegions: false, links: [{ name: "NAVER 뉴스", url: "https://news.naver.com/", desc: "韓國最大入口網站新聞區" }, { name: "연합뉴스 (Yonhap)", url: "https://www.yna.co.kr/", desc: "聯合新聞，韓國國家通訊社" }, { name: "朝鮮日報", url: "https://www.chosun.com/", desc: "韓國主流大報之一" }] },
    de: { hasRegions: false, links: [{ name: "Tagesschau", url: "https://www.tagesschau.de/", desc: "德國最權威的公共電視新聞網" }, { name: "Spiegel", url: "https://www.spiegel.de/", desc: "鏡報，非常適合進階德語閱讀" }] },
    es: { hasRegions: false, links: [{ name: "El País", url: "https://elpais.com/", desc: "西班牙國家報，全球發行量最大的西語媒體" }, { name: "RTVE.es", url: "https://www.rtve.es/noticias/", desc: "西班牙國家廣播電視台" }] },
    nan: { hasRegions: false, links: [{ name: "公視台語台", url: "https://taigi.pts.org.tw/", desc: "最優質的台灣話新聞與影音學習資源" }] }
};

function renderNewsLinks() {
    const regionTabsContainer = document.getElementById("newsRegionTabs");
    const linkListContainer = document.getElementById("newsLinkList");
    if (!linkListContainer) return;

    const langData = newsDatabase[currentLang];
    if (!langData) {
        linkListContainer.innerHTML = "<li style='list-style:none; color:#999; text-align:center; padding: 20px;'>目前無此語言的新聞推薦</li>";
        if (regionTabsContainer) regionTabsContainer.style.display = "none";
        return;
    }

    if (langData.hasRegions) {
        if (regionTabsContainer) {
            regionTabsContainer.style.display = "flex";
            regionTabsContainer.innerHTML = "";
            const regionKeys = Object.keys(langData.regions);
            if (!regionKeys.includes(currentNewsRegion)) currentNewsRegion = regionKeys[0];

            regionKeys.forEach(regionKey => {
                const btn = document.createElement("button");
                btn.className = `news-tab ${currentNewsRegion === regionKey ? "active" : ""}`;
                btn.style.cssText = currentNewsRegion === regionKey
                    ? "background:#2b6cb0; color:#fff; border:none; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:13px; font-weight:bold;"
                    : "background:#e2e8f0; color:#4a5568; border:none; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:13px; font-weight:bold;";

                const regionNames = { us: "🇺🇸 美國", ca: "🇨🇦 加拿大", uk: "🇬🇧 英國", au: "🇦🇺 澳大利亞", france: "🇫🇷 法國", canada: "🇨🇦 加拿大" };
                btn.innerText = regionNames[regionKey] || regionKey;
                btn.addEventListener("click", () => { currentNewsRegion = regionKey; renderNewsLinks(); });
                regionTabsContainer.appendChild(btn);
            });
        }
        displayLinks(langData.regions[currentNewsRegion]);
    } else {
        if (regionTabsContainer) regionTabsContainer.style.display = "none";
        displayLinks(langData.links);
    }
}

// 關閉新聞模態視窗（原本 index.html 有呼叫但 JS 從未定義，會導致點擊時噴錯）
window.closeNewsModal = function () {
    const modal = document.getElementById("newsModal");
    if (modal) modal.style.display = "none";
};

function displayLinks(linksArray) {
    const linkListContainer = document.getElementById("newsLinkList");
    if (!linkListContainer) return;
    linkListContainer.innerHTML = "";
    linksArray.forEach(site => {
        const li = document.createElement("li");
        li.style.listStyle = "none";
        li.innerHTML = `
            <a href="${site.url}" target="_blank" class="news-link-item" rel="noopener noreferrer" style="display:block; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; margin-bottom:12px; text-decoration:none; color:#2d3748; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                <div class="news-link-title" style="font-size:16px; font-weight:bold; color:#2b6cb0; margin-bottom:4px;">🔗 ${site.name}</div>
                <div class="news-link-desc" style="font-size:13px; color:#718096; line-height:1.5;">${site.desc}</div>
            </a>`;
        linkListContainer.appendChild(li);
    });
}

// 🌟 看板（第四頁）只顯示引進庫裡標記為「新聞網站」的私房連結
function renderMyLinks() {
    const container = document.getElementById("myLinksList");
    if (!container) return;
    container.innerHTML = "";

    const newsOnly = userLinks.filter(link => link.type === "news");

    if (newsOnly.length === 0) {
        container.innerHTML = "<li style='list-style:none; color:#a0aec0; text-align:center; padding: 15px; font-size:13px;'>還沒有加入任何私房新聞網站，可以到「引進庫」新增，記得類型選「📰 新聞網站」唷！</li>";
        return;
    }

    newsOnly.forEach((site) => {
        const index = userLinks.indexOf(site);
        const li = document.createElement("li");
        li.style.listStyle = "none";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "8px";
        li.style.marginBottom = "12px";

        const a = document.createElement("a");
        a.href = site.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.cssText = "flex:1; display:block; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; text-decoration:none; color:#2d3748; box-shadow:0 2px 4px rgba(0,0,0,0.02); min-width:0;";
        a.innerHTML = `
            <div style="font-size:16px; font-weight:bold; color:#805ad5; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">🔗 ${site.title}</div>
            <div style="font-size:12px; color:#718096; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${site.url}</div>`;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "刪除這個網站";
        deleteBtn.style.cssText = "background:#e53e3e; color:#fff; border:none; border-radius:8px; padding:10px 12px; cursor:pointer; flex-shrink:0;";
        deleteBtn.addEventListener("click", () => deleteLinkFromPage5(index));

        li.appendChild(a);
        li.appendChild(deleteBtn);
        container.appendChild(li);
    });
}

// ==========================================
// 6. 第五頁：🛠️ 引進與全功能管理中心 (CRUD)
// ==========================================
function renderPage5ImportCenter() {
    const page5Container = document.getElementById("page5");
    if (!page5Container) return;

    const activeLangName = getLangMeta(currentLang).name;
    const currentLangWords = userDatabase[currentLang] || [];

    page5Container.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #2d3748; text-align: center;">動態引進與管理中心</h2>

        <div class="import-card" style="background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); margin-bottom:25px; border: 2px solid #667eea;">
            <h3 style="margin:0 0 12px 0; color:#4c51bf; font-size:18px;">☁️ 跨裝置同步</h3>
            <p style="font-size:13px; color:#718096; margin-bottom:12px; line-height:1.6;">
                在電腦和手機都輸入<b>同一組同步碼</b>（自己取一組不容易被猜到的碼即可），就能把資料互相上傳/下載，達到跨裝置同步的效果。
            </p>
            <input type="text" id="syncCodeInput" placeholder="輸入你的專屬同步碼" value="${syncCode.replace(/"/g, '&quot;')}" style="padding:10px 12px; border:1px solid #c3bffd; border-radius:6px; font-size:14px; width:100%; box-sizing:border-box; margin-bottom:10px;">
            <div style="display:flex; gap:10px;">
                <button id="syncPushBtn" style="flex:1; background:#667eea; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:14px;">⬆️ 上傳到雲端</button>
                <button id="syncPullBtn" style="flex:1; background:#48bb78; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:14px;">⬇️ 從雲端下載</button>
            </div>
            <div id="syncStatusText" style="margin-top:10px; font-size:12px; color:#a0aec0; text-align:center;"></div>
        </div>

        <div class="import-card" style="background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); margin-bottom:25px; border: 1px solid #e2e8f0;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#2b6cb0; font-size:18px;">📝 字句庫管理 (${activeLangName})</h3>
                <span style="font-size:12px; background:#ebf8ff; color:#2b6cb0; padding:4px 10px; border-radius:12px; font-weight:bold;">隨切換語系連動變更</span>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px; background:#f7fafc; padding:15px; border-radius:8px; border:1px dashed #cbd5e0;">
                <h4 style="margin:0; color:#4a5568; font-size:13px;">➕ 快速引進新詞彙到 ${activeLangName}：</h4>
                <input type="text" id="p5WordInput" placeholder="外文內容 (必填)" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                <input type="text" id="p5TransInput" placeholder="中文翻譯 (必填)" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                <input type="text" id="p5ExInput" placeholder="延伸句子/讀音提示 (選填)" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                <select id="p5CatInput" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                    ${categories.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name} (${cat.id})</option>`).join('')}
                </select>
                <button onclick="addWordFromPage5()" style="background:#2b6cb0; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:14px; margin-top:4px;">確認引進並存檔</button>
            </div>

            <h4 style="margin:0 0 10px 0; color:#4a5568; font-size:14px;">📋 已儲存字句清單 (${currentLangWords.length})</h4>
            <div id="wordsList" style="display:flex; flex-direction:column; gap:8px; max-height:250px; overflow-y:auto; padding-right:5px;">
                ${currentLangWords.map((item, index) => {
        const matchedCat = categories.find(c => c.id === item.category);
        const catDisplayName = matchedCat ? `${matchedCat.icon} ${matchedCat.name}` : item.category;
        return `
                    <div style="background:#fff; border:1px solid #edf2f7; border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.01);">
                        <div style="flex:1; margin-right:10px; min-width:0;">
                            <div style="font-size:14px; font-weight:bold; color:#2d3748; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.text}</div>
                            <div style="font-size:12px; color:#718096; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">意：${item.trans} | 類：${catDisplayName}</div>
                        </div>
                        <div style="display:flex; gap:6px; flex-shrink:0;">
                            <button onclick="editWordFromPage5(${index})" style="background:#ecc94b; color:#744210; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:bold;">修改</button>
                            <button onclick="deleteWordFromPage5(${index})" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:bold;">刪除</button>
                        </div>
                    </div>`;
    }).join('')}
                ${currentLangWords.length === 0 ? '<p style="text-align:center; color:#a0aec0; padding:15px; font-size:13px; margin:0;">目前此語系沒有任何自訂字句唷！</p>' : ''}
            </div>
        </div>

        <div class="import-card" style="background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <h3 style="margin:0 0 15px 0; color:#2c5282; font-size:18px;">🌐 私房學習網站連結管理</h3>
            
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px; background:#f7fafc; padding:15px; border-radius:8px; border:1px dashed #cbd5e0;">
                <h4 style="margin:0; color:#4a5568; font-size:13px;">➕ 新增私房網站：</h4>
                <input type="text" id="p5LinkTitle" placeholder="資源名稱 (例如: 網路日文辭典)" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                <input type="text" id="p5LinkUrl" placeholder="網址 (例如: www.jisho.org)" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                <select id="p5LinkType" style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px;">
                    <option value="news">📰 新聞網站（會同步顯示在「看板」）</option>
                    <option value="other">📚 其他學習網站（只顯示在引進庫）</option>
                </select>
                <button id="p5AddLinkBtn" style="background:#28a745; color:#fff; border:none; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:14px;">儲存並引進網站</button>
            </div>

            <h4 style="margin:0 0 10px 0; color:#4a5568; font-size:14px;">📋 已引進網站 (${userLinks.length})</h4>
            <div id="linksList" style="display:flex; flex-direction:column; gap:10px;">
                ${userLinks.map((link, index) => `
                    <div style="background:#fff; border:1px solid #edf2f7; border-radius:8px; padding:12px 15px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:#2b6cb0; font-weight:bold; font-size:15px; flex:1; margin-right:10px; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${link.type === "news" ? "📰" : "📚"} ${link.title}
                        </a>
                        <div style="display:flex; gap:6px; flex-shrink:0;">
                            <button onclick="editLinkFromPage5(${index})" style="background:#ecc94b; color:#744210; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:bold;">修改</button>
                            <button onclick="deleteLinkFromPage5(${index})" style="background:#e53e3e; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:bold;">刪除</button>
                        </div>
                    </div>
                `).join('')}
                ${userLinks.length === 0 ? '<p style="text-align:center; color:#a0aec0; padding:10px; font-size:13px; margin:0;">目前沒有自訂任何網站唷！</p>' : ''}
            </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

        <div class="inspiration-section">
            <h3 style="font-size: 16px; color: #2b6cb0; margin-bottom: 12px;">✨ 採集新句子到隨身包（推薦站）</h3>
            <div class="inspiration-list">
                <div class="inspire-card">
                    <div class="card-info">
                        <strong class="new-text">お勧めは何ですか？</strong>
                        <span class="new-trans">（日語）有什麼推薦的嗎？</span>
                    </div>
                    <button class="add-to-pack-btn"
                        onclick="collectWord('お勧めは何ですか？', '有什麼推薦的嗎？', 'ja', 'restaurant')">➕ 收藏</button>
                </div>

                <div class="inspire-card">
                    <div class="card-info">
                        <strong class="new-text">여기요, 물 좀 주세요.</strong>
                        <span class="new-trans">（韓語）這裡，請給我水。</span>
                    </div>
                    <button class="add-to-pack-btn"
                        onclick="collectWord('여기요, 물 좀 주세요.', '這裡，請給我水。', 'ko', 'restaurant')">➕ 收藏</button>
                </div>

                <div class="inspire-card">
                    <div class="card-info">
                        <strong class="new-text">Where is the nearest station?</strong>
                        <span class="new-trans">（英語）最近的車站在哪裡？</span>
                    </div>
                    <button class="add-to-pack-btn"
                        onclick="collectWord('Where is the nearest station?', '最近的車站在哪裡？', 'en', 'transport')">➕
                        收藏</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("p5AddLinkBtn").addEventListener("click", addLinkFromPage5);

    // ☁️ 同步按鈕事件綁定
    const syncCodeInputEl = document.getElementById("syncCodeInput");
    const syncPushBtnEl = document.getElementById("syncPushBtn");
    const syncPullBtnEl = document.getElementById("syncPullBtn");

    if (syncCodeInputEl) {
        syncCodeInputEl.addEventListener("change", (e) => saveSyncCode(e.target.value));
    }
    if (syncPushBtnEl) {
        syncPushBtnEl.addEventListener("click", () => {
            saveSyncCode(document.getElementById("syncCodeInput").value);
            pushToCloud();
        });
    }
    if (syncPullBtnEl) {
        syncPullBtnEl.addEventListener("click", () => {
            saveSyncCode(document.getElementById("syncCodeInput").value);
            pullFromCloud();
        });
    }
}

// ==========================================
// 7. 管理中心邏輯操作 (CRUD)
// ==========================================
function addWordFromPage5() {
    const textEl = document.getElementById("p5WordInput");
    const transEl = document.getElementById("p5TransInput");
    const exEl = document.getElementById("p5ExInput");
    const catEl = document.getElementById("p5CatInput");
    if (!textEl || !transEl) return;

    const text = textEl.value.trim();
    const trans = transEl.value.trim();
    const example = exEl ? exEl.value.trim() : "";
    const category = catEl ? catEl.value : "all";

    if (!text || !trans) { alert("核心內容與翻譯為必填欄位！"); return; }
    if (!userDatabase[currentLang]) userDatabase[currentLang] = [];

    userDatabase[currentLang].push({ text, trans, example, exTrans: "自訂字句", category });
    saveToStorage();
    renderPage5ImportCenter();
}

window.editWordFromPage5 = function (index) {
    const list = userDatabase[currentLang] || [];
    if (!list[index]) return;
    const item = list[index];

    const newText = prompt("1/3 修改外文內容：", item.text);
    if (newText === null) return;
    if (!newText.trim()) { alert("核心內容不能為空！"); return; }

    const newTrans = prompt("2/3 修改中文翻譯：", item.trans);
    if (newTrans === null) return;
    if (!newTrans.trim()) { alert("翻譯不能為空！"); return; }

    const newEx = prompt("3/3 修改延伸句子/音標提示：", item.example || "");
    if (newEx === null) return;

    list[index] = { ...item, text: newText.trim(), trans: newTrans.trim(), example: newEx.trim() };
    saveToStorage();
    renderPage5ImportCenter();
}

window.deleteWordFromPage5 = function (index) {
    const list = userDatabase[currentLang] || [];
    if (!list[index]) return;
    if (confirm(`確定要將「${list[index].text}」從字庫中徹底除去嗎？`)) {
        list.splice(index, 1);
        saveToStorage();
        renderPage5ImportCenter();
    }
}

function addLinkFromPage5() {
    const titleInput = document.getElementById("p5LinkTitle");
    const urlInput = document.getElementById("p5LinkUrl");
    const typeInput = document.getElementById("p5LinkType");
    if (!titleInput || !urlInput) return;

    let title = titleInput.value.trim();
    let url = urlInput.value.trim();
    let type = typeInput ? typeInput.value : "other";

    if (!title || !url) { alert("請填寫完整的網站標題與連結網址！"); return; }
    if (!url.startsWith("http://") && !url.startsWith("https://")) { url = "https://" + url; }

    userLinks.push({ title, url, type });
    saveLinksToStorage();
    renderPage5ImportCenter();
    renderMyLinks();
}

window.editLinkFromPage5 = function (index) {
    const currentLink = userLinks[index];
    const newTitle = prompt("1/3 請調整私房網站名稱：", currentLink.title);
    if (newTitle === null) return;
    if (!newTitle.trim()) { alert("標題不能留空！"); return; }

    let newUrl = prompt("2/3 請調整私房網站網址：", currentLink.url);
    if (newUrl === null) return;
    if (!newUrl.trim()) { alert("網址不能留空！"); return; }
    if (!newUrl.trim().startsWith("http://") && !newUrl.trim().startsWith("https://")) { newUrl = "https://" + newUrl.trim(); }

    const currentType = currentLink.type === "news" ? "1" : "2";
    const typeInput = prompt("3/3 這是哪種網站？請輸入 1 或 2：\n1 = 📰 新聞網站（會同步顯示在看板）\n2 = 📚 其他學習網站（只顯示在引進庫）", currentType);
    if (typeInput === null) return;
    const newType = typeInput.trim() === "1" ? "news" : "other";

    userLinks[index] = { title: newTitle.trim(), url: newUrl.trim(), type: newType };
    saveLinksToStorage();
    renderPage5ImportCenter();
    renderMyLinks();
}

window.deleteLinkFromPage5 = function (index) {
    if (confirm(`確認除去私房網站：「${userLinks[index].title}」？`)) {
        userLinks.splice(index, 1);
        saveLinksToStorage();
        renderPage5ImportCenter();
        renderMyLinks();
    }
}

// ==========================================
// 7.5 ☁️ 跨裝置同步（透過 /api/sync 與 Upstash Redis）
// ==========================================
function saveSyncCode(code) {
    syncCode = (code || "").trim();
    localStorage.setItem("multiLangSyncCode_v1", syncCode);
}

function getFullSyncPayload() {
    return {
        userDatabase,
        userLinks,
        categories,
        customLanguages
    };
}

function applySyncPayload(payload) {
    if (payload.userDatabase) userDatabase = payload.userDatabase;
    if (payload.userLinks) userLinks = payload.userLinks;
    if (payload.categories) categories = payload.categories;
    if (payload.customLanguages) customLanguages = payload.customLanguages;
    saveToStorage();
    saveLinksToStorage();
    saveCategoriesToStorage();
    saveCustomLanguages();
    renderLangGrid();
}

function updateSyncStatusUI(text) {
    const statusEl = document.getElementById("syncStatusText");
    if (statusEl) statusEl.innerText = text;
}

async function pushToCloud(showAlert = true) {
    if (!syncCode) { alert("請先輸入同步碼！"); return; }
    updateSyncStatusUI("⏳ 上傳中...");
    try {
        const res = await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: syncCode, data: getFullSyncPayload() })
        });
        const result = await res.json();
        if (result.success) {
            if (showAlert) alert("☁️ 已成功上傳到雲端！");
            updateSyncStatusUI("✅ 已上傳・" + new Date().toLocaleString());
        } else {
            updateSyncStatusUI("❌ 上傳失敗");
            alert("上傳失敗：" + (result.error || "未知錯誤"));
        }
    } catch (err) {
        updateSyncStatusUI("❌ 上傳失敗");
        alert("上傳失敗，請檢查網路連線：" + err.message);
    }
}

async function pullFromCloud() {
    if (!syncCode) { alert("請先輸入同步碼！"); return; }
    updateSyncStatusUI("⏳ 下載中...");
    try {
        const res = await fetch(`/api/sync?code=${encodeURIComponent(syncCode)}`);
        const result = await res.json();
        if (!result.found) {
            updateSyncStatusUI("⚠️ 雲端尚無資料");
            alert("雲端目前還沒有這個同步碼的資料，請先在另一台裝置上傳一次！");
            return;
        }
        if (confirm("確定要用雲端的資料覆蓋這台裝置目前的資料嗎？（本機目前的資料會被取代）")) {
            applySyncPayload(result.data);
            updateSyncStatusUI("✅ 已下載・" + new Date().toLocaleString());
            alert("✅ 已從雲端下載並套用資料！");

            const activePage = document.querySelector('.app-page.active');
            if (activePage && activePage.id === "page5") renderPage5ImportCenter();
            else if (activePage && activePage.id === "page2") renderCategoryPage();
            else updateUI();
        } else {
            updateSyncStatusUI("");
        }
    } catch (err) {
        updateSyncStatusUI("❌ 下載失敗");
        alert("下載失敗，請檢查網路連線：" + err.message);
    }
}

// ==========================================
// 8. 🔄 路由控制中心 (極致乾淨分離)
// ==========================================
function navigateToPage(pageNumber) {
    const pages = document.querySelectorAll('.app-page');
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`page${pageNumber}`);
    if (targetPage) targetPage.classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, idx) => {
        if (idx === (pageNumber - 1)) item.classList.add('active');
        else item.classList.remove('active');
    });

    // 🛠️ 核心修改：全新路由徹底分流機制
    if (pageNumber === 2) {
        renderCategoryPage(); // 第二頁：純情境選擇看板（含自訂按鈕）
    } else if (pageNumber === 3) {
        updateUI();           // 第三頁：專職 5 大特訓練習（依據第2頁選定的情境）
    } else if (pageNumber === 5) {
        renderPage5ImportCenter(); // 第五頁：專職渲染增刪改管理中心
    } else {
        updateUI();           // 第一、四頁：交由預設引擎渲染
    }
}

// ==========================================
// 9. 🚀 全頁面生命週期初始化事件監聽
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 重新校正緩存元素
    mainContent = document.getElementById("mainContent");
    siteTitle = document.getElementById("siteTitle");
    langButtons = document.querySelectorAll(".lang-btn");
    modeButtons = document.querySelectorAll(".mode-btn");

    // 🌐 語系選單改為動態渲染（含使用者自訂新增的語言）
    renderLangGrid();

    // 特訓模式切換（第三頁使用）
    // 修改特訓模式切換（約在 script.js 的最下方）
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetMode = btn.getAttribute("data-mode");

            // 這裡加上 || targetMode === 'writing' 確保新模式可以被順利切換！
            if ((typeof modeMapping !== 'undefined' && modeMapping.includes(targetMode)) || targetMode === 'writing') {
                currentMode = targetMode;
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateUI();
            }
        });
    });

    // 採集靈感庫字卡全域 API (完美整合 userDatabase)
    window.collectWord = function (text, trans, lang, category) {
        if (!userDatabase[lang]) userDatabase[lang] = [];
        const cleanedText = text.trim().toLowerCase();
        const isExist = userDatabase[lang].some(item => item.text.trim().toLowerCase() === cleanedText);

        if (isExist) { alert("💡 這句單字/句子已經在你的隨身包裡囉！"); return; }

        userDatabase[lang].push({
            text: text.trim(), trans: trans.trim(), example: "從靈感庫採集", exTrans: "", category: category || "all"
        });
        saveToStorage();

        alert(`🎉 成功加入隨身包！\n可以去管理中心或該語系字卡查看囉！`);

        const activePage = document.querySelector('.app-page.active');
        if (activePage && activePage.id === "page5") renderPage5ImportCenter();
        else updateUI();
    };

    // 初始化頁面跳轉至第一頁
    navigateToPage(1);
});