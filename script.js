const i18n = {
    'zh': {
        nav_news: "潮流新聞",
        nav_column: "深度專欄",
        nav_podcast: "播客節目",
        hero_title: "探索文化與自我認同",
        hero_desc: "在冷冽的科技時代，尋找潮流中流淌的人文溫度。",
        section_news: "最新潮流趨勢",
        section_column: "潮流專欄",
        section_podcast: "收聽 Trendy Island",
        about_title: "關於我們",
        about_content: "Trendy Island 是一個從世界各地的潮流文化與歷史中，整合重要新聞，探討時尚潮流、自我認同與社會羈絆的島嶼。我們相信每一件服飾背後都有一段歷史，每一種風格都是對自我認同的追尋。在科技快速更迭的當下，我們致力於挖掘時尚背後的人文意義與社會脈絡。"
    },
    'en': {
        nav_news: "News",
        nav_column: "Column",
        nav_podcast: "Podcast",
        hero_title: "Exploring Culture & Identity",
        hero_desc: "Discovering the human warmth within trends in a cold tech era.",
        section_news: "Latest Trends",
        section_column: "Editorial Column",
        section_podcast: "Listen to Trendy Island",
        about_title: "About Us",
        about_content: "Trendy Island is a cross-border platform that integrates pivotal news from global trend cultures and histories. We explore the deep-rooted bonds between fashion, self-identity, and society. We believe every garment carries a story, and every style is a pursuit of identity. In an era of rapid technological change, we are dedicated to rediscovering the cultural significance and social context behind fashion."
    },
    'ja': {
        nav_news: "ニュース",
        nav_column: "コラム",
        nav_podcast: "ポッドキャスト",
        hero_title: "文化とアイデンティティの探求",
        hero_desc: "冷たいテクノロジーの時代に、トレンドの中に流れる人文的な温もりを見つける。",
        section_news: "最新トレンド",
        section_column: "特別コラム",
        section_podcast: "ポッドキャストを聴く",
        about_title: "私たちについて",
        about_content: "Trendy Islandは、世界中のトレンド文化と歴史から重要なニュースを統合し、ファッション、自己アイデンティティ、そして社会の絆を追求するプラットフォームです。すべての服には歴史があり、すべてのスタイルはアイデンティティの探求であると私たちは信じています。テクノロジーが加速する現代において、ファッションの背後にある人文的な意味と社会的な文脈を掘り起こすことに尽力しています。"
    }
};

function initLanguage() {
    const userLang = navigator.language.split('-')[0];
    const lang = i18n[userLang] ? userLang : 'en'; 
    
    // 更新導覽列
    document.getElementById('nav-news').innerText = i18n[lang].nav_news;
    document.getElementById('nav-column').innerText = i18n[lang].nav_column;
    document.getElementById('nav-podcast').innerText = i18n[lang].nav_podcast;
    
    // 更新 Hero 區塊
    document.getElementById('hero-title').innerText = i18n[lang].hero_title;
    document.getElementById('hero-desc').innerText = i18n[lang].hero_desc;
    
    // 更新各區塊標題
    document.getElementById('section-news-title').innerText = i18n[lang].section_news;
    document.getElementById('section-column-title').innerText = i18n[lang].section_column;
    document.getElementById('section-podcast-title').innerText = i18n[lang].section_podcast;
    
    // 更新關於我們
    document.getElementById('about-title').innerText = i18n[lang].about_title;
    document.getElementById('about-content').innerText = i18n[lang].about_content;
}

document.addEventListener('DOMContentLoaded', initLanguage);
