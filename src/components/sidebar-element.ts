class SidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.robotName = 'ExoBot';
        this.robotPosition = 'N/A';
        this.robotTemperature = 'N/A';
        this.robotDirection = 'N/A';
        this.availableRobots = [];
        this.positionX = 0;
        this.positionY = 0;
    }

    connectedCallback() {
        this.render();
        this.fetchRobotData();
        this.fetchAvailableRobots();
    }

    async fetchRobotData() {
        try {
            const response = await fetch('http://localhost:8088/api/robot/position');
            if (response.ok) {
                const data = await response.json();
                this.robotPosition = data.position || 'N/A';
                this.robotTemperature = data.temperature || 'N/A';
                this.robotDirection = data.direction || 'N/A';
                this.render();
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Roboter-Daten:', error);
        }
    }

    async fetchAvailableRobots() {
        try {
            const response = await fetch('http://localhost:8088/api/robots');
            if (response.ok) {
                const data = await response.json();
                this.availableRobots = data.robots || [];
                this.render();
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der verfügbaren Roboter:', error);
        }
    }

    handleNameChange(event) {
        this.robotName = event.target.value;
    }

    handleXChange(event) {
        this.positionX = parseInt(event.target.value, 10) || 0;
    }

    handleYChange(event) {
        this.positionY = parseInt(event.target.value, 10) || 0;
    }

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
        } catch (error) {
            console.error('Fehler beim Erstellen des Roboters:', error);
        }
    }

    async handleLandClick() {
        try {
            const response = await fetch('http://localhost:8088/api/positions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planetID: 1, // Beispiel-Planten-ID
                    robotID: 1,  // Beispiel-Roboter-ID
                    x: this.positionX,
                    y: this.positionY,
                    terrain: 'unknown'
                })
            });
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Fehler beim Senden der Land-Position:', error);
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
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
                    }
                    .title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        font-size: 1rem;
                        color: #333;
                    }
                    .info div {
                        padding: 8px;
                        background: #f0f0f0;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .input-group,
                    .actions {
                        margin-top: 20px;
                        width: 100%;
                    }
                    input[type="text"],
                    input[type="number"] {
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        margin-bottom: 10px;
                    }
                    button {
                        width: 100%;
                        padding: 8px;
                        border-radius: 8px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        cursor: pointer;
                        margin-bottom: 5px;
                    }
                    button:hover {
                        background: #45a049;
                    }
                </style>
                <div class="title">Roboter Info</div>
                <div class="info">
                    <div><strong>Name:</strong> ${this.robotName}</div>
                    <div><strong>Position:</strong> ${this.robotPosition}</div>
                    <div><strong>Temperatur:</strong> ${this.robotTemperature}°C</div>
                    <div><strong>Richtung:</strong> ${this.robotDirection}</div>
                </div>
                <div class="input-group">
                    <input type="text" placeholder="Neuer Roboternamen eingeben" value="${this.robotName}" 
                        oninput="this.getRootNode().host.handleNameChange(event)">
                    <input type="number" placeholder="Position X" value="${this.positionX}" 
                        oninput="this.getRootNode().host.handleXChange(event)">
                    <input type="number" placeholder="Position Y" value="${this.positionY}" 
                        oninput="this.getRootNode().host.handleYChange(event)">
                </div>
                <div class="actions">
                    <button onclick="this.getRootNode().host.handleCreateRobotClick()">Roboter Erstellen</button>
                    <button onclick="this.getRootNode().host.handleLandClick()">Land</button>
                </div>
            `;
        }
    }
}

customElements.define('sidebar-component', SidebarComponent);