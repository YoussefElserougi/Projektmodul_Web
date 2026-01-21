class PageNavigator {
    constructor() {
        this.currentPage = 'chatbot';
        this.init();
    }

    init() {
        // Navigation Items Event-Listener (nur für interne Seiten mit data-page)
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        navItems.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.getAttribute('data-page');
                if (page) {
                    this.navigateTo(page);
                }
            });
        });

        // FM Ticket Modal Setup
        this.setupFMTicketModal();
        
        // Admin Panel Setup
        this.setupAdminPanel();
    }

    setupAdminPanel() {
        const adminBtn = document.getElementById('adminPanelBtn');
        const adminPanel = document.getElementById('adminPanel');
        const adminClose = document.getElementById('adminPanelClose');
        const adminToast = document.getElementById('adminToast');
        
        if (adminBtn && adminPanel) {
            adminBtn.addEventListener('click', () => {
                adminPanel.classList.add('active');
            });
            
            adminClose.addEventListener('click', () => {
                adminPanel.classList.remove('active');
            });
            
            // Webhook Buttons
            adminPanel.querySelectorAll('.admin-action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const webhook = btn.dataset.webhook;
                    this.callAdminWebhook(webhook, adminToast);
                });
            });
        }
    }
    
    callAdminWebhook(path, toast) {
        toast.textContent = 'Aktion wird ausgelöst …';
        toast.classList.add('show');
        
        fetch(`http://localhost:5678/webhook/${path}`, {
            method: 'POST'
        })
        .then(res => {
            if (!res.ok) throw new Error('Webhook Fehler');
            toast.textContent = 'Aktion erfolgreich ausgelöst';
        })
        .catch(() => {
            toast.textContent = 'Fehler beim Aufruf des Webhooks';
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    setupFMTicketModal() {
        const fmTicketBtn = document.getElementById('fmTicketBtn');
        const fmTicketModal = document.getElementById('fmTicketModal');
        const fmModalCancel = document.getElementById('fmModalCancel');
        const fmModalConfirm = document.getElementById('fmModalConfirm');

        if (fmTicketBtn && fmTicketModal) {
            fmTicketBtn.addEventListener('click', () => {
                fmTicketModal.classList.add('active');
            });

            fmModalCancel.addEventListener('click', () => {
                fmTicketModal.classList.remove('active');
            });

            fmModalConfirm.addEventListener('click', () => {
                window.open('https://app-eu.wrike.com/form/eyJhY2NvdW50SWQiOjU0NTMyMDQsInRhc2tGb3JtSWQiOjU5MjcyN30JNDgzMDIyMzM4MDE2MAk4YzJhMTc1Y2VlYWQwNGYzOGIyNDIxNDJhMDhmZTM0NzMxOGE4YzU3MjU4MWJhZDMwNTliZmU0MDc2MzJkZDRj', '_blank');
                fmTicketModal.classList.remove('active');
            });

            // Schließe Modal bei Klick außerhalb
            fmTicketModal.addEventListener('click', (e) => {
                if (e.target === fmTicketModal) {
                    fmTicketModal.classList.remove('active');
                }
            });
        }
    }

    navigateTo(page) {
        // Verstecke alle Seiten
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Zeige die neue Seite
        const newPage = document.getElementById(page + '-page');
        if (newPage) {
            newPage.classList.add('active');
        }

        // Aktualisiere aktiven Navigation Item
        document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
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

        // Initialisiere AnsprechpartnerApp wenn zu Ansprechpartner gewechselt wird
        if (page === 'ansprechpartner' && !window.ansprechpartnerApp) {
            window.ansprechpartnerApp = new AnsprechpartnerApp();
        }
    }
}

// ========================= //
// Ansprechpartner App       //
// ========================= //
class AnsprechpartnerApp {
    constructor() {
        this.data = [];
        this.kategorieFilter = document.getElementById('kategorieFilter');
        this.serienleuchteFilter = document.getElementById('serienleuchteFilter');
        this.detailsContainer = document.getElementById('ansprechpartnerDetails');
        
        this.selectedKategorie = null;
        this.selectedSerienleuchte = null;
        
        this.roleLabels = {
            'Mitarbeiter Optik': 'Optik',
            'Mitarbeiter ET': 'Elektrotechnik',
            'Mitarbeiter PM': 'Projektmanagement',
            'Mitarbeiter SC': 'Supply Chain',
            'Mitarbeiter AV': 'Arbeitsvorbereitung',
            'Mitarbeiter VAL': 'Validierung',
            'Mitarbeiter MT': 'Montagetechnik'
        };
        
        this.init();
    }

    async init() {
        await this.loadCSV();
        this.renderKategorieFilter();
        this.renderSerienleuchteFilter();
    }

    async loadCSV() {
        try {
            const response = await fetch('/Verantwortungsbereiche.csv');
            const csvText = await response.text();
            this.data = this.parseCSV(csvText);
        } catch (error) {
            console.error('Fehler beim Laden der CSV:', error);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = this.parseCSVLine(lines[0]);
        const data = [];
        
        let currentTitel = '';
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = this.parseCSVLine(line);
            if (values.length < 2) continue;
            
            // Aktualisiere den Titel wenn vorhanden
            if (values[0] && values[0].trim()) {
                currentTitel = values[0].trim();
            }
            
            const serienleuchte = values[1] ? values[1].trim() : '';
            if (!serienleuchte) continue;
            
            const entry = {
                titel: currentTitel,
                serienleuchte: serienleuchte,
                mitarbeiter: {}
            };
            
            // Mitarbeiter zuordnen
            for (let j = 2; j < headers.length && j < values.length; j++) {
                const header = headers[j].trim();
                const value = values[j] ? values[j].trim() : '';
                entry.mitarbeiter[header] = value;
            }
            
            data.push(entry);
        }
        
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        
        return result.map(v => v.replace(/^"|"$/g, '').trim());
    }

    getUniqueKategorien() {
        const kategorien = [...new Set(this.data.map(item => item.titel))];
        return kategorien.filter(k => k && k.trim());
    }

    getSerienleuchtenByKategorie(kategorie) {
        if (!kategorie) return [];
        return this.data
            .filter(item => item.titel === kategorie)
            .map(item => item.serienleuchte);
    }

    renderKategorieFilter() {
        const kategorien = this.getUniqueKategorien();
        
        this.kategorieFilter.innerHTML = kategorien.map(kat => 
            `<button class="filter-btn" data-kategorie="${kat}">${kat}</button>`
        ).join('');

        this.kategorieFilter.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectKategorie(btn.dataset.kategorie));
        });
    }

    renderSerienleuchteFilter() {
        if (!this.selectedKategorie) {
            this.serienleuchteFilter.innerHTML = '<span class="filter-placeholder">Bitte zuerst eine Kategorie wählen</span>';
            return;
        }

        const serien = this.getSerienleuchtenByKategorie(this.selectedKategorie);
        
        this.serienleuchteFilter.innerHTML = serien.map(serie => 
            `<button class="filter-btn" data-serie="${serie}">${serie}</button>`
        ).join('');

        this.serienleuchteFilter.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectSerienleuchte(btn.dataset.serie));
        });
    }

    selectKategorie(kategorie) {
        this.selectedKategorie = kategorie;
        this.selectedSerienleuchte = null;

        // Update button states
        this.kategorieFilter.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.kategorie === kategorie);
        });

        // Re-render Serienleuchte filter
        this.renderSerienleuchteFilter();
        
        // Clear details
        this.showPlaceholder();
    }

    selectSerienleuchte(serie) {
        this.selectedSerienleuchte = serie;

        // Update button states
        this.serienleuchteFilter.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.serie === serie);
        });

        // Show details
        const item = this.data.find(d => 
            d.titel === this.selectedKategorie && d.serienleuchte === serie
        );
        
        if (item) {
            this.showDetails(item);
        }
    }

    showPlaceholder() {
        this.detailsContainer.innerHTML = `
            <div class="details-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>Wählen Sie eine Kategorie und Serienleuchte aus</p>
            </div>
        `;
    }

    showDetails(item) {
        const mitarbeiterCards = Object.entries(item.mitarbeiter)
            .map(([role, name]) => {
                const displayRole = this.roleLabels[role] || role.replace('Mitarbeiter ', '');
                const isEmpty = !name || name === ' ';
                return `
                    <div class="mitarbeiter-card ${isEmpty ? 'empty' : ''}">
                        <div class="role">${displayRole}</div>
                        <div class="name">${isEmpty ? 'Nicht besetzt' : name}</div>
                    </div>
                `;
            }).join('');

        this.detailsContainer.innerHTML = `
            <div class="details-header">
                <h2>${item.serienleuchte}</h2>
                <div class="serie-name">${item.titel}</div>
            </div>
            <div class="mitarbeiter-grid">
                ${mitarbeiterCards}
            </div>
        `;
    }
}

class ChatApp {
    constructor() {
        this.messagesContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.statusIndicator = document.getElementById('status');
        this.conversationId = this.generateConversationId();
        
        // PDF Modal Elemente
        this.modal = document.getElementById('pdfModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModalBtn = document.getElementById('closeModal');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.chunksList = document.getElementById('chunksList');
        this.pdfContainer = document.getElementById('pdfContainer');
        this.pageInfo = document.getElementById('pageInfo');
        
        // PDF.js State
        this.pdfDoc = null;
        this.totalPages = 0;
        
        // PDF.js Worker konfigurieren
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        
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

        this.checkServerStatus();
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    startNewChat() {
        // Neue Conversation ID generieren
        this.conversationId = this.generateConversationId();
        
        // Chat-Nachrichten zurücksetzen mit Willkommensnachricht
        this.messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="bot-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"/>
                        <circle cx="12" cy="5" r="2"/>
                        <path d="M12 7v4"/>
                        <line x1="8" y1="16" x2="8" y2="16"/>
                        <line x1="16" y1="16" x2="16" y2="16"/>
                    </svg>
                </div>
                <div class="message-content">
                    Ich kann dir helfen, Informationen aus deinen internen Dokumenten zu finden. Frag mich alles über Arbeitsanweisungen, Prozesse oder Unternehmensrichtlinien.
                </div>
            </div>
        `;
        
        // Input leeren und fokussieren
        this.messageInput.value = '';
        this.messageInput.focus();
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
        
        // Bot-Nachrichten als Markdown rendern, User-Nachrichten als Plain Text
        if (type === 'bot') {
            contentDiv.innerHTML = marked.parse(text);
        } else {
            contentDiv.textContent = text;
        }
        
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
        
        // Erklärungstext hinzufügen
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'chunks-explanation';
        explanationDiv.innerHTML = 'Diese Textabschnitte aus dem Dokument wurden verwendet, um die Antwort zu generieren.';
        this.chunksList.appendChild(explanationDiv);
        
        chunks.forEach((chunk, index) => {
            const chunkDiv = document.createElement('div');
            chunkDiv.className = 'chunk-item';
            
            const lineInfo = chunk.lines 
                ? `<span class="chunk-lines">Zeilen ${chunk.lines.from}-${chunk.lines.to}</span>` 
                : '';
            
            chunkDiv.innerHTML = `
                <div class="chunk-header">
                    <span class="chunk-number">Textabschnitt ${index + 1}</span>
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

    // PDF mit PDF.js laden - alle Seiten rendern für Scroll-Funktion
    async loadPdf(filename) {
        const url = `/api/download?file=${encodeURIComponent(filename)}`;
        
        // Container leeren
        this.pdfContainer.innerHTML = '<div class="pdf-loading">Dokument wird geladen...</div>';
        
        try {
            this.pdfDoc = await pdfjsLib.getDocument(url).promise;
            this.totalPages = this.pdfDoc.numPages;
            
            // Container für alle Seiten vorbereiten
            this.pdfContainer.innerHTML = '';
            
            // Seiten-Info aktualisieren
            this.pageInfo.textContent = `${this.totalPages} Seite${this.totalPages !== 1 ? 'n' : ''}`;
            
            // Alle Seiten rendern
            for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
                await this.renderPage(pageNum);
            }
        } catch (error) {
            console.error('PDF load error:', error);
            this.pdfContainer.innerHTML = '<div class="pdf-error">Fehler beim Laden des PDFs</div>';
        }
    }

    // Einzelne Seite rendern und zum Container hinzufügen
    async renderPage(pageNum) {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(pageNum);
        const containerWidth = this.pdfContainer.clientWidth - 60;
        
        // Skalierung berechnen
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        // Wrapper für die Seite erstellen
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        
        // Seitennummer Label
        const pageLabel = document.createElement('div');
        pageLabel.className = 'pdf-page-label';
        pageLabel.textContent = `Seite ${pageNum}`;
        pageWrapper.appendChild(pageLabel);
        
        // Canvas erstellen
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page-canvas';
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        pageWrapper.appendChild(canvas);
        
        // Zum Container hinzufügen
        this.pdfContainer.appendChild(pageWrapper);
        
        // Seite rendern
        const context = canvas.getContext('2d');
        await page.render({
            canvasContext: context,
            viewport: scaledViewport
        }).promise;
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
    // Marked.js konfigurieren
    marked.setOptions({
        breaks: true,  // Einzelne Zeilenumbrüche als <br> rendern
        gfm: true      // GitHub Flavored Markdown aktivieren
    });
    
    const navigator = new PageNavigator();
    // Initialisiere ChatApp beim Start
    window.chatApp = new ChatApp();
});
