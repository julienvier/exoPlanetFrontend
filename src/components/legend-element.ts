

class LegendComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        max-width: 300px;
                        margin: 20px auto;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        padding: 16px;
                        font-family: sans-serif;
                    }

                    .legend-title {
                        font-size: 1.2rem;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 12px;
                        color: #333;
                    }

                    .legend-container {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .legend-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .color-box {
                        width: 24px;
                        height: 24px;
                        border-radius: 4px;
                        border: 1px solid #000;
                    }

                    .nothing { background-color: white; }
                    .sand { background-color: yellow; }
                    .gravel { background-color: lightgray; }
                    .rock { background-color: darkgray; }
                    .water { background-color: darkblue; }
                    .plants { background-color: limegreen; }
                    .swamp { background-color: black; }
                    .lava { background-color: orange; }
                </style>

                <div class="legend-title">Legende</div>
                <div class="legend-container">
                    <div class="legend-item">
                        <div class="color-box nothing"></div>
                        <span>NICHTS</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box sand"></div>
                        <span>SAND</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box gravel"></div>
                        <span>GEROELL</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box rock"></div>
                        <span>FELS</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box water"></div>
                        <span>WASSER</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box plants"></div>
                        <span>PFLANZEN</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box swamp"></div>
                        <span>MORAST</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box lava"></div>
                        <span>LAVA</span>
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('legend-component', LegendComponent);