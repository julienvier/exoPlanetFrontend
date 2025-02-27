import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('exo-grid')
export class ExoGrid extends LitElement {
    @property({ type: Number }) rows = 15;
    @property({ type: Number }) cols = 15;

    private fetchIntervalId: number | undefined; // ID des Intervalls

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
      justify-content: center;
      align-items: center;
      width: auto;
      height: auto;
      max-width: 95vw;
      max-height: 95vh;
      background: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 20px;
      flex-direction: column;
    }
    .grid {
      display: grid;
      gap: 2px;
      grid-template-columns: repeat(var(--grid-cols), 1fr);
      grid-template-rows: repeat(var(--grid-rows), 1fr);
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      width: var(--grid-width);
      height: var(--grid-height);
    }
    .cell {
      background: linear-gradient(135deg, #eceff1 0%, #b0bec5 100%);
      border: 1px solid #78909c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: #37474f;
      transition: background 0.3s ease;
    }
    .cell:hover {
      background: linear-gradient(135deg, #b0bec5 0%, #eceff1 100%);
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

        this.fetchIntervalId = window.setInterval(() => {
            this.fetchPlanetSize();
        }, 1000);
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
            console.log('Fetch response:', data);

            if (data.Height && data.Width) {
                const height = Number(data.Height);
                const width = Number(data.Width);

                if (!isNaN(height) && !isNaN(width) && height > 0 && width > 0) {
                    this.rows = height;
                    this.cols = width;
                    console.log(`Planet size received: ${this.rows} x ${this.cols}`);

                    this.stopFetching();
                } else {
                    console.warn("Received empty or invalid data, continue fetching.");
                }
            } else {
                console.warn("Invalid response format, continue fetching.", data);
            }
        } catch (error) {
            console.error("Error fetching planet size:", error);
        }
    }

    render() {
        console.log('Render called with rows:', this.rows, 'cols:', this.cols);
        const cellCount = this.rows * this.cols;
        const cells = [];

        for (let i = 0; i < cellCount; i++) {
            cells.push(html`<div class="cell">${i}</div>`);
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
                    ${cells}
                </div>
                ${this.fetchIntervalId !== undefined
                        ? html`<div class="loading">Lade Daten...</div>`
                        : ''}
            </div>
        `;
    }
}