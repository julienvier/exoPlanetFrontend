import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('exo-grid')
export class ExoGrid extends LitElement {
    @property({ type: Number }) rows = 15;
    @property({ type: Number }) cols = 15;

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
            display: flex;
            flex-direction: column;
        }

        .grid {
            display: grid;
            gap: 2px;
            grid-template-columns: repeat(var(--grid-cols), 1fr);
            grid-template-rows: repeat(var(--grid-rows), 1fr);
            width: min(${this.cols * 40}px, 90vw);
            height: min(${this.rows * 40}px, 90vh);
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
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
    `;

    updated(changedProperties) {
        if (changedProperties.has('rows') || changedProperties.has('cols')) {
            this.requestUpdate();
        }
    }

    render() {
        const cellCount = this.rows * this.cols;
        const cells = [];

        for (let i = 0; i < cellCount; i++) {
            cells.push(html`<div class="cell">${i}</div>`);
        }

        return html`
            <div class="grid-container">
                <div
                        class="grid"
                        style="--grid-cols: ${this.cols}; --grid-rows: ${this.rows}; width: min(${this.cols * 40}px, 90vw); height: min(${this.rows * 40}px, 90vh);">
                    ${cells}
                </div>
            </div>
        `;
    }
}
