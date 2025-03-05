import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('left-nav-component')
export class LeftNavComponent extends LitElement {
    @property({ type: String }) robotName: string = 'ExoBot';
    @state() robotPosition: string = 'N/A';
    @state() robotTemperature: string = 'N/A';
    @state() robotDirection: string = 'N/A';
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
        window.addEventListener('robot-selected', this.handleRobotSelected.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('robot-selected', this.handleRobotSelected.bind(this));
    }

    private async handleRobotSelected(event: Event) {
        const customEvent = event as CustomEvent;
        this.robotName = customEvent.detail.robotName;
        await this.fetchRobotData(); // Neue Position abrufen
    }

    private async fetchRobotData() {
        if (!this.robotName) return;

        try {
            const response = await fetch(`http://localhost:8088/api/positions?robot=${this.robotName}`);
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

    private handleInputChange(event: Event, property: 'robotName' | 'positionX' | 'positionY') {
        const input = event.target as HTMLInputElement;
        // @ts-ignore
        this[property] = property === 'robotName' ? input.value : parseInt(input.value, 10) || 0;
    }

    private async handleCreateRobotClick() {
        try {
            const response = await fetch('http://localhost:8088/api/robots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'waiting', name: this.robotName })
            });
            console.log(await response.json());
        } catch (error) {
            console.error('Fehler beim Erstellen des Roboters:', error);
        }
    }

    private async handleLandClick() {
        try {
            const response = await fetch('http://localhost:8088/api/land', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    robotID: this.robotName,
                    x: this.positionX,
                    y: this.positionY,
                    robotDirection: this.robotDirection,
                })
            });
            console.log(await response.json());
        } catch (error) {
            console.error('Fehler beim Senden der Land-Position:', error);
        }
    }

    private async handleDisconnectClick() {
        try {
            const response = await fetch('http://localhost:8088/api/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    robotID: this.robotName,
                })
            });
            console.log(await response.json());
        } catch (error) {
            console.error('Fehler beim Senden der Disconnect funktion:', error);
        }
    }

    private escapeHTML(unsafe: string): string {
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    render() {
        return html`
            <div class="title">Roboter Info</div>
            <div class="info">
                <div><strong>Name:</strong> ${this.escapeHTML(this.robotName)}</div>
                <div><strong>Position:</strong> ${this.escapeHTML(this.robotPosition)}</div>
                <div><strong>Richtung:</strong> ${this.escapeHTML(this.robotDirection)}</div>
            </div>
            <div class="input-group">
                <input type="text" placeholder="Robotername" .value=${this.robotName} @input=${(e: Event) => this.handleInputChange(e, 'robotName')} />
                <button @click=${this.handleCreateRobotClick}>Roboter Erstellen</button>
                <input type="number" placeholder="Position X" .value=${this.positionX} @input=${(e: Event) => this.handleInputChange(e, 'positionX')} />
                <input type="number" placeholder="Position Y" .value=${this.positionY} @input=${(e: Event) => this.handleInputChange(e, 'positionY')} />
                <select @input=${(e: Event) => this.robotDirection = (e.target as HTMLSelectElement).value}>
                    <option value="">Himmelsrichtung wählen</option>
                    <option value="NORTH">NORTH</option>
                    <option value="EAST">EAST</option>
                    <option value="SOUTH">SOUTH</option>
                    <option value="WEST">WEST</option>
                </select>
                <button @click=${this.handleLandClick}>Land</button>
                <button @click=${this.handleDisconnectClick}>Disconnect</button>
            </div>
        `;
    }
}
