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
    { verb: "ser (是/本質)", pronoun: "Tú", answer: "eres", options: ["soy", "eres", "sois", "es"] }
];

// ==========================================
// 2. 全域變數與快取
// ==========================================
let userDatabase = JSON.parse(localStorage.getItem("multiLangDynamicDB_v8")) || defaultDatabase;
let currentLang = "ja";
const modeMapping = ["dialogue", "listening", "cloze", "conjugation", "memory"];
let currentMode = "dialogue";
let currentCat = "all";
let currentQuizIndex = 0;
let currentConjIndex = 0;
let currentClozeIndex = 0;
let currentNewsCategory = "international";
let flippedCards = [];
let lockBoard = false;

const mainContent = document.getElementById("mainContent");
const siteTitle = document.getElementById("siteTitle");
const langButtons = document.querySelectorAll(".lang-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const catButtons = document.querySelectorAll(".cat-btn");
// ⚠️ 修正 [問題3]：移除此處重複的 addBtn 宣告，改在 DOMContentLoaded 內統一處理

function saveToStorage() {
    localStorage.setItem("multiLangDynamicDB_v8", JSON.stringify(userDatabase));
}

// ==========================================
// 3. 核心功能函式
// ==========================================
function speak(text, lang) {
    if ('speechSynthesis' in window) {
        if (lang === "nan") return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { ja: "ja-JP", ko: "ko-KR", en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES" };
        utterance.lang = langMap[lang] || "en-US";
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
    return { audioText: currentItem.text, answer: currentItem.trans, options: finalOptions };
}

// ==========================================
// 4. UI 渲染引擎
// ==========================================
function updateUI() {
    const titleMap = { ja: "🌍 旅遊日文隨身包", ko: "🌍 旅遊韓文隨身包", en: "🌍 旅遊英文隨身包", de: "🌍 旅遊德文隨身包", fr: "🌍 旅遊法文隨身包", es: "🌍 旅遊西文隨身包", nan: "🌍 旅遊台語隨身包" };
    if (siteTitle) siteTitle.innerText = titleMap[currentLang] || "🌍 旅遊多語言隨身包";

    if (!mainContent) return;
    mainContent.innerHTML = "";
    flippedCards = [];
    lockBoard = false;

    const exInputEl = document.getElementById("exInput");
    if (exInputEl) {
        exInputEl.placeholder = currentLang === "ja" ? "輸入平假名/片假名讀音 (推薦)" : "延伸句子/拼音提示 (選填)";
    }

    if (currentMode === "cloze") renderClozeMode();
    else if (currentMode === "conjugation") renderConjugationMode();
    else if (currentMode === "dialogue") renderDialogueMode();
    else if (currentMode === "listening") renderListeningMode();
    else if (currentMode === "memory") renderMemoryMode();

    updateLiveDashboard();
}

function renderClozeMode() {
    const data = getFilteredList();
    if (data.length === 0) {
        mainContent.innerHTML = "<p style='text-align:center;color:#999;padding:20px;'>此情境沒有自訂字詞，無法產生拼字填空題！</p>";
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
        </div>`;

    const inputField = document.getElementById("clozeInput");
    const feedback = document.getElementById("clozeFeedback");
    if (inputField) {
        inputField.focus();
        document.getElementById("clozeSubmitBtn").addEventListener("click", checkAns);
        inputField.addEventListener("keypress", (e) => { if (e.key === "Enter") checkAns(); });
    }

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
        mainContent.innerHTML = "<p style='text-align:center;color:#999;padding:20px;'>此情境目前沒有任何用語，快去新增一個吧！</p>";
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

        header.appendChild(btn);
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
        });
        mainContent.appendChild(card);
    });
}

function renderListeningMode() {
    const quizData = buildQuizData();
    if (!quizData) {
        mainContent.innerHTML = "<p style='text-align:center;color:#999;padding:20px;'>此情境沒有用語可產生聽力題目！</p>";
        return;
    }
    mainContent.innerHTML = `
        <div class="quiz-box">
            <h3>🎧 情境聽力測驗</h3>
            <button class="play-quiz-btn" id="quizAudioBtn">📢 播放</button>
            <div class="options-grid" id="optionsGrid"></div>
            <p id="quizFeedback" style="margin-top:15px; font-weight:bold;"></p>
        </div>`;

    document.getElementById("quizAudioBtn").addEventListener("click", () => speak(quizData.audioText, currentLang));
    speak(quizData.audioText, currentLang);

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

function renderMemoryMode() {
    const dialogues = getFilteredList();
    if (dialogues.length < 2) {
        mainContent.innerHTML = "<p style='text-align:center;color:#999;padding:20px;'>本情境需要至少 2 個用語才能進行翻牌小遊戲！</p>";
        return;
    }
    let cardsData = [];
    dialogues.forEach((item, index) => {
        cardsData.push({ id: index, displayText: item.text });
        cardsData.push({ id: index, displayText: item.trans });
    });
    cardsData.sort(() => Math.random() - 0.5);

    mainContent.innerHTML = `<h3>🧠 情境記憶翻牌</h3><div class="game-grid" id="gameGrid"></div>`;
    const gameGrid = document.getElementById("gameGrid");

    cardsData.forEach(data => {
        const cardObj = document.createElement("div");
        cardObj.className = "memory-card";
        cardObj.innerText = data.displayText;
        cardObj.dataset.id = data.id;
        cardObj.addEventListener("click", () => {
            if (lockBoard || cardObj.classList.contains("flipped")) return;
            cardObj.classList.add("flipped");
            flippedCards.push(cardObj);
            if (flippedCards.length === 2) {
                const [c1, c2] = flippedCards;
                if (c1.dataset.id === c2.dataset.id) {
                    lockBoard = true;
                    setTimeout(() => { c1.classList.add("matched"); c2.classList.add("matched"); flippedCards = []; lockBoard = false; }, 400);
                } else {
                    lockBoard = true;
                    setTimeout(() => { c1.classList.remove("flipped"); c2.classList.remove("flipped"); flippedCards = []; lockBoard = false; }, 1000);
                }
            }
        });
        gameGrid.appendChild(cardObj);
    });
}

// ==========================================
// 5. 🗃️ 擬真生活動態看板資料（全面在地化升級版）
// ==========================================
const dashConfig = {
    ja: {
        name: "📍 東京",
        weather: "☀️ 快晴 🌡️ 28°C",
        astroTitle: "🔮 今日の運勢",
        astroBody: "🎯 新しい単語を学ぶのに最適な一日です！<br>🍀 ラッキーアイテム：<span class='lucky-item'>ホットコーヒー</span>",
        categories: { international: "国際", finance: "財経", tech: "科学技術", local: "地域", health: "健康" },
        astroList: ["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"],
        news: {
            international: ["NHK: 気候危機対応会議が東京で開幕", "読売: デジタル市場法の新規制が今日から全面施行"],
            finance: ["日経: 日経平均株価が史上最高値を更新"],
            tech: ["TechJP: ソニーが次世代VRヘッドセットの技術を発表"],
            local: ["朝日: 都心で今季一番の冷え込み、上着の用意を"],
            health: ["医療: バイオ新薬が承認、患者に新たな光"]
        }
    },
    ko: {
        name: "📍 서울",
        weather: "☀️ 맑음 🌡️ 26°C",
        astroTitle: "🔮 오늘의 운세",
        astroBody: "🎯 새 단어를 공부하기에 가장 좋은 날입니다!<br>🍀 행운의 아이템: <span class='lucky-item'>따뜻한 커피</span>",
        categories: { international: "국제", finance: "금융", tech: "기술", local: "지역", health: "건강" },
        astroList: ["양자리", "황소자리", "쌍둥이자리", "게자리", "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리", "염소자리", "물병자리", "물고기자리"],
        news: {
            international: ["연합: 국제 기후 정상회의 서울에서 개막"],
            finance: ["매경: 반도체 주가 강세, 코스피 지수 최고치 돌파"],
            tech: ["디지털: 차세대 폴더블 디스플레이 핵심 기술 공개"],
            local: ["SBS: 아침 출근길 쌀쌀, 옷차림 든든히 하세요"],
            health: ["메디컬: 혁신 바이오 신약 승인, 환자들에게 희망"]
        }
    },
    en: {
        name: "📍 Global Desk (New York)",
        weather: "☀️ Clear 🌡️ 23°C",
        astroTitle: "🔮 Today's Horoscope",
        astroBody: "🎯 Perfect day for expanding your vocabulary!<br>🍀 Lucky Item: <span class='lucky-item'>Hot Coffee</span>",
        categories: { international: "Global", finance: "Finance", tech: "Tech", local: "Local", health: "Health" },
        customTabs: {
            "us": "USA", "ca": "Canada", "au": "Australia", "uk": "UK", "mt": "Montreal",
            "local": "Local", "international": "Global", "finance": "Finance", "tech": "Tech", "health": "Health"
        },
        astroList: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
        news: {
            international: ["BBC: Global Climate Summit Opens in New York"],
            finance: ["Bloomberg: Markets Rally on Tech Gains"],
            tech: ["Verge: Breakthrough in Next-Gen AI Models Announced"],
            local: ["CNN: Local Transit System Upgrades Implemented"],
            health: ["WebMD: New Research Highlights Balanced Diet Benefits"]
        }
    },
    de: {
        name: "📍 Berlin",
        weather: "☀️ Klar 🌡️ 21°C",
        astroTitle: "🔮 Horoskop für heute",
        astroBody: "🎯 Ein perfekter Tag, um neue Vokabeln zu lernen!<br>🍀 Glücksbringer: <span class='lucky-item'>Heißer Kaffee</span>",
        categories: { international: "International", finance: "Finanzen", tech: "Tech", local: "Lokal", health: "Gesundheit" },
        astroList: ["Widder", "Stier", "Zwillinge", "Krebs", "Löwe", "Jungfrau", "Waage", "Skorpion", "Schütze", "Steinbock", "Wassermann", "Fische"],
        news: {
            international: ["ZDF: Klimakonferenz erzielt Durchbruch in Berlin."],
            finance: ["FAZ: Automobilexporte erreichen neuen Rekordwert."],
            tech: ["Heise: Durchbruch bei KI-Modellen der nächsten Generation."],
            local: ["Tagesspiegel: Modernisierung des Nahverkehrs erfolgreich gestartet."],
            health: ["ApothekenUmschau: Neue Studie betont Vorteile einer ausgewogenen Ernährung."]
        }
    },
    es: {
        name: "📍 Madrid",
        weather: "☀️ Despejado 🌡️ 29°C",
        astroTitle: "🔮 Horóscopo de hoy",
        astroBody: "🎯 ¡Un día perfecto para aprender nuevo vocabulario!<br>🍀 Objeto de la suerte: <span class='lucky-item'>Café caliente</span>",
        categories: { international: "Internacional", finance: "Finanzas", tech: "Tecnología", local: "Local", health: "Salud" },
        astroList: ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"],
        news: {
            international: ["El País: Cumbre sobre el cambio climático en Madrid."],
            finance: ["El Mundo: Los mercados suben gracias a las empresas tecnológicas."],
            tech: ["Xataka: Avance clave en la tecnología de pantallas plegables."],
            local: ["ABC: Mañana fresca en la ciudad, se recomienda llevar chaqueta."],
            health: ["La Vanguardia: Nueva investigación resalta los beneficios de la dieta mediterránea."]
        }
    },
    fr: {
        name: "📍 Paris",
        weather: "☀️ Degagé 🌡️ 22°C",
        astroTitle: "🔮 Horoscope d'aujourd'hui",
        astroBody: "🎯 Une journée parfaite pour apprendre du nouveau vocabulaire !<br>🍀 Objet chanceux : <span class='lucky-item'>Café chaud</span>",
        categories: { international: "International", finance: "Finances", tech: "Tech", local: "Local", health: "Santé" },
        customTabs: {
            "fr": "France", "ca": "Canada", "qc": "Québec",
            "local": "Local", "international": "International", "finance": "Finances", "tech": "Tech", "health": "Santé"
        },
        astroList: ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"],
        news: {
            international: ["Le Monde: Sommet mondial sur le climat à Paris."],
            finance: ["Les Echos: Les marchés rebondissent portés par la tech."],
            tech: ["Numérama: Présentation d'un matériel VR de nouvelle génération."],
            local: ["Le Figaro: Améliorations majeures dans les transports en commun parisiens."],
            health: ["Doctissimo: L'exercice quotidien lié à une plus grande longévité."]
        }
    },
    nan: {
        name: "📍 台灣 (台北)",
        weather: "☀️ 出日頭 🌡️ 31°C",
        astroTitle: "🔮 欲看今仔日的運勢",
        astroBody: "🎯 今仔日是學新單字尚好嘅時機！<br>🍀 幸運物：<span class='lucky-item'>燒咖啡</span>",
        categories: { international: "國際", finance: "財經", tech: "科技", local: "在地", health: "健康" },
        astroList: ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"],
        news: {
            international: ["國際時事：全球環境保護高峰會正式開議"],
            finance: ["工商時報：科技股帶頭衝，台股指數再創新高"],
            tech: ["科技新報：次世代顯示技術核心專利正式公開"],
            local: ["在地新聞：透早出門會畏寒，逐家愛穿予燒絡"],
            health: ["健康醫療：最新研究顯示均衡飲食對身體有大好處"]
        }
    }
};

// ==========================================
// 📊 獨立的工具函式區（唯一版本，不重複宣告）
// ==========================================

// ⚠️ 修正 [問題1]：合併兩個重複的 updateLiveDashboard，保留最完整版本
function updateLiveDashboard() {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const cat = typeof currentNewsCategory !== 'undefined' ? currentNewsCategory : 'international';

    if (typeof dashConfig === 'undefined') return;
    const config = dashConfig[lang] || dashConfig["en"];
    if (!config) return;

    const locEl = document.getElementById("dashboardLocation");
    const weaEl = document.getElementById("dashboardWeather");

    if (locEl) locEl.innerText = config.name || "";
    if (weaEl) weaEl.innerText = config.weather || "";

    // 分類按鈕多語言化
    if (config.categories) {
        document.querySelectorAll('#generalNewsTabs .news-tab').forEach(tab => {
            const catAttr = tab.getAttribute('data-category');
            if (catAttr && config.categories[catAttr]) {
                tab.innerText = config.categories[catAttr];
            }
        });
    }

    // 英法文面板按鈕翻譯
    if (config.customTabs) {
        document.querySelectorAll('#englishNewsControls .news-tab').forEach(tab => {
            let tabKey = tab.getAttribute('data-region') || tab.getAttribute('data-category');
            if (tabKey) {
                tabKey = tabKey.trim().toLowerCase();
                if (tabKey === 'montreal') tabKey = 'mt';
                if (config.customTabs[tabKey]) tab.innerText = config.customTabs[tabKey];
            }
        });

        document.querySelectorAll('#frenchNewsControls .news-tab').forEach(tab => {
            let tabKey = tab.getAttribute('data-region') || tab.getAttribute('data-category');
            if (tabKey) {
                tabKey = tabKey.trim().toLowerCase();
                if (config.customTabs[tabKey]) tab.innerText = config.customTabs[tabKey];
            }
        });
    }

    // 驅動星座與運勢多語言轉換
    updateHoroscope(config);

    // 控制特殊看板分頁隱現
    const generalTabs = document.getElementById('generalNewsTabs');
    const englishControls = document.getElementById('englishNewsControls');
    const frenchControls = document.getElementById('frenchNewsControls');

    if (generalTabs) generalTabs.style.display = (lang !== 'en' && lang !== 'fr') ? 'flex' : 'none';
    if (englishControls) englishControls.style.display = (lang === 'en') ? 'flex' : 'none';
    if (frenchControls) frenchControls.style.display = (lang === 'fr') ? 'flex' : 'none';

    // 抓取新聞並渲染
    if (config.news) {
        const currentList = config.news[cat] || config.news["international"] || [];
        renderNewsList(currentList);
    }
}

// ⚠️ 修正 [問題1]：合併兩個重複的 updateHoroscope，保留最完整版本
function updateHoroscope(passedConfig) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    if (typeof dashConfig === 'undefined') return;

    const config = (passedConfig && passedConfig.astroBody) ? passedConfig : (dashConfig[lang] || dashConfig["en"]);

    const select = document.getElementById("astroSelect");
    const content = document.getElementById("horoscopeContent");
    const titleEl = document.getElementById("astro-title");

    if (config) {
        if (content && config.astroBody) content.innerHTML = config.astroBody;
        if (titleEl && config.astroTitle) titleEl.innerHTML = config.astroTitle;
    }

    if (select && config && config.astroList) {
        const currentSelectedIndex = select.selectedIndex >= 0 ? select.selectedIndex : 0;
        select.innerHTML = "";
        config.astroList.forEach(a => {
            const o = document.createElement("option");
            o.value = a;
            o.innerText = a;
            select.appendChild(o);
        });
        select.selectedIndex = currentSelectedIndex;
    }
}

// ==========================================
// 📡 GNews API 新聞抓取器
// ==========================================
// 使用前請至 https://gnews.io 免費註冊取得 API Key
// 免費方案：每日 100 次請求，支援多語言與多國
// ==========================================

// ⚠️ 請將下方 YOUR_API_KEY 替換為你的 GNews API Key
const GNEWS_API_KEY = "a4758db3cb6b575daedb9593c7c686c8";

// 各語系對應的 GNews lang 與 country 參數
const gnewsLangMap = {
    ja: { lang: "ja", country: "jp" },
    ko: { lang: "ko", country: "kr" },
    en: { lang: "en", country: "us" },
    de: { lang: "de", country: "de" },
    fr: { lang: "fr", country: "fr" },
    es: { lang: "es", country: "es" },
    nan: { lang: "zh-tw", country: "tw" }
};

// 地區代碼對應 GNews country
const gnewsRegionMap = {
    us: "us", ca: "ca", au: "au", uk: "gb", mt: "ca",
    fr: "fr", qc: "ca"
};

// 分類對應 GNews topic（GNews 免費版用 top-headlines + topic）
const gnewsCategoryMap = {
    international: "world",
    finance: "business",
    tech: "technology",
    local: "nation",
    health: "health"
};

// 清除 HTML 標籤與常見 HTML 實體
function stripHtml(str) {
    return (str || "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

// 呼叫 GNews API 取得最新 3 則新聞
async function fetchAINews(lang, category, region) {
    const newsListEl = document.getElementById("newsList");
    if (!newsListEl) return;

    // 尚未設定 API Key 時提示使用者
    if (!GNEWS_API_KEY || GNEWS_API_KEY === "YOUR_API_KEY") {
        newsListEl.innerHTML = `
            <li style="list-style:none; text-align:center; padding:16px 12px; color:#c05621; background:#feebc8; border-radius:8px; margin:8px 0;">
                🔑 請先設定 GNews API Key<br>
                <span style="font-size:12px;">至 <a href="https://gnews.io" target="_blank" style="color:#c05621;">gnews.io</a> 免費註冊，
                再將 script.js 第一行的 <b>YOUR_API_KEY</b> 換成你的 Key</span>
            </li>`;
        return;
    }

    newsListEl.innerHTML = `
        <li style="list-style:none; text-align:center; padding:20px 0; color:#718096;">
            <div style="font-size:24px; margin-bottom:8px;">⏳</div>
            <div>正在取得最新新聞…</div>
        </li>`;

    try {
        // 決定語言與國家
        const langConfig = gnewsLangMap[lang] || gnewsLangMap["en"];
        const langParam = langConfig.lang;
        const countryParam = region ? (gnewsRegionMap[region] || langConfig.country) : langConfig.country;
        const topicParam = gnewsCategoryMap[category] || "world";

        // GNews top-headlines endpoint
        const apiUrl = `https://gnews.io/api/v4/top-headlines?topic=${topicParam}&lang=${langParam}&country=${countryParam}&max=3&token=${GNEWS_API_KEY}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.errors?.[0] || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.articles) || data.articles.length === 0) {
            throw new Error("此分類目前沒有新聞");
        }

        // 轉成 {title, body, link} 格式
        const newsArray = data.articles.slice(0, 3).map(article => ({
            title: stripHtml(article.title) || "（無標題）",
            body: stripHtml(article.description || article.content || "詳細內容請至原始來源閱讀。").substring(0, 600),
            link: article.url || ""
        }));

        renderNewsList(newsArray);

    } catch (err) {
        console.error("新聞載入失敗：", err);
        newsListEl.innerHTML = `
            <li style="list-style:none; text-align:center; padding:16px 0; color:#e53e3e;">
                ⚠️ 新聞載入失敗，請稍後再試<br>
                <span style="font-size:12px; color:#aaa;">${err.message}</span>
            </li>`;
    }
}

// 渲染新聞列表（支援 {title, body, link} 物件或純字串）
function renderNewsList(newsArray) {
    const newsListEl = document.getElementById("newsList");
    if (!newsListEl) return;

    newsListEl.innerHTML = "";

    if (!newsArray || newsArray.length === 0) {
        newsListEl.innerHTML = `<li style="color:#999; text-align:center; list-style:none;">📭 目前暫無即時新聞</li>`;
        return;
    }

    newsArray.slice(0, 3).forEach((newsItem) => {
        const li = document.createElement("li");
        const titleText = (typeof newsItem === "object") ? (newsItem.title || "") : newsItem;
        const bodyText = (typeof newsItem === "object") ? (newsItem.body || newsItem.content || "詳細內容請參閱官方報導。") : newsItem;
        const linkUrl = (typeof newsItem === "object") ? (newsItem.link || "") : "";

        li.innerHTML = `<span style="margin-right:6px;">📰</span>${titleText}`;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => openNewsModal(titleText, bodyText, linkUrl));
        newsListEl.appendChild(li);
    });
}


// 彈出視窗顯示與關閉（link 為可選的原文網址）
function openNewsModal(title, body, link) {
    const modal = document.getElementById("newsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    if (modal && modalTitle && modalBody) {
        modalTitle.innerText = title;

        // 內文
        modalBody.innerText = body;
        modalBody.style.whiteSpace = "pre-line";
        modalBody.style.lineHeight = "1.8";
        modalBody.style.color = "#4a5568";
        modalBody.style.fontSize = "14px";

        // 若有原文連結，插入「前往原文」按鈕（先移除舊的避免重複）
        const oldBtn = document.getElementById("modalReadMoreBtn");
        if (oldBtn) oldBtn.remove();

        if (link) {
            const readMoreBtn = document.createElement("a");
            readMoreBtn.id = "modalReadMoreBtn";
            readMoreBtn.href = link;
            readMoreBtn.target = "_blank";
            readMoreBtn.rel = "noopener noreferrer";
            readMoreBtn.innerText = "🔗 前往原文閱讀";
            readMoreBtn.style.cssText = `
                display: inline-block;
                margin-top: 16px;
                padding: 8px 18px;
                background: #3182ce;
                color: white;
                border-radius: 20px;
                text-decoration: none;
                font-size: 13px;
                font-weight: bold;
            `;
            modalBody.after(readMoreBtn);
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeNewsModal() {
    const modal = document.getElementById("newsModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        const oldBtn = document.getElementById("modalReadMoreBtn");
        if (oldBtn) oldBtn.remove();
    }
}

// ==========================================
// 🔄 路由控制
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

    if (pageNumber === 2 || pageNumber === 4) {
        updateUI();
    }
}

// ==========================================
// 🔄 網頁事件監聽初始化
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    // ⚠️ 修正 [問題4]：補上語言按鈕點擊事件綁定
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.getAttribute('data-lang') || btn.dataset.lang || btn.innerText;
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentNewsCategory = "international"; // 切換語言時重置新聞分類
            updateUI();
        });
    });

    // ⚠️ 修正 [問題4]：補上模式按鈕點擊事件綁定
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.getAttribute('data-mode') || modeMapping[Array.from(modeButtons).indexOf(btn)] || "dialogue";
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateUI();
        });
    });

    // ⚠️ 修正 [問題4]：補上情境分類按鈕點擊事件綁定
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCat = btn.getAttribute('data-cat') || "all";
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateUI();
        });
    });

    // 通用新聞分類頁籤（日、韓、德、西、台語）：切換時自動抓 AI 新聞
    document.querySelectorAll('#generalNewsTabs .news-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            currentNewsCategory = this.getAttribute('data-category') || 'international';
            this.parentElement.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateLiveDashboard();
            fetchAINews(currentLang, currentNewsCategory, null);
        });
    });

    // 英文雙層頁籤：地區列或分類列切換時重新抓新聞
    document.querySelectorAll('#englishNewsControls .news-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const val = this.getAttribute('data-region') || this.getAttribute('data-category') || 'international';
            currentNewsCategory = val;
            this.parentElement.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateLiveDashboard();
            // 地區 tab 用 region，分類 tab 用 category
            const isRegion = !!this.getAttribute('data-region');
            fetchAINews('en', isRegion ? 'international' : val, isRegion ? val : null);
        });
    });

    // 法文雙層頁籤：同上
    document.querySelectorAll('#frenchNewsControls .news-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const val = this.getAttribute('data-region') || this.getAttribute('data-category') || 'international';
            currentNewsCategory = val;
            this.parentElement.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateLiveDashboard();
            const isRegion = !!this.getAttribute('data-region');
            fetchAINews('fr', isRegion ? 'international' : val, isRegion ? val : null);
        });
    });

    // ==========================================
    // 更新看板按鈕：隨機刷新天氣、運勢、幸運物，並抓取最新新聞
    // ==========================================
    const refreshBtn = document.getElementById("refreshNewsBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            refreshBtn.innerText = "⏳ 更新中...";
            refreshBtn.disabled = true;

            const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';

            if (typeof dashConfig !== 'undefined' && dashConfig[lang]) {
                const config = dashConfig[lang];

                // ── 1. 隨機天氣（天氣狀況 + 氣溫一起換）──────────────
                const weatherPool = {
                    ja: [["☀️ 快晴", 18, 32], ["⛅ 曇り", 14, 26], ["🌧️ 雨", 10, 22], ["🌩️ 雷雨", 12, 20], ["❄️ 雪", 0, 8]],
                    ko: [["☀️ 맑음", 16, 30], ["⛅ 구름 많음", 12, 24], ["🌧️ 비", 8, 20], ["🌩️ 뇌우", 10, 18], ["❄️ 눈", -2, 6]],
                    en: [["☀️ Clear", 15, 28], ["⛅ Cloudy", 10, 22], ["🌧️ Rainy", 8, 18], ["⛈️ Stormy", 9, 16], ["❄️ Snowy", -1, 5]],
                    de: [["☀️ Klar", 12, 25], ["⛅ Bewölkt", 8, 20], ["🌧️ Regen", 6, 16], ["⛈️ Gewitter", 7, 14], ["❄️ Schnee", -2, 4]],
                    fr: [["☀️ Degagé", 14, 27], ["⛅ Nuageux", 10, 21], ["🌧️ Pluie", 7, 17], ["⛈️ Orage", 8, 15], ["❄️ Neige", -1, 5]],
                    es: [["☀️ Despejado", 18, 34], ["⛅ Nublado", 14, 26], ["🌧️ Lluvia", 10, 20], ["⛈️ Tormenta", 12, 19], ["❄️ Nieve", 0, 8]],
                    nan: [["☀️ 出日頭", 22, 35], ["⛅ 半天烏", 18, 28], ["🌧️ 落雨", 16, 24], ["🌩️ 落雷仔雨", 17, 22], ["🌫️ 有霧", 15, 20]]
                };
                const pool = weatherPool[lang] || weatherPool["en"];
                const [condition, minT, maxT] = pool[Math.floor(Math.random() * pool.length)];
                const temp = Math.floor(Math.random() * (maxT - minT + 1)) + minT;
                config.weather = `${condition} 🌡️ ${temp}°C`;

                // ── 2. 隨機運勢訊息（每次換一句）────────────────────────
                const astroMessages = {
                    ja: [
                        "🎯 新しい単語を学ぶのに最適な一日です！",
                        "🌟 積極的に話しかけると良い出会いがあります。",
                        "📚 今日は読書や学習に集中するのが吉。",
                        "🎨 クリエイティブなことに挑戦してみましょう。",
                        "🤝 友人との会話があなたに新しい視点をもたらします。"
                    ],
                    ko: [
                        "🎯 새 단어를 공부하기에 가장 좋은 날입니다!",
                        "🌟 적극적으로 소통하면 좋은 인연을 만납니다。",
                        "📚 오늘은 독서와 학습에 집중하는 것이 좋습니다。",
                        "🎨 창의적인 활동에 도전해 보세요。",
                        "🤝 친구와의 대화가 새로운 시각을 줄 것입니다。"
                    ],
                    en: [
                        "🎯 Perfect day for expanding your vocabulary!",
                        "🌟 Reach out to someone new — great connections await.",
                        "📚 Focus on learning today and you'll surprise yourself.",
                        "🎨 Creative pursuits will bring unexpected joy.",
                        "🤝 A conversation with a friend sparks fresh ideas."
                    ],
                    de: [
                        "🎯 Ein perfekter Tag, um neue Vokabeln zu lernen!",
                        "🌟 Neue Bekanntschaften bringen Glück — sei offen!",
                        "📚 Heute ist ein guter Tag zum Lesen und Lernen.",
                        "🎨 Kreative Projekte bringen unerwartete Freude.",
                        "🤝 Ein Gespräch mit Freunden bringt neue Ideen."
                    ],
                    fr: [
                        "🎯 Une journée parfaite pour apprendre du nouveau vocabulaire !",
                        "🌟 Allez vers les autres — de belles rencontres vous attendent.",
                        "📚 Concentrez-vous sur l'apprentissage aujourd'hui.",
                        "🎨 Les activités créatives vous apporteront de la joie.",
                        "🤝 Une conversation avec un ami apporte de nouvelles idées."
                    ],
                    es: [
                        "🎯 ¡Un día perfecto para aprender nuevo vocabulario!",
                        "🌟 Acércate a alguien nuevo — te esperan grandes conexiones.",
                        "📚 Hoy es un buen día para leer y estudiar.",
                        "🎨 Las actividades creativas traerán alegría inesperada.",
                        "🤝 Una conversación con amigos trae ideas frescas."
                    ],
                    nan: [
                        "🎯 今仔日是學新單字尚好嘅時機！",
                        "🌟 主動去交陪人，會有好緣分。",
                        "📚 今仔日專心讀冊學習，運氣真好。",
                        "🎨 做有創意的代誌，會有意外的快樂。",
                        "🤝 和朋友開講，會得著新的想法。"
                    ]
                };
                const messages = astroMessages[lang] || astroMessages["en"];
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];

                // ── 3. 隨機幸運物 ───────────────────────────────────────
                const luckyItems = {
                    ja: ["ホットコーヒー", "ラッキーペン", "青いノート", "緑のお茶", "お守り", "白いハンカチ"],
                    ko: ["따뜻한 커피", "행운의 펜", "파란 노트", "녹차", "부적", "흰 손수건"],
                    en: ["Hot Coffee", "Lucky Pen", "Blue Notebook", "Green Tea", "Lucky Charm", "White Handkerchief"],
                    de: ["Heißer Kaffee", "Glücksstift", "Blaues Notizbuch", "Grüner Tee", "Glücksbringer", "Weißes Taschentuch"],
                    fr: ["Café chaud", "Stylo chanceux", "Carnet bleu", "Thé vert", "Porte-bonheur", "Mouchoir blanc"],
                    es: ["Café caliente", "Bolígrafo de la suerte", "Cuaderno azul", "Té verde", "Amuleto", "Pañuelo blanco"],
                    nan: ["燒咖啡", "幸運筆", "藍色手冊", "青草茶", "護身符", "白手巾"]
                };
                const lItems = luckyItems[lang] || luckyItems["en"];
                const randomItem = lItems[Math.floor(Math.random() * lItems.length)];

                // ── 4. 組合成新的 astroBody 並寫回 config ───────────────
                config.astroBody = `${randomMsg}<br>🍀 ${lang === 'ja' ? 'ラッキーアイテム：' :
                    lang === 'ko' ? '행운의 아이템: ' :
                        lang === 'de' ? 'Glücksbringer: ' :
                            lang === 'fr' ? 'Objet chanceux : ' :
                                lang === 'es' ? 'Objeto de la suerte: ' :
                                    lang === 'nan' ? '幸運物：' :
                                        'Lucky Item: '
                    }<span class='lucky-item'>${randomItem}</span>`;
            }

            // 更新位置、天氣、星座顯示
            updateLiveDashboard();

            // 抓取最新新聞
            const region = (lang === 'en' || lang === 'fr') ? currentNewsCategory : null;
            const category = (lang === 'en' || lang === 'fr') ? 'international' : currentNewsCategory;

            fetchAINews(lang, category, region).finally(() => {
                refreshBtn.innerText = "🔄 更新看板";
                refreshBtn.disabled = false;
            });
        });
    }

    // 點擊 Modal 背景關閉
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("newsModal");
        if (e.target === modal) closeNewsModal();
    });

    // 前進第二頁按鈕
    const toPage2Btn = document.getElementById("toPage2Btn");
    if (toPage2Btn) {
        toPage2Btn.addEventListener("click", () => {
            if (typeof navigateToPage === 'function') navigateToPage(2);
        });
    }

    // ⚠️ 修正 [問題3]：addBtn 統一在此宣告，不在全域重複宣告
    const addBtn = document.getElementById("addBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            const textEl = document.getElementById("wordInput");
            const transEl = document.getElementById("transInput");
            const exEl = document.getElementById("exInput");
            const exTransEl = document.getElementById("exTransInput");
            const catEl = document.getElementById("categorySelect");

            if (!textEl || !transEl) return;

            const text = textEl.value.trim();
            const trans = transEl.value.trim();
            const example = exEl ? exEl.value.trim() : "";
            const exTrans = exTransEl ? exTransEl.value.trim() : "";
            const category = catEl ? catEl.value : "general";

            if (!text || !trans) { alert("內容與翻譯不能為空！"); return; }

            if (typeof userDatabase !== 'undefined' && typeof currentLang !== 'undefined') {
                if (!userDatabase[currentLang]) userDatabase[currentLang] = [];
                userDatabase[currentLang].push({ text, trans, example, exTrans, category });
                if (typeof saveToStorage === 'function') saveToStorage();
            }

            textEl.value = "";
            transEl.value = "";
            alert("🎉 成功引進新詞彙！");
            if (typeof updateUI === 'function') updateUI();
        });
    }

    // 星座下拉選單變更
    const astroSelect = document.getElementById("astroSelect");
    if (astroSelect) {
        astroSelect.addEventListener("change", () => updateHoroscope());
    }

    // 🚀 初始化
    if (typeof navigateToPage === 'function') navigateToPage(1);
    if (typeof updateUI === 'function') updateUI();
    if (typeof updateLiveDashboard === 'function') updateLiveDashboard();
});