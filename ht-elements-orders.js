"use strict";
import { LitElement, html, css } from "lit-element";
import { render } from "lit-html";

import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";

import "@01ht/ht-date";

// https://glitch.com/edit/#!/lying-blanket?path=app.js:17:5
import "@vaadin/vaadin-grid/vaadin-grid.js";

import "./ht-elements-orders-empty.js";
import "./ht-elements-orders-item-details.js";
import "./ht-elements-orders-grid-styles.js";

import { generateReceipt } from "./generateReceipt.js";
import { generateReport } from "./generateReport.js";

import { callFirebaseHTTPFunction } from "@01ht/ht-client-helper-functions";

import { styles } from "@01ht/ht-theme/styles";

class HTElementsOrders extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        vaadin-grid {
          height: 100%;
        }

        iron-icon {
          min-width: 20px;
          min-height: 20px;
          width: 20px;
          height: 20px;
        }

        #container {
          margin-top: 32px;
        }

        #table {
          height: calc(100vh - 264px);
          margin-top: 24px;
        }

        .type {
          display: flex;
          align-items: center;
          position: relative;
        }

        .type iron-icon {
          margin-right: 4px;
        }

        .amount {
          font-weight: 500;
          font-size: 13px;
        }

        .positive {
          color: var(--accent-color);
        }

        .waiting {
          color: rgb(255, 153, 0);
        }

        .details {
          display: flex;
          height: 128px;
          overflow: auto;
          padding: 8px 16px 0 16px;
          border: 1px solid #e8ebef;
        }

        .paid-via {
          margin: 8px 0;
        }

        .paid-via-value {
          font-weight: 500;
        }

        .receipt-icon {
          color: #4285f4;
          cursor: pointer;
        }

        .waiting {
          color: #ffa000;
        }
      `
    ];
  }

  render() {
    const { items } = this;
    return html`
    <iron-iconset-svg size="24" name="ht-elements-orders">
      <svg>
          <defs>
            <g id="check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></g>
            <g id="schedule"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g>
            <g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
            <g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
            <g id="purchase"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path></g>
            <g id="payout"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"></path></g>
            <g id="file-download"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g>
          </defs>
      </svg>
    </iron-iconset-svg>
    <div id="container">
      ${
        items.length === 0
          ? html`<ht-elements-orders-empty></ht-elements-orders-empty>`
          : html`
          <h1 class="mdc-typography--headline5">Мои заказы</h1>
            <div id="table">
                <vaadin-grid .items="${items}" .rowDetailsRenderer="${
              this.rowDetailsRenderer
            }">
                <vaadin-grid-column width="70px" header="№" .renderer="${
                  this.numberRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="170px" header="Статус" .renderer="${
                  this.statusRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="100px"  header="Тип" .renderer="${
                  this.typeRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="130px" header="Дата" .renderer="${
                  this.dateRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="80px" header="Сумма" .renderer="${
                  this.amountRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="160px" header="Детали" .renderer="${
                  this._boundToggleDetailsRenderer
                }"></vaadin-grid-column>  
                <vaadin-grid-column width="110px" header="Документы" .renderer="${
                  this.receiptRenderer
                }"></vaadin-grid-column>       
            </div>
        `
      }
    </div>
`;
  }

  static get properties() {
    return {
      items: {
        type: Array,
        hasChanged: () => true
      }
    };
  }

  constructor() {
    super();
    this._boundToggleDetailsRenderer = this.toggleDetailsRenderer.bind(this); // need this to invoke class methods in renderers
  }

  get grid() {
    return this.shadowRoot.querySelector("vaadin-grid");
  }

  numberRenderer(root, column, rowData) {
    const orderNumber = rowData.item.orderNumber;
    render(
      html`
        <span class="order-number">${orderNumber}</span>
      `,
      root
    );
  }

  statusRenderer(root, column, rowData) {
    let htmlData = html``;
    const statusText = rowData.item.statusText;
    const orderNumber = rowData.item.orderNumber;
    const ordertypeId = rowData.item.ordertypeId;
    const completed = rowData.item.completed;
    if (ordertypeId === "v2m2Mq3clhUhyeex5Xkp") {
      if (completed) {
        htmlData = html`<div class="type"><iron-icon class="positive" icon="ht-elements-orders:check"></iron-icon><span>${statusText}</span></div>`;
      } else {
        htmlData = html`<a class="type" href="/checkout/${orderNumber}"><iron-icon icon="ht-elements-orders:schedule"></iron-icon>${statusText}</a>`;
      }
    }
    if (ordertypeId === "83cNtcXdV0SQhXgU5Ufy") {
      if (completed) {
        htmlData = html`<div class="type"><iron-icon class="positive" icon="ht-elements-orders:check"></iron-icon><span>${statusText}</span></div>`;
      } else {
        htmlData = html`<div class="type waiting" href="/checkout/${orderNumber}"><iron-icon icon="ht-elements-orders:schedule"></iron-icon>${statusText}</div>`;
      }
    }

    render(htmlData, root);
  }

  dateRenderer(root, column, rowData) {
    render(
      html`
        <ht-date .data=${rowData.item.created}></ht-date>
      `,
      root
    );
  }

  amountRenderer(root, column, rowData) {
    const ordertypeId = rowData.item.ordertypeId;
    let amount = "-";
    if (ordertypeId === "83cNtcXdV0SQhXgU5Ufy") {
      amount = "-";
      if (rowData.item.completed) amount = `₽${rowData.item.totalAuthorReward}`;
    } else {
      amount = `$${rowData.item.amount}`;
    }
    render(
      html`
        <span class="amount">${amount}</span>
      `,
      root
    );
  }

  typeRenderer(root, column, rowData) {
    const ordertypeId = rowData.item.ordertypeId;
    const ordertypesData = rowData.item.ordertypesData.name;
    let icon = "";
    switch (ordertypeId) {
      // purchase
      case "v2m2Mq3clhUhyeex5Xkp":
        icon = "purchase";
        break;
      // payout
      case "83cNtcXdV0SQhXgU5Ufy":
        icon = "payout";
        break;
    }
    let htmlData = html`<div class="type"><iron-icon icon="ht-elements-orders:${icon}"></iron-icon><span>${ordertypesData}</span></div>`;
    render(htmlData, root);
  }

  _toggleDetails(value, item) {
    if (value) {
      this.grid.openItemDetails(item);
    } else {
      this.grid.closeItemDetails(item);
    }
  }

  toggleDetailsRenderer(root, column, rowData) {
    // only render the checkbox once, to avoid re-creating during subsequent calls
    let checkboxElem = root.querySelector("vaadin-checkbox");
    const orderNumber = rowData.item.orderNumber;
    const ordertypeId = rowData.item.ordertypeId;
    let htmlData = html``;
    // if (orderNumber && checkboxElem === null) {
    if (ordertypeId === "v2m2Mq3clhUhyeex5Xkp") {
      htmlData = html`
      <vaadin-checkbox @checked-changed="${e =>
        this._toggleDetails(
          e.detail.value,
          root.item
        )}"> Показать детали</vaadin-checkbox>
    `;
      render(htmlData, root);
      // store the item to avoid grid virtual scrolling reusing DOM nodes to mess it up
      root.item = rowData.item;
      if (root.querySelector("vaadin-checkbox")) {
        root.querySelector("vaadin-checkbox").checked =
          this.grid.detailsOpenedItems.indexOf(root.item) > -1;
      }
    } else {
      render(html`-`, root);
    }
  }

  rowDetailsRenderer(root, column, rowData) {
    let htmlData = ``;
    if (rowData.item.items) {
      htmlData = html`${
        rowData.item.paid
          ? html`<div class="paid-via">Оплачено через: <span class="paid-via-value">${
              rowData.item.paymentObject.payment_method.title
            }</span></div>`
          : null
      }<div class="details"><ht-elements-orders-item-details .items=${
        rowData.item.items
      }></ht-elements-orders-item-details></div>`;
    }
    render(htmlData, root);
  }

  receiptRenderer(root, column, rowData) {
    let htmlData = ``;
    const ordertypeId = rowData.item.ordertypeId;
    const orderData = rowData.item;
    const orderId = rowData.item.orderId;
    const orderNumber = rowData.item.orderNumber;
    const paid = rowData.item.paid;
    const completed = rowData.item.completed;
    // purchase
    if (ordertypeId === "v2m2Mq3clhUhyeex5Xkp") {
      if (paid) {
        let template = generateReceipt(orderData);
        htmlData = html`<iron-icon class="receipt-icon" @click=${_ => {
          let iframe = document.createElement("iframe");
          iframe.style = "position:fixed;visibility:hidden";
          document.body.appendChild(iframe);
          let iframeWindow = iframe.contentWindow;
          let doc = iframeWindow.document;
          doc.open();
          // iframeWindow.addEventListener("receipt-ready", e => {
          //  e.stopPropagation();
          //  document.body.removeChild(iframe);
          // });
          doc.write(template);
          doc.close();
          setTimeout(_ => {
            document.body.removeChild(iframe);
          }, 6000);
        }} icon="ht-elements-orders:file-download"></iron-icon>`;
      }
    }
    // payout
    if (ordertypeId === "83cNtcXdV0SQhXgU5Ufy") {
      if (completed) {
        htmlData = html`<iron-icon class="receipt-icon" @click=${async _ => {
          let response = await callFirebaseHTTPFunction({
            name: "httpsReportsPreview",
            authorization: true,
            options: {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ orderId: orderId })
            }
          });
          let reportHTML = response.reportHTML;
          let documentHTML = await generateReport(reportHTML, orderNumber);
          let iframe = document.createElement("iframe");
          iframe.style = "position:fixed;visibility:hidden";
          document.body.appendChild(iframe);
          let iframeWindow = iframe.contentWindow;
          let doc = iframeWindow.document;
          doc.open();
          doc.write(documentHTML);
          doc.close();
          setTimeout(_ => {
            document.body.removeChild(iframe);
          }, 6000);
        }} icon="ht-elements-orders:file-download"></iron-icon>`;
      }
    }
    render(htmlData, root);
  }
}

customElements.define("ht-elements-orders", HTElementsOrders);
