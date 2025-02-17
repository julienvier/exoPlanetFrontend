import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('robot-controls')
export class RobotControls extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px;
        }

        .control-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 300px;
        }

        .control-grid {
            display: grid;
            grid-template-columns: repeat(3, auto);
            grid-gap: 12px;
            justify-items: center;
            align-items: center;
        }

        button {
            width: 60px;
            height: 40px;
            font-size: 1rem;
            cursor: pointer;
            border: none;
            border-radius: 8px;
            background-color: #007BFF;
            color: white;
            transition: background-color 0.2s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        button:active {
            background-color: #003f7f;
        }

        button:focus {
            outline: none;
            box-shadow: 0 0 4px #007BFF;
        }

        .title {
            font-size: 1.5rem;
            margin-bottom: 16px;
            font-weight: bold;
            color: #333;
        }
    `;

    private onMove() {
        console.log('MOVE command triggered');
    }

    private onUp() {
        console.log('UP (forward / north)');
    }

    private onDown() {
        console.log('DOWN (backward / south)');
    }

    private onLeft() {
        console.log('LEFT');
    }

    private onRight() {
        console.log('RIGHT');
    }

    render() {
        return html`
            <div class="control-container">
                <div class="title">Robot Controls</div>
                <div class="control-grid">
                    <!-- Oben in der mittleren Zelle -->
                    <div></div>
                    <button @click=${this.onUp}>↑</button>
                    <div></div>

                    <!-- Mitte links, MOVE-Button, Mitte rechts -->
                    <button @click=${this.onLeft}>←</button>
                    <button @click=${this.onMove}>MOVE</button>
                    <button @click=${this.onRight}>→</button>

                    <!-- Unten in der mittleren Zelle -->
                    <div></div>
                    <button @click=${this.onDown}>↓</button>
                    <div></div>
                </div>
            </div>
        `;
    }
}
