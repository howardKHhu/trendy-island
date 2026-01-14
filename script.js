const i18n = {
    'zh': {
        nav_news: "潮流新聞",
        nav_column: "深度專欄",
        hero_title: "探索文化與自我認同",
        section_news: "最新潮流趨勢",
        column_text: "從街頭文化看社會變遷：我們穿的不只是衣服，是故事..."
    },
    'en': {
        nav_news: "News",
        nav_column: "Column",
        hero_title: "Exploring Culture & Identity",
        section_news: "Latest Trends",
        column_text: "Streetwear & Society: We wear stories, not just clothes..."
    },
    'ja': {
        nav_news: "ニュース",
        nav_column: "コラム",
        hero_title: "文化とアイデンティティの探求",
        section_news: "最新トレンド",
        column_text: "ストリートカルチャーと社会：私たちが着ているのは服ではなく、物語です..."
    }
};

function initLanguage() {
    const userLang = navigator.language.split('-')[0];
    const lang = i18n[userLang] ? userLang : 'en'; // 沒匹配到就用英文
    
    document.getElementById('nav-news').innerText = i18n[lang].nav_news;
    document.getElementById('hero-title').innerText = i18n[lang].hero_title;
    document.getElementById('section-news-title').innerText = i18n[lang].section_news;
    document.getElementById('column-content').innerText = i18n[lang].column_text;
}

document.addEventListener('DOMContentLoaded', initLanguage);
