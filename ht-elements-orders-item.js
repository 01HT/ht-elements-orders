"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@01ht/ht-image";
import "@01ht/ht-date";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-collapse";
import "./ht-elements-orders-item-details";

class HTElementsOrdersItem extends LitElement {
  render() {
    const { data, opened } = this;
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: flex;
        position: relative;
        box-sizing:border-box;
      }

      #container {
        width:100%;
        font-size: 14px;
        position:relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius:3px;
        grid-gap:16px;
        padding: 16px;
        background: #fff;
        overflow:hidden;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      #info {
        flex: 1;
      }

      .value {
        color: var(--secondary-text-color);
      }

      .order-id {
        font-size :16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .amount .value {
        font-weight: 500;
        color: var(--accent-color);
      }

      #header {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        max-width: 140px;
        color: var(--accent-color);
        font-weight: 500;
        cursor:pointer;
        margin: 8px 0;
        user-select: none;
      }

      paper-button {
        margin: 0;
      }

      #actions {
        display:flex;
        justify-content: flex-end;
        margin-top: 8px;
      }

      [hidden] {
        display:none;
      }
    </style>
    <iron-iconset-svg size="24" name="ht-elements-orders-item">
      <svg>
          <defs>
            <g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
            <g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
          </defs>
      </svg>
    </iron-iconset-svg>
    ${
      data
        ? html`
        <div id="container">
          <div id="info">
            <div class="order-id">ID заказа: <span class="value">${
              data.orderId
            }</span></div>
            <div class="status">Статус: <span class="value">${
              data.statusText
            }</span></div>
            <div class="amount">Сумма: <span class="value">$${
              data.amount
            }</span></div>
            <div class="created">Дата создания: <span class="value"><ht-date .data=${
              data.created
            }></ht-date></span></div>
            <div id="details">
              <div id="header" @click=${_ => {
                this.toggle();
              }}><div>Детали заказа</div><iron-icon icon="ht-elements-orders-item:${
            opened ? "expand-less" : "expand-more"
          }"></iron-icon></div>
            </div>
            <iron-collapse ?opened=${opened}>
                <ht-elements-orders-item-details .items=${
                  data.items
                }></ht-elements-orders-item-details>
              </iron-collapse>
          </div>
          <div id="actions">
            <paper-button raised ?hidden=${data.paid} @click=${_ => {
            this._pay();
          }}>Оплатить</paper-button>
          </div>
      </div>`
        : null
    }
`;
  }

  static get is() {
    return "ht-elements-orders-item";
  }

  static get properties() {
    return {
      data: { type: Object },
      opened: { type: Boolean }
    };
  }

  toggle() {
    this.opened = !this.opened;
  }

  _pay() {
    this.dispatchEvent(
      new CustomEvent("on-payment", {
        bubbles: true,
        composed: true,
        detail: {
          orderId: this.data.orderId
        }
      })
    );
  }
}

customElements.define(HTElementsOrdersItem.is, HTElementsOrdersItem);
