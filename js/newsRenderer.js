// News Renderer Module
class NewsRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadAndRender() {
        try {
            const response = await fetch('data/news.json');
            const newsItems = await response.json();
            this.render(newsItems);
        } catch (error) {
            console.error('Error loading news:', error);
            this.container.innerHTML = '<li class="text-red-600">Failed to load news items.</li>';
        }
    }

    render(newsItems) {
        const html = newsItems.map(item => {
            const linkHtml = item.link 
                ? ` (<a href="${item.link.url}" target="_blank" class="text-blue-600 hover:underline">${item.link.text}</a>)`
                : '';
            
            return `
                <li>
                    <strong class="font-semibold text-gray-800 mr-2">${item.date}</strong>
                    ${item.content}${linkHtml}
                </li>
            `;
        }).join('');

        this.container.innerHTML = html;
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.NewsRenderer = NewsRenderer;
}
