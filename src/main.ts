import './components/nav-element'
import './components/exo-grid';
import './components/robot-controls';
import './components/legend-element';
import './components/sidebar-element'

const staticGridSize = { rows: 10, cols: 10 };

class ExoGridApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initializeGrid();
    }

    async initializeGrid() {
        const gridElement = document.createElement('exo-grid');

        const { rows, cols } = staticGridSize;
        gridElement.setAttribute('rows', rows.toString());
        gridElement.setAttribute('cols', cols.toString());

        const controlsElement = document.createElement('robot-controls');

        const navbarElement = document.createElement('navbar-component');

        const navElement = document.createElement('sidebar-component');

        if (this.shadowRoot) {
            this.shadowRoot.appendChild(navbarElement);
            this.shadowRoot.appendChild(navElement);
            this.shadowRoot.appendChild(gridElement);
            this.shadowRoot.appendChild(controlsElement);

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
                        gap: 1rem;
                    }
                </style>
            `;
        }
    }
}

customElements.define('exo-grid-app', ExoGridApp);