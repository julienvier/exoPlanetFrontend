import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import robot from "../assets/robot.svg"

@customElement('robot-mover')
export class RobotMover extends LitElement {
    @property({ type: Number }) gridRows = 15;
    @property({ type: Number }) gridCols = 15;

    @state() private robotPosition = { x: 0, y: 0 };
    @state() private direction: 'right' | 'down' | 'left' | 'up' = 'right';

    private intervalId: number | undefined;
    private rotationMap = {
        right: 'rotate(0deg)',
        down: 'rotate(90deg)',
        left: 'rotate(180deg)',
        up: 'rotate(270deg)',
    };

    static styles = css`
        :host {
            display: block;
            position: absolute;
            transition: transform 1s ease;
        }
        .robot {
            width: 40px;
            height: 40px;
            will-change: transform;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.startFetching();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }

    startFetching() {
        this.intervalId = window.setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8088/api/roboter');
                const data = await response.json();
                // Assuming your API returns a direction alongside position
                this.robotPosition = { x: data.x, y: data.y };
                this.direction = data.direction;
            } catch (error) {
                console.error('Error fetching robot position:', error);
            }
        }, 1000); // Fetch every second
    }

    private calculateTransform() {
        const x = this.robotPosition.x * 40; // Assuming each cell is 40px
        const y = this.robotPosition.y * 40;
        const rotation = this.rotationMap[this.direction];
        return `translate(${x}px, ${y}px) ${rotation}`;
    }

    render() {
        return html`
            <div class="robot" style="transform: ${this.calculateTransform()};">
                <img src="${robot}" alt="Robot SVG"/>
            </div>
        `;
    }
}