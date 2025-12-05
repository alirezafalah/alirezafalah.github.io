// Publications Renderer Module
class PublicationsRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadAndRender() {
        try {
            const response = await fetch('data/publications.json');
            const publications = await response.json();
            this.render(publications);
        } catch (error) {
            console.error('Error loading publications:', error);
            this.container.innerHTML = '<p class="text-red-600">Failed to load publications.</p>';
        }
    }

    highlightAuthorName(authors) {
        return authors.replace(/Alireza Falah/gi, '<em>Alireza Falah</em>');
    }

    render(publications) {
        const html = publications.map(pub => {
            const linksHtml = this.renderLinks(pub);
            const bibtexId = `bibtex-content-${pub.id}`;
            const statusBadge = pub.status ? `<span class="font-bold text-green-600">[${pub.status}]</span>` : '';
            const highlightedAuthors = this.highlightAuthorName(pub.authors);

            return `
                <div class="publication-item">
                    <img src="${pub.image}" alt="${pub.title}" class="w-full md:w-48 rounded-lg object-cover shadow-sm flex-shrink-0">
                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold text-gray-900">${pub.title}</h3>
                        <p class="text-gray-600 mt-1">${highlightedAuthors}</p>
                        <p class="text-gray-500 italic mt-1">${pub.venue} ${statusBadge}</p>
                        <div class="mt-3 space-x-4">
                            ${linksHtml}
                        </div>
                        ${pub.bibtex ? `
                        <div id="${bibtexId}" class="hidden mt-4">
                            <div class="relative">
                                <button onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent.trim())" class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors" title="Copy BibTeX">
                                    📋 Copy
                                </button>
                                <pre class="bg-gray-100 p-4 pr-24 rounded-lg text-sm text-gray-800 overflow-x-auto"><code>${this.escapeHtml(pub.bibtex)}</code></pre>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        this.container.innerHTML = html;
        this.attachBibtexListeners();
    }

    renderLinks(pub) {
        return pub.links.map(link => {
            if (link.type === 'external') {
                return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-medium hover:underline">${link.text}</a>`;
            } else if (link.type === 'bibtex') {
                return `<button data-target="bibtex-content-${pub.id}" class="bibtex-toggle-btn text-blue-600 font-medium hover:underline">${link.text}</button>`;
            } else if (link.type === 'coming-soon') {
                return `<span class="text-gray-400 font-medium cursor-not-allowed">${link.text}</span>`;
            }
            return '';
        }).join('\n                            ');
    }

    attachBibtexListeners() {
        const buttons = this.container.querySelectorAll('.bibtex-toggle-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const bibtexContent = document.getElementById(targetId);
                if (bibtexContent) {
                    bibtexContent.classList.toggle('hidden');
                }
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.PublicationsRenderer = PublicationsRenderer;
}
