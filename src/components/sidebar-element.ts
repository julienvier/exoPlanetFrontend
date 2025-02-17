class SidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.robotName = 'ExoBot';
        this.robotPosition = 'N/A';
        this.robotTemperature = 'N/A';
        this.robotDirection = 'N/A';
    }

    connectedCallback() {
        this.render();
        this.fetchRobotData();
    }

    async fetchRobotData() {
        try {
            const response = await fetch('http://localhost:8080/api/robot/position');
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
                </style>

                <div class="title">Roboter Info</div>
                <div class="info">
                    <div><strong>Name:</strong> ${this.robotName}</div>
                    <div><strong>Position:</strong> ${this.robotPosition}</div>
                    <div><strong>Temperatur:</strong> ${this.robotTemperature}°C</div>
                    <div><strong>Richtung:</strong> ${this.robotDirection}</div>
                </div>
            `;
        }
    }
}

customElements.define('sidebar-component', SidebarComponent);
