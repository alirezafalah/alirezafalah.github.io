// Projects Renderer Module
class ProjectsRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadAndRender() {
        try {
            const response = await fetch('data/projects.json');
            const projects = await response.json();
            this.render(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.container.innerHTML = '<p class="text-red-600">Failed to load projects.</p>';
        }
    }

    highlightAuthorName(authors) {
        return authors.replace(/Alireza Falah/gi, '<em>Alireza Falah</em>');
    }

    render(projects) {
        const html = projects.map(project => {
            const linksHtml = this.renderLinks(project);
            const bibtexId = `bibtex-content-${project.id}`;
            const highlightedAuthors = this.highlightAuthorName(project.authors);

            return `
                <div class="publication-item">
                    <img src="${project.image}" alt="${project.title}" class="w-full md:w-48 rounded-lg object-cover shadow-sm flex-shrink-0">
                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold text-gray-900">${project.title}</h3>
                        <p class="text-gray-600 mt-1">${highlightedAuthors}</p>
                        <p class="text-gray-700 mt-2">${project.description}</p>
                        <div class="mt-3 space-x-4">
                            ${linksHtml}
                        </div>
                        ${project.bibtex ? `
                        <div id="${bibtexId}" class="hidden mt-4">
                            <div class="relative">
                                <button onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent.trim())" class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors" title="Copy BibTeX">
                                    📋 Copy
                                </button>
                                <pre class="bg-gray-100 p-4 pr-24 rounded-lg text-sm text-gray-800 overflow-x-auto"><code>${this.escapeHtml(project.bibtex)}</code></pre>
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

    renderLinks(project) {
        return project.links.map(link => {
            if (link.type === 'external') {
                return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-medium hover:underline">${link.text}</a>`;
            } else if (link.type === 'bibtex') {
                return `<button data-target="bibtex-content-${project.id}" class="bibtex-toggle-btn text-blue-600 font-medium hover:underline">${link.text}</button>`;
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
    window.ProjectsRenderer = ProjectsRenderer;
}
