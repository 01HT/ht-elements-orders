"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";

import "./ht-elements-orders-empty.js";
import "./ht-elements-orders-item.js";

class HTElementsOrders extends LitElement {
  render() {
    const { items } = this;
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      #list {
        display:grid;
        grid-gap: 16px;
        margin-top: 32px;
      }
    </style>
    <div id="container">
      ${
        items.length === 0
          ? html`<ht-elements-orders-empty></ht-elements-orders-empty>`
          : html`
          <h1 class="mdc-typography--headline5">Мои заказы</h1>
          <div id="list">
            ${repeat(
              items,
              item =>
                html`<ht-elements-orders-item .data=${item}></ht-elements-orders-item>`
            )}
        </div>`
      }
    </div>
`;
  }

  static get is() {
    return "ht-elements-orders";
  }

  static get properties() {
    return {
      items: { type: Array }
    };
  }
}

customElements.define(HTElementsOrders.is, HTElementsOrders);
