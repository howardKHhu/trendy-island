const i18n = {
    'zh': {
        page_title: "Trendy Island | 連結身分、文化與社會",
        meta_description: "Trendy Island 是探討時尚、文化與社會認同的深度 Podcast。每週一集，帶你從服飾看見世界。",
        hero_title: "連結身分、文化與社會",
        hero_desc: "每週深度對談，帶你從時尚看見文化、認同與社會的連結。",
        hero_cta: "立即收聽 →",
        about_title: "關於我們",
        about_content: "Trendy Island 是一個以深度對談為核心的潮流文化 Podcast。我們不只談穿什麼、流行什麼，而是追問「為什麼」——為什麼這件衣服代表了某個世代？為什麼次文化會成為主流？無論你是時尚愛好者、文化觀察者，還是對服飾背後故事感到好奇的人，這裡就是你的島嶼。",
        topics_title: "探討主題",
        topics: ["日本古著文化", "韓流與身分認同", "永續時尚", "街頭文化", "品牌歷史", "次文化與社會"],
        episodes_title: "所有集數",
        episodes_search_placeholder: "搜尋集數標題或內容...",
        episodes_listen: "收聽 →",
        episodes_loading: "載入中...",
        episodes_no_results: "找不到符合的集數",
        episodes_error: "無法載入集數，請稍後再試",
        podcast_label: "收聽我們的節目",
        latest_label: "最新一集節目",
        footer_follow: "",
        footer_slogan: "連結身分、文化與社會的島嶼"
    },
    'en': {
        page_title: "Trendy Island | Connecting Identity & Culture",
        meta_description: "Trendy Island is a weekly podcast exploring fashion, identity, and society. New episodes every week.",
        hero_title: "Connecting Identity & Culture",
        hero_desc: "A weekly podcast exploring fashion, identity, and society. New episodes every week.",
        hero_cta: "Listen Now →",
        about_title: "About Us",
        about_content: "Trendy Island is a deep-dive podcast at the intersection of fashion, culture, and society. We don't just cover what's trending — we ask why. Why does a garment define a generation? Why does subculture become mainstream? Whether you're a fashion enthusiast or simply curious about the stories behind what we wear, this is your island.",
        topics_title: "Topics We Explore",
        topics: ["Japanese Vintage Culture", "K-Culture & Identity", "Sustainable Fashion", "Streetwear", "Brand History", "Subculture & Society"],
        episodes_title: "All Episodes",
        episodes_search_placeholder: "Search episode titles or descriptions...",
        episodes_listen: "Listen →",
        episodes_loading: "Loading...",
        episodes_no_results: "No episodes found",
        episodes_error: "Failed to load episodes, please try again later",
        podcast_label: "Listen to Trendy Island",
        latest_label: "Latest Episode",
        footer_follow: "",
        footer_slogan: "Connecting Identity & Culture"
    },
    'ja': {
        page_title: "Trendy Island | 文化とアイデンティティを繋ぐ",
        meta_description: "Trendy Islandは、ファッション・文化・アイデンティティを深掘りする週刊ポッドキャストです。",
        hero_title: "文化とアイデンティティを繋ぐ",
        hero_desc: "ファッション・文化・アイデンティティを深掘りする週刊ポッドキャスト。毎週新エピソード配信。",
        hero_cta: "今すぐ聴く →",
        about_title: "私たちについて",
        about_content: "Trendy Islandは、ファッション、文化、社会の交差点を深掘りするポッドキャストです。何がトレンドかを語るだけでなく、「なぜ」を問います。なぜある服がある世代を定義するのか？なぜサブカルチャーがメインストリームになるのか？ファッション好きから服の裏にある物語に興味を持つ方まで、ここはあなたのための島です。",
        topics_title: "探求するテーマ",
        topics: ["日本ヴィンテージ文化", "K-カルチャーとアイデンティティ", "サステナブルファッション", "ストリートカルチャー", "ブランドの歴史", "サブカルチャーと社会"],
        episodes_title: "全エピソード",
        episodes_search_placeholder: "タイトルや内容で検索...",
        episodes_listen: "聴く →",
        episodes_loading: "読み込み中...",
        episodes_no_results: "エピソードが見つかりません",
        episodes_error: "エピソードの読み込みに失敗しました",
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
    document.getElementById('hero-cta').innerText = data.hero_cta;
    document.getElementById('about-title').innerText = data.about_title;
    document.getElementById('about-content').innerText = data.about_content;
    document.getElementById('topics-title').innerText = data.topics_title;
    const tagsContainer = document.getElementById('topics-tags');
    tagsContainer.innerHTML = '';
    data.topics.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });
    document.getElementById('episodes-title').innerText = data.episodes_title;
    document.getElementById('episodes-loading').innerText = data.episodes_loading;
    document.getElementById('podcast-label').innerText = data.podcast_label;
    document.getElementById('latest-label').innerText = data.latest_label;
    document.getElementById('footer-follow').innerText = data.footer_follow;
    document.getElementById('footer-slogan').innerText = data.footer_slogan;

    // Push lang data to episodes module if it's loaded
    if (typeof window.updateEpisodeLang === 'function') {
        window.updateEpisodeLang(data, lang);
    }

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
