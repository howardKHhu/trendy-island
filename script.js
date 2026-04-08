const i18n = {
    'zh': {
        page_title: "Trendy Island | 連結身分、文化與社會",
        meta_description: "Trendy Island 整合全球潮流文化與歷史，探討時尚、自我認同與社會的羈絆。在科技冷冽的時代，尋找服飾背後的人文溫度。",
        hero_title: "連結身分、文化與社會",
        hero_desc: "在科技冷冽的時代，尋找潮流中流淌的人文溫度。",
        about_title: "關於我們",
        about_content: "Trendy Island 整合全球潮流文化與歷史，探討時尚潮流、自我認同與社會的羈絆。我們在科技時代中，尋找服飾背後的人文溫度，挖掘時尚背後的人文意義與社會脈絡。",
        podcast_label: "收聽我們的節目",
        latest_label: "最新一集節目",
        footer_follow: "",
        footer_slogan: "連結身分、文化與社會的島嶼"
    },
    'en': {
        page_title: "Trendy Island | Connecting Identity & Culture",
        meta_description: "Trendy Island integrates global trend cultures and histories, exploring the bonds between fashion, self-identity, and society. Discovering human warmth within trends in a cold tech era.",
        hero_title: "Connecting Identity & Culture",
        hero_desc: "Discovering human warmth within trends in a cold tech era.",
        about_title: "About Us",
        about_content: "Trendy Island integrates global trend cultures and histories, exploring the bonds between fashion, self-identity, and society. We are dedicated to rediscovering the cultural significance behind fashion.",
        podcast_label: "Listen to Trendy Island",
        latest_label: "Latest Episode",
        footer_follow: "",
        footer_slogan: "Connecting Identity & Culture"
    },
    'ja': {
        page_title: "Trendy Island | 文化とアイデンティティを繋ぐ",
        meta_description: "Trendy Islandは、潮流文化と歴史を統合し、ファッション、自己アイデンティティ、社会の絆を探求するポッドキャストです。テクノロジーの時代にトレンドの温もりを見つけます。",
        hero_title: "文化とアイデンティティを繋ぐ",
        hero_desc: "冷たいテクノロジーの時代に、トレンドの中に流れる温もりを見つける。",
        about_title: "私たちについて",
        about_content: "Trendy Islandは、潮流文化と歴史を統合し、ファッション、自己アイデンティティ、そして社会の絆を探求するプラットフォームです。服の背景にある物語を掘り起こすことに尽力しています。",
        podcast_label: "番組を聴く",
        latest_label: "最新のエピソード",
        footer_follow: "",
        footer_slogan: "文化とアイデンティティを繋ぐ"
    }
};

function updateContent(lang) {
    const data = i18n[lang] || i18n['en'];

    document.title = data.page_title;
    document.querySelector('meta[name="description"]').setAttribute('content', data.meta_description);

    document.getElementById('hero-title').innerText = data.hero_title;
    document.getElementById('hero-desc').innerText = data.hero_desc;
    document.getElementById('about-title').innerText = data.about_title;
    document.getElementById('about-content').innerText = data.about_content;
    document.getElementById('podcast-label').innerText = data.podcast_label;
    document.getElementById('latest-label').innerText = data.latest_label;
    document.getElementById('footer-follow').innerText = data.footer_follow;
    document.getElementById('footer-slogan').innerText = data.footer_slogan;
    
    document.documentElement.lang = lang;
}

function changeLang(lang) {
    localStorage.setItem('preferredLang', lang);
    updateContent(lang);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (document.documentElement.scrollTop > 400) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. 檢查網址參數是否有指定語系 (例如 ?lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    // 2. 檢查本地儲存是否已有使用者的偏好設定
    const savedLang = localStorage.getItem('preferredLang');
    
    // 3. 獲取瀏覽器語言 (只取前兩位代碼，如 'zh', 'en', 'ja')
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['zh', 'en', 'ja'];
    const defaultLang = 'en'; // 若都不符合，預設為英文

    // 決定最終要顯示的語系
    let finalLang;
    
    if (langParam && supportedLangs.includes(langParam)) {
        finalLang = langParam;
    } else if (savedLang && supportedLangs.includes(savedLang)) {
        finalLang = savedLang;
    } else if (supportedLangs.includes(browserLang)) {
        finalLang = browserLang;
    } else {
        finalLang = defaultLang;
    }

    // 執行內容更新
    updateContent(finalLang);
    
    // 額外優化：同步 HTML 的 lang 屬性，這對 SEO 很有幫助
    document.documentElement.lang = finalLang;
});
