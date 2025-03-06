import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('exo-grid')
export class ExoGrid extends LitElement {
    @property({ type: Number }) rows = 15;
    @property({ type: Number }) cols = 15;
    @state() positions: any[] = []; // Speichert die Positionen der Roboter
    private fetchIntervalId: number | undefined;

    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
        }
        .grid-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: auto;
            height: auto;
            max-width: 120vw;
            max-height: 120vh;
            background: #f9f9f9;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 20px;
        }
        .grid {
            display: grid;
            gap: 2px;
            grid-template-columns: repeat(var(--grid-cols), 1fr);
            grid-template-rows: repeat(var(--grid-rows), 1fr);
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
            transition: background 0.3s ease;
            border: 1px solid #222;
            width: 60px;
            height: 60px;
        }
        .nothing { background-color: white; }
        .sand { background-color: yellow; }
        .gravel { background-color: lightgray; }
        .rock { background-color: darkgray; }
        .water { background-color: darkblue; }
        .plants { background-color: limegreen; }
        .swamp { background-color: black; }
        .lava { background-color: orange; }
        .robot {
            color: black;
            font-weight: bold;
            text-shadow: 1px 1px 2px white;
        }
        .loading {
            font-size: 18px;
            color: #78909c;
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

    startFetching() {
        this.fetchPlanetSize();
        this.fetchPositions(); // Initiale Abfrage

        this.fetchIntervalId = window.setInterval(() => {
            this.fetchPositions();
        }, 5000);
    }

    stopFetching() {
        if (this.fetchIntervalId !== undefined) {
            clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = undefined;
        }
    }

    async fetchPlanetSize() {
        try {
            const response = await fetch('http://localhost:8088/api/planet-size');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.Height && data.Width) {
                this.rows = Number(data.Height);
                this.cols = Number(data.Width);
                this.stopFetching(); // Planetengröße bleibt konstant, keine weitere Abfrage nötig
            }
        } catch (error) {
            console.error("Error fetching planet size:", error);
        }
    }

    async fetchPositions() {
        try {
            const response = await fetch('http://localhost:8088/api/positions');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.positions = await response.json();
            this.requestUpdate(); // Erzwingt ein Update des Renders
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    }

    getGroundClass(groundType: string): string {
        switch (groundType.toUpperCase()) {
            case 'NICHTS': return 'nothing';
            case 'SAND': return 'sand';
            case 'GEROELL': return 'gravel';
            case 'FELS': return 'rock';
            case 'WASSER': return 'water';
            case 'PFLANZEN': return 'plants';
            case 'MORAST': return 'swamp';
            case 'LAVA': return 'lava';
            default: return 'nothing';
        }
    }

    render() {
        console.log('Render called with rows:', this.rows, 'cols:', this.cols);

        const grid = new Array(this.rows * this.cols).fill({ Ground: 'NICHTS', RobotID: null });

        // Positionen aus API-Daten setzen
        for (const pos of this.positions) {
            const index = pos.Y * this.cols + pos.X;
            if (index < grid.length) {
                grid[index] = { Ground: pos.Ground, RobotID: pos.RobotID };
            }
        }

        const gridWidth = Math.min(this.cols * 40, window.innerWidth * 0.9);
        const gridHeight = Math.min(this.rows * 40, window.innerHeight * 0.9);

        return html`
            <div class="grid-container">
                <div
                    class="grid"
                    style="
                        --grid-cols: ${this.cols};
                        --grid-rows: ${this.rows};
                        --grid-width: ${gridWidth}px;
                        --grid-height: ${gridHeight}px;
                    "
                >
                    ${grid.map((cell) => html`
                        <div class="cell ${this.getGroundClass(cell.Ground)}">
                            ${cell.RobotID ? html`<span class="robot">${cell.RobotID}</span>` : ''}
                        </div>
                    `)}
                </div>
                ${this.fetchIntervalId !== undefined ? html`<div class="loading">Lade Daten...</div>` : ''}
            </div>
        `;
    }
}