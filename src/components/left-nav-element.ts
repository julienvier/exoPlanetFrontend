import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('left-nav-component')
export class LeftNavComponent extends LitElement {
    @property({ type: String }) robotName: string = 'ExoBot';
    @state() robotPosition: string = 'N/A';
    @state() robotTemperature: string = 'N/A';
    @state() robotDirection: string = 'N/A';
    @state() availableRobots: Array<{ name: string }> = [];
    @state() positionX: number = 0;
    @state() positionY: number = 0;

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            top: 20px;
            left: 20px;
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
        .info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 1rem;
            color: #333;
            width: 100%;
        }
        .info div {
            padding: 8px;
            background: #f0f0f0;
            border-radius: 8px;
            text-align: center;
        }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
            margin-bottom: 20px;
            width: 100%;
        }
        input[type="text"],
        input[type="number"] {
            width: calc(100% - 16px);
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
        select {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
        button {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        button:hover {
            background: #45a049;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.fetchRobotData();
        this.fetchAvailableRobots();
    }

    /**
     * Holt die aktuellen Roboterdaten.
     */
    async fetchRobotData() {
        try {
            const response = await fetch('http://localhost:8088/api/positions');
            if (response.ok) {
                const data = await response.json();
                this.robotPosition = data.position || 'N/A';
                this.robotTemperature = data.temperature || 'N/A';
                this.robotDirection = data.direction || 'N/A';
            } else {
                console.error(`HTTP-Fehler: ${response.status}`);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Roboter-Daten:', error);
        }
    }

    /**
     * Holt die Liste der verfügbaren Roboter.
     */
    async fetchAvailableRobots() {
        try {
            const response = await fetch('http://localhost:8088/api/robots');
            if (response.ok) {
                const data = await response.json();
                this.availableRobots = data.robots || [];
            } else {
                console.error(`HTTP-Fehler: ${response.status}`);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der verfügbaren Roboter:', error);
        }
    }

    /**
     * Handler für die Namensänderung.
     */
    handleNameChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.robotName = input.value;
    }

    /**
     * Handler für die X-Positionsänderung.
     */
    handleXChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.positionX = parseInt(input.value, 10) || 0;
    }

    /**
     * Handler für die Y-Positionsänderung.
     */
    handleYChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.positionY = parseInt(input.value, 10) || 0;
    }

    /**
     * Erstellt einen neuen Roboter.
     */
    async handleCreateRobotClick() {
        try {
            const response = await fetch('http://localhost:8088/api/robots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'waiting',
                    name: this.robotName
                })
            });
            const data = await response.json();
            console.log(data.message);
            this.fetchAvailableRobots(); // Aktualisiere die Roboterliste nach dem Erstellen
        } catch (error) {
            console.error('Fehler beim Erstellen des Roboters:', error);
        }
    }

    /**
     * Sendet die Land-Position des Roboters.
     */
    async handleLandClick() {
        try {
            const response = await fetch('http://localhost:8088/api/land', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    robotID: this.robotName,
                    x: this.positionX,
                    y: this.positionY,
                    robotDirection: this.robotDirection,
                })
            });
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Fehler beim Senden der Land-Position:', error);
        }
    }

    /**
     * Handler für die Richtungsänderung.
     */
    handleDirectionChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.robotDirection = select.value;
    }

    /**
     * Escaped HTML, um XSS-Angriffe zu vermeiden.
     */
    private escapeHTML(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Rendert die Komponente.
     */
    render() {
        return html`
            <div class="title">Roboter Info</div>
            <div class="info">
                <div><strong>Name:</strong> ${this.escapeHTML(this.robotName)}</div>
                <div><strong>Position:</strong> ${this.escapeHTML(this.robotPosition)}</div>
                <div><strong>Richtung:</strong> ${this.escapeHTML(this.robotDirection)}</div>
            </div>
            <div class="input-group">
                <input
                        type="text"
                        placeholder="Neuer Roboternamen eingeben"
                        .value=${this.robotName}
                        @input=${this.handleNameChange}
                />
                <button @click=${this.handleCreateRobotClick}>Roboter Erstellen</button>
                <input
                        type="number"
                        placeholder="Position X"
                        .value=${this.positionX}
                        @input=${this.handleXChange}
                />
                <input
                        type="number"
                        placeholder="Position Y"
                        .value=${this.positionY}
                        @input=${this.handleYChange}
                />
                <select @input=${this.handleDirectionChange}>
                    <option value="">Himmelsrichtung wählen</option>
                    <option value="NORTH">NORTH</option>
                    <option value="EAST">EAST</option>
                    <option value="SOUTH">SOUTH</option>
                    <option value="WEST">WEST</option>
                </select>
                <button @click=${this.handleLandClick}>Land</button>
            </div>
        `;
    }
}
