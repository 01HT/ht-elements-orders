"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@01ht/ht-image";

import { styles } from "@01ht/ht-theme/styles";

class HTElementsOrdersItemDetails extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        :host {
          display: block;
          position: relative;
          box-sizing: border-box;
        }

        a {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        ht-image {
          width: 80px;
          border-radius: 3px;
          overflow: hidden;
        }

        #container {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .item {
          display: flex;
          margin-bottom: 16px;
        }

        .item span {
          color: var(--secondary-text-color);
        }

        .name {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
        }

        .author {
          display: flex;
          position: relative;
          align-items: center;
        }

        .author,
        .license {
          color: var(--secondary-text-color);
        }

        .author a {
          margin-left: 4px;
        }

        .amount span {
          color: var(--accent-color);
          font-weight: 500;
        }

        .info {
          margin-left: 16px;
        }

        .price {
          margin-top: 4px;
        }
      `
    ];
  }

  render() {
    const { items } = this;
    return html`
    <div id="container">
        ${repeat(
          items,
          data => html`<div class="item">
              <div>
                <a class="image" href="/item/${data.nameInURL}/${
            data.itemNumber
          }">
                    <ht-image placeholder="${
                      window.appConfig.cloudinary.url
                    }/image/upload/c_scale,f_auto,w_60/v${data.image.version}/${
            data.image.public_id
          }.jpg" image="${
            window.appConfig.cloudinary.url
          }/image/upload/c_scale,f_auto,w_480/v${data.image.version}/${
            data.image.public_id
          }.jpg" size="16x9"></ht-image>
                </a>
              </div>
              <div class="info">
                    <a class="name" href="/item/${data.nameInURL}/${
            data.itemNumber
          }">${data.name}</a>
                    <div class="author">от <a href="/${
                      data.authorData.isOrg ? "organization" : "user"
                    }/${data.authorData.nameInURL}/${
            data.authorData.isOrg
              ? `${data.authorData.organizationNumber}`
              : `${data.authorData.userNumber}`
          }"> ${data.authorData.displayName}</a>
                    </div>
                    <div class="license"><a href="https://github.com/01HT/elements-single-commercial-license/tree/v${
                      data.license.version
                    }" target="_blank" rel="noopener nofollow noreferrer">Single Commercial (ESCL)</a></div>
                    <div class="price">Цена: <span>$${data.price}</span></div>
                    <div>Кол-во: <span>${data.quantity}</span></div>
                    <div class="amount">Сумма: <span>$${data.price.toFixed(2) *
                      data.quantity}</span></div>
                </div>
              </div>`
        )}
    </div>
    
`;
  }

  static get properties() {
    return {
      items: { type: Array }
    };
  }
}

customElements.define(
  "ht-elements-orders-item-details",
  HTElementsOrdersItemDetails
);
