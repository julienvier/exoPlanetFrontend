import { LitElement, html, css } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import rotateLeft from '../assets/rotate-left.svg';
import rotateRight from '../assets/rotate-right.svg';

@customElement('robot-controls')
export class RobotControls extends LitElement {

    @property({ type: String }) robotName: string = 'ExoBot';

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

        img {
            width: 25px;
            color: white;
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

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('robot-selected', this.handleRobotSelection);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('robot-selected', this.handleRobotSelection);
    }

    private handleRobotSelection = (event: Event) => {
        const customEvent = event as CustomEvent;
        this.robotName = customEvent.detail.robotName;
        console.log(`Neuer Roboter ausgewählt: ${this.robotName} | Neuer Roboter in robot controls aktiv`);
    };

    private async onMove() {
        try {
            const response = await fetch('http://localhost:8088/api/move', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({robotID: this.robotName})
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
        console.log('MOVE command triggered');
    }

    private async onScan() {
        try {
            const response = await fetch('http://localhost:8088/api/scan', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({robotID: this.robotName})
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
        console.log('Scan Command triggered');
    }

    private async onLeft() {
        try {
            const response = await fetch('http://localhost:8088/api/left', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({robotID: this.robotName})
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
        console.log('Rotate left command triggered');
    }

    private async onRight() {

        try {
            const response = await fetch('http://localhost:8088/api/right', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({robotID: this.robotName})
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
        console.log('Rotate Right command triggered');
    }

    private async onAutomate() {

        try {
            const response = await fetch('http://localhost:8088/api/explore', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: 'waiting', robotID: this.robotName})
            });
            console.log(await response.json());
        } catch (error) {
            console.error('Error on sending Automate Movement command:', error);
        }
        console.log('Automate Movement command triggered');
    }

    render() {
        return html`
            <div class="control-container">
                <div class="title">Robot Controls</div>
                <div class="control-grid">
                    <!-- Oben in der mittleren Zelle -->
                    <div></div>
                    <button @click=${this.onMove}>MOVE</button>
                    <div></div>

                    <!-- Mitte links, MOVE-Button, Mitte rechts -->
                    <button @click=${this.onLeft}><img src="${rotateLeft}"></button>
                    <button @click=${this.onScan}>SCAN</button>
                    <button @click=${this.onRight}><img src="${rotateRight}"></button>

                    <!-- Unten in der mittleren Zelle -->
                    <div></div>
                    <button @click=${this.onAutomate}>AUTO</button>
                    <div></div>
                </div>
            </div>
        `;
    }
}
