import './legend-element.ts';

class NavbarComponent extends HTMLElement {
    private isLegendVisible: boolean;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isLegendVisible = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const hamburgerButton = this.shadowRoot?.querySelector('.hamburger') as HTMLElement | null;
        const legendElement = this.shadowRoot?.querySelector('legend-component') as HTMLElement | null;

        if (hamburgerButton && legendElement) {
            hamburgerButton.addEventListener('click', () => {
                this.isLegendVisible = !this.isLegendVisible;
                if (this.isLegendVisible) {
                    legendElement.style.transform = 'scale(1) translateY(0)';
                    legendElement.style.opacity = '1';
                } else {
                    legendElement.style.transform = 'scale(0.8) translateY(-10px) translateX(20px)';
                    legendElement.style.opacity = '0';
                }
            });
        } else {
            console.error('Hamburger-Button oder Legend-Element nicht gefunden!');
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        position: fixed;
                        top: 20px;
                        left: 0;
                        right: 0;
                        z-index: 10;
                    }

                    .navbar-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 90%; 
                        max-width: 1200px;
                        background: white; 
                        color: black;
                        padding: 10px 20px;
                        border-radius: 12px; 
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); 
                        font-family: sans-serif;
                        position: relative;
                    }

                    .title {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }

                    .hamburger {
                        width: 30px;
                        height: 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 0;
                        position: relative;
                    }

                    .hamburger span {
                        display: block;
                        width: 100%;
                        height: 4px;
                        background: black; 
                        border-radius: 2px;
                        transition: all 0.3s ease;
                    }

                    legend-component {
                        position: absolute;
                        top: 50px;
                        right: 450px; 
                        transform-origin: top right;
                        transform: scale(0.8) translateY(-10px);
                        width: 250px;
                        height: auto;
                        background: #ffffff;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                        opacity: 0;
                        border-radius: 12px;
                        padding: 10px;
                        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-out;
                        will-change: transform, opacity;
                    }
                </style>

                <div class="navbar-container">
                    <div class="title">Exo Planet</div>
                    <button class="hamburger" aria-label="Toggle Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <legend-component></legend-component>
            `;
        }
    }
}

customElements.define('navbar-component', NavbarComponent);