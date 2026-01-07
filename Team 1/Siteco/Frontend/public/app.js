class PageNavigator {
    constructor() {
        this.currentPage = 'chatbot';
        this.init();
    }

    init() {
        // Menu-Buttons Event-Listener
        const menuBtns = document.querySelectorAll('.menu-btn');
        menuBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Externe Links für externe Seiten
        this.externalLinks = {
            'about': 'https://www.siteco.de/unternehmen?catalogue=de_de',
            'sustainability': 'https://www.siteco.de/nachhaltigkeit?catalogue=de_de',
            'career': 'https://www.siteco.de/karriere?catalogue=de_de',
            'career-training': 'https://www.siteco.de/karriere/ausbildung?catalogue=de_de',
            'career-studies': 'https://www.siteco.de/karriere/studium?catalogue=de_de',
            'career-jobs': 'https://www.siteco.de/karriere/stellenausschreibungen?catalogue=de_de'
        };

        // Page-Buttons (für die Info-Seiten)
        const pageButtons = document.querySelectorAll('.page-button');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pageContainer = btn.closest('.page');
                let pageKey = null;
                
                // Versuche, die page-id zu nutzen
                if (pageContainer) {
                    const pageId = pageContainer.id;
                    // Entferne "-page" Suffix um den Key zu bekommen
                    pageKey = pageId.replace('-page', '');
                }
                
                if (pageKey && this.externalLinks[pageKey]) {
                    window.open(this.externalLinks[pageKey], '_blank');
                }
            });
        });
    }

    getPageKey(pageTitle) {
        const titleMap = {
            'ÜBER UNS': 'about',
            'NACHHALTIGKEIT': 'sustainability',
            'KARRIERE': 'career',
            'AUSBILDUNG': 'career-training',
            'STUDIUM': 'career-studies',
            'STELLENAUSSCHREIBUNGEN': 'career-jobs'
        };
        return titleMap[pageTitle] || 'chatbot';
    }

    navigateTo(page) {
        // Wenn Karriere angeklickt wird, nichts tun
        if (page === 'career') {
            return;
        }

        // Verstecke alle Seiten
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Zeige die neue Seite
        const newPage = document.getElementById(page + '-page');
        if (newPage) {
            newPage.classList.add('active');
        }

        // Aktualisiere aktiven Button
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('active');
            }
        });

        this.currentPage = page;

        // Initialisiere ChatApp nur wenn zu Chatbot gewechselt wird
        if (page === 'chatbot' && !window.chatApp) {
            window.chatApp = new ChatApp();
        }
    }
}

class ChatApp {
    constructor() {
        this.messagesContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.statusIndicator = document.getElementById('status');
        this.conversationId = this.generateConversationId();
        
        // PDF Modal Elemente
        this.modal = document.getElementById('pdfModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModalBtn = document.getElementById('closeModal');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.chunksList = document.getElementById('chunksList');
        this.pdfCanvas = document.getElementById('pdfCanvas');
        this.pageInfo = document.getElementById('pageInfo');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        
        // PDF.js State
        this.pdfDoc = null;
        this.currentPage = 1;
        this.totalPages = 0;
        
        // PDF.js Worker konfigurieren
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter sendet, Shift+Enter macht neue Zeile
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });

        // Modal Events
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
        
        // PDF Navigation
        this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(1));

        this.checkServerStatus();
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async checkServerStatus() {
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                this.statusIndicator.style.background = '#4ade80';
            }
        } catch (error) {
            this.statusIndicator.style.background = '#ef4444';
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;

        // User-Nachricht anzeigen
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Typing-Indikator anzeigen
        this.showTypingIndicator();
        
        // Senden Button deaktivieren
        this.sendButton.disabled = true;

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.conversationId
                })
            });

            const data = await response.json();

            if (data.success) {
                this.hideTypingIndicator();
                // Sources mit Chunks übergeben
                this.addMessage(data.data.response, 'bot', data.data.sources || []);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage(
                'Sorry, there was an error. Please try again.',
                'bot'
            );
            console.error('Error:', error);
        } finally {
            this.sendButton.disabled = false;
            this.messageInput.focus();
        }
    }

    // Hilfsfunktion: Dateinamen bereinigen für Anzeige
    cleanFilename(filename) {
        return filename
            .replace(/~\d+\.pdf$/i, '.pdf')
            .replace(/_/g, ' ');
    }

    // Text kürzen für Vorschau
    truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    addMessage(text, type, sources = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'bot') {
            // Bot-Icon hinzufügen
            const iconDiv = document.createElement('div');
            iconDiv.className = 'bot-icon';
            iconDiv.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="M12 7v4"/>
                    <line x1="8" y1="16" x2="8" y2="16"/>
                    <line x1="16" y1="16" x2="16" y2="16"/>
                </svg>
            `;
            messageDiv.appendChild(iconDiv);
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        // Sources hinzufügen (nur bei Bot-Nachrichten mit Quellen)
        if (type === 'bot' && sources.length > 0) {
            const sourcesDiv = document.createElement('div');
            sourcesDiv.className = 'message-sources';
            
            const label = document.createElement('span');
            label.className = 'sources-label';
            label.textContent = '📄 Quellen:';
            sourcesDiv.appendChild(label);
            
            sources.forEach(source => {
                const link = document.createElement('button');
                link.className = 'source-link';
                link.textContent = this.cleanFilename(source.filename);
                link.title = `Öffnen: ${source.filename}`;
                link.addEventListener('click', () => this.openPdfModal(source));
                sourcesDiv.appendChild(link);
            });
            
            contentDiv.appendChild(sourcesDiv);
        }
        
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll nach unten
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // PDF Modal öffnen
    async openPdfModal(source) {
        const { filename, chunks } = source;
        
        // Modal Titel setzen
        this.modalTitle.textContent = this.cleanFilename(filename);
        
        // Download Button konfigurieren
        this.downloadBtn.href = `/api/download?file=${encodeURIComponent(filename)}`;
        this.downloadBtn.download = filename;
        
        // Chunks anzeigen
        this.chunksList.innerHTML = '';
        chunks.forEach((chunk, index) => {
            const chunkDiv = document.createElement('div');
            chunkDiv.className = 'chunk-item';
            
            const lineInfo = chunk.lines 
                ? `<span class="chunk-lines">Zeilen ${chunk.lines.from}-${chunk.lines.to}</span>` 
                : '';
            
            chunkDiv.innerHTML = `
                <div class="chunk-header">
                    <span class="chunk-number">Passage ${index + 1}</span>
                    ${lineInfo}
                </div>
                <div class="chunk-text">${this.escapeHtml(chunk.text)}</div>
            `;
            this.chunksList.appendChild(chunkDiv);
        });
        
        // Modal anzeigen
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // PDF laden
        await this.loadPdf(filename);
    }

    // HTML escapen für sichere Anzeige
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // PDF mit PDF.js laden
    async loadPdf(filename) {
        const url = `/api/download?file=${encodeURIComponent(filename)}`;
        
        try {
            this.pdfDoc = await pdfjsLib.getDocument(url).promise;
            this.totalPages = this.pdfDoc.numPages;
            this.currentPage = 1;
            
            this.updatePageInfo();
            await this.renderPage(this.currentPage);
        } catch (error) {
            console.error('PDF load error:', error);
            this.pdfCanvas.getContext('2d').clearRect(0, 0, this.pdfCanvas.width, this.pdfCanvas.height);
        }
    }

    // Seite rendern
    async renderPage(pageNum) {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(pageNum);
        const container = document.getElementById('pdfContainer');
        const containerWidth = container.clientWidth - 40;
        
        // Skalierung berechnen
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        // Canvas Größe setzen
        this.pdfCanvas.width = scaledViewport.width;
        this.pdfCanvas.height = scaledViewport.height;
        
        // Rendern
        const context = this.pdfCanvas.getContext('2d');
        await page.render({
            canvasContext: context,
            viewport: scaledViewport
        }).promise;
    }

    // Seite wechseln
    changePage(delta) {
        const newPage = this.currentPage + delta;
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.currentPage = newPage;
            this.updatePageInfo();
            this.renderPage(this.currentPage);
        }
    }

    // Seiten-Info aktualisieren
    updatePageInfo() {
        this.pageInfo.textContent = `Seite ${this.currentPage} / ${this.totalPages}`;
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= this.totalPages;
    }

    // Modal schließen
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.pdfDoc = null;
    }

    showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.id = 'typing-indicator';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'bot-icon';
        iconDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/>
                <line x1="8" y1="16" x2="8" y2="16"/>
                <line x1="16" y1="16" x2="16" y2="16"/>
            </svg>
        `;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        messageDiv.appendChild(iconDiv);
        messageDiv.appendChild(typingDiv);
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
}

// App starten
document.addEventListener('DOMContentLoaded', () => {
    const navigator = new PageNavigator();
    // Initialisiere ChatApp beim Start
    window.chatApp = new ChatApp();
});
