export function generateReceipt(orderData) {
  let template = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Накладная</title>
    <style>
        body {
        font-family: 'Roboto';
        max-width: 600px;
        width:100%;
        margin: auto;
        font-size: 14px;
        color:#414549;
        }

        a {
        color: #4285f4;
        text-decoration: none;
        outline: 0;
        }

        p {
        line-height:1;
        }

        #logo {
        margin:auto;
        margin-top: 32px;
        text-align:center;
        }

        svg {
        margin:auto;
        text-align:center;
        width:64px;
        height:auto;
        }

        h1 {
        font-weight: 300;
        text-align:center;
        padding:0;
        margin:16px 0 32px 0;
        }

        h2 {
        font-weight:300;
        margin-top:32px;
        }

        tr:last-child td {
        border-bottom: none;
        }

        table {
        width: 100%;
        margin-top: 16px;
        border-spacing: 0;
        }

        td, th {
        padding: 8px 0;
        border-bottom: 1px solid #ddd;
        }

        th {
        text-align:left;
        }
        
        .td-description {
        width: 100%;
        padding: 8px 16px;
        }

        .td-amount {
        text-align:right;
        }

        .value {
        font-weight: 500;
        }

        #total {
        text-align:right;
        margin-top: 16px;
        font-size: 16px;
        font-weight:500;
        }

        #thank {
        font-size: 32px;
        margin-top: 32px;
        color:#ececec;
        font-weight:600;
        }

        #company {
        font-weight:800;
        margin-top:16px;
        font-size:18px;
        }

        #company-details {
        margin-top:16px;
        color:#999999;
        font-size:14px
        }

        #company-details > div {
        margin-bottom: 4px;
        }

        #nds {
        margin-top: 16px;
        }
    </style>
    </head>
    <body>
    <div id="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <circle cx="25" cy="25" r="25" fill="#b3b3b3"/>
        <circle cx="95" cy="60" r="25" fill="#039be5"/>
        <circle cx="25" cy="95" r="25" fill="#83b735"/>
        </svg>
    </div>
    <h1>Invoice</h1>
    <p>We received payment for your order. Thanks for your business!</p>
    <p>Questions? please contact <a href="mailto:support@01.ht">support@01.ht</a></p>
    <table id="info">
        <tr>
        <td>Order №</td>
        <td class="value">${orderData.orderNumber}</td>
        </tr>
        <tr>
        <td>Order type</td>
        <td class="value">Purchase</td>
        </tr>
        <tr>
        <td>Date</td>
        <td class="value">${orderData.updated.toDate().toLocaleString("en", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}</td>
        </tr>
        <tr>
        <td>Account billed</td>
        <td class="value">${orderData.userId}</td>
        </tr>
        <tr>
        <td>Total</td>
        <td class="value">$${orderData.amount} USD (${
    orderData.paymentObject.amount.value
  } ${orderData.paymentObject.amount.currency})</td>
        </tr>
        <tr>
        <td>Paid via</td>
        <td class="value">${orderData.paymentObject.payment_method.title}</td>
        </tr>
    </table>
    <h2>Order details</h2>
    <table id="details">
        <tr>
        <th>Qty</th>
        <th class="td-description">Description</th>
        <th>Amount</th>
        </tr>
        `;

  for (let item of orderData.items) {
    template += `<tr>
                <td>${item.quantity}</td>
                <td class="td-description">${item.name} (ESCL license)</td>
                <td class="td-amount">$${item.price}</td>
            </tr>`;
  }

  template += `
    </table>
    <div id="total">
        Total: USD $${orderData.amount} USD (${
    orderData.paymentObject.amount.value
  } RUB)
    </div>
    <div id="footer">
        <div id="thank">Thank you.</div>
        <div id="company">01HT</div>
        <div id="company-details">
            <div>LLC "01HT"</div>
            <div>Russian Federation</div>
            <div>support@01.ht</div>
            <div>https://01.ht/contact</div>
            <div id="nds">* VAT/GST presently, paid directly by 01HT only in Russian Federation</div>
        </div>
    </div>
    <script src="/node_modules/@01ht/ht-elements-orders/html2pdf.bundle.js"></script>
    <script>
        var element = document.body;
        var opt = {
            margin: 0.5,
            filename: "invoice-${orderData.orderNumber}.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: 'avoid-all' }
        };
        html2pdf()
        .set(opt)
        .from(element)
        .save()
    </script>
    </body>
    </html>`;
  return template;
}
