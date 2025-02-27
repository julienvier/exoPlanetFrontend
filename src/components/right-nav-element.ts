import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface Robot {
    RobotID: string;
    Status: string;
}

@customElement('right-nav-element')
export class RightNavElement extends LitElement {
    // Reaktiver State für verfügbare Roboter
    @state()
    private availableRobots: Robot[] = [];

    // State für Feedback-Nachrichten
    @state()
    private feedbackMessage: string = '';

    // Intervall-ID zum Stoppen des Fetch-Intervalls
    private fetchIntervalId: number | undefined;

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            top: 20px;
            right: 20px;
            width: 250px;
            height: 90vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            font-family: sans-serif;
            padding: 20px;
            overflow-y: auto;
        }
        .title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        .robot-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            margin-bottom: 20px;
        }
        .robot-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: #f0f0f0;
            border-radius: 8px;
        }
        .robot-name {
            font-size: 1rem;
            color: #333;
            word-break: break-word;
        }
        button {
            padding: 6px 12px;
            border-radius: 8px;
            background: #2196F3;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        button:hover {
            background: #1976D2;
        }
        .loading {
            font-size: 1rem;
            color: #555;
            text-align: center;
        }
        .feedback {
            font-size: 0.9rem;
            color: green;
            text-align: center;
            margin-top: 10px;
        }
        .error {
            color: red;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 10px;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.startFetching();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopFetching();
    }

    private startFetching() {
        this.fetchRobots(); // Sofortiger Fetch beim Verbinden
        this.fetchIntervalId = window.setInterval(() => {
            this.fetchRobots();
        }, 5000); // 5000 Millisekunden = 5 Sekunden
    }

    private stopFetching() {
        if (this.fetchIntervalId !== undefined) {
            clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = undefined;
        }
    }

    private async fetchRobots() {
        try {
            const response = await fetch('http://localhost:8088/api/robots');
            if (response.ok) {
                const data: Robot[] = await response.json();
                this.availableRobots = data || [];
                console.log('Roboter empfangen:', this.availableRobots);
            } else {
                console.error(`HTTP-Fehler: ${response.status}`);
                this.availableRobots = [];
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der verfügbaren Roboter:', error);
            this.availableRobots = [];
        }
    }

    private async handleSelectRobot(robotName: string) {
        try {
            const response = await fetch('http://localhost:8088/api/currentRobot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: robotName })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`Antwort vom Server: ${data.message}`);
                this.feedbackMessage = `Roboter "${robotName}" wurde ausgewählt.`;
                setTimeout(() => {
                    this.feedbackMessage = '';
                }, 3000); // Nachricht nach 3 Sekunden ausblenden
            } else {
                console.error(`HTTP-Fehler: ${response.status}`);
                this.feedbackMessage = `Fehler beim Auswählen von "${robotName}".`;
                setTimeout(() => {
                    this.feedbackMessage = '';
                }, 3000);
            }
        } catch (error) {
            console.error('Fehler beim Auswählen des Roboters:', error);
            this.feedbackMessage = `Fehler beim Auswählen von "${robotName}".`;
            setTimeout(() => {
                this.feedbackMessage = '';
            }, 3000);
        }
    }

    /**
     * Escaped HTML, um XSS-Angriffe zu vermeiden.
     * @param {string} unsafe - Der unsichere String.
     * @returns {string} - Der ge-escaped String.
     */
    private escapeHTML(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    render() {
        return html`
            <div class="title">Verfügbare Roboter</div>
            <div class="robot-list">
                ${this.availableRobots.length > 0
                        ? this.availableRobots.map(robot => html`
                            <div class="robot-item">
                                <span class="robot-name">${this.escapeHTML(robot.RobotID)}</span>
                                <button @click=${() => this.handleSelectRobot(robot.RobotID)}>Auswählen</button>
                            </div>
                        `)
                        : html`<div class="loading">Keine Roboter verfügbar. Lade...</div>`}
            </div>
            ${this.feedbackMessage
                    ? html`<div class="feedback">${this.feedbackMessage}</div>`
                    : ''}
        `;
    }
}