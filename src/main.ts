import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './components/nav-element';
import './components/exo-grid';
import './components/robot-controls';
import './components/legend-element';
import './components/left-nav-element';
import './components/robot-mover';
import './components/right-nav-element';

const staticGridSize = { rows: 10, cols: 10 };

@customElement('exo-grid-app')
export class ExoGridApp extends LitElement {
    static styles = css`
    :host {
      display: flex;
      position: relative;
    }
  `;

    render() {
        return html`
      <navbar-component></navbar-component>
      <left-nav-component></left-nav-component>
      <exo-grid .rows=${staticGridSize.rows} .cols=${staticGridSize.cols}></exo-grid>
      <robot-controls></robot-controls>
      <!--<robot-mover></robot-mover>-->
      <right-nav-element></right-nav-element>
    `;
    }
}