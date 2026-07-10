"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./invoice.css"

type InvoiceItem = {
  product: string;
  hsn: string;
  batchNo: string;
  expiry: string;
  quantity: number;
  free: string;
  mrp: string;
  ptr: number;
  pts: number;
  rate: number;
  discount: number;
  gst: number;
};

export default function Home() {
  const [invoiceNo, setInvoiceNo] = useState("");

const [includeSummary, setIncludeSummary] =
  useState(true);

const [includeWatermark, setIncludeWatermark] =
  useState(true);

const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [showPTR, setShowPTR] = useState(true);
const [showPTS, setShowPTS] = useState(true);

const [customer, setCustomer] = useState({
  customerName: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  phone: "",
  dlNo: "",
  gstin: "",
});

const updateCustomer = (
  field: keyof typeof customer,
  value: string
) => {
  setCustomer((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const [items, setItems] = useState<InvoiceItem[]>([
  {
    product: "",
    hsn: "",
    batchNo: "",
    expiry: "",
    quantity: 1,
    free: "",
    mrp: "",
    ptr: 0,
    pts: 0,
    rate: 1,
    discount: 0,
    gst: 18,
  },
]);

const router = useRouter();

useEffect(() => {
  const stored = localStorage.getItem(
    "invoice-data"
  );

  if (!stored) return;

  try {
    const data = JSON.parse(stored);

    setInvoiceNo(data.invoiceNo || "");

    setInvoiceDate(
      data.invoiceDate ||
        new Date()
          .toISOString()
          .split("T")[0]
    );

    if (data.customer) {
      setCustomer(data.customer);
    }

    if (
      Array.isArray(data.items) &&
      data.items.length > 0
    ) {
      setItems(data.items);
    }

    localStorage.removeItem(
      "invoice-data"
    );
  } catch (err) {
    console.error(
      "Failed to load invoice",
      err
    );
  }
}, []);

const updateItem = (
  index: number,
  field: keyof InvoiceItem,
  value: string | number
) => {
  const updated = [...items];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setItems(updated);
};

const addRow = () => {
  setItems([
    ...items,
    {
      product: "",
      hsn: "",
      batchNo: "",
      expiry: "",
      quantity: 1,
      free: "",
      mrp: "",
      ptr: 0,
      pts: 0,
      rate: 1,
      discount: 0,
      gst: 18,
    },
  ]);
};

const calculateRow = (
  item: InvoiceItem
) => {
  const amount =
    item.quantity * item.rate;

  const cgst =
    (item.gst / 2 / 100) * amount;

  const sgst =
    (item.gst / 2 / 100) * amount;

  const totalBeforeDiscount =
    amount + cgst + sgst;

  const discountAmount =
    (item.discount / 100) *
    totalBeforeDiscount;

  const total =
    totalBeforeDiscount -
    discountAmount;

  return {
    amount,
    sgst,
    cgst,
    total,
  };
};

const grandTotal = items.reduce(
  (sum, item) =>
    sum + calculateRow(item).total,
  0
);

const gstSummary = {
  5: { amount: 0, sgst: 0, cgst: 0 },
  12: { amount: 0, sgst: 0, cgst: 0 },
  18: { amount: 0, sgst: 0, cgst: 0 },
  28: { amount: 0, sgst: 0, cgst: 0 },
};

items.forEach((item) => {
  const row = calculateRow(item);

  const gst = item.gst as
    | 5
    | 12
    | 18
    | 28;

  if (gstSummary[gst]) {
    gstSummary[gst].amount +=
      row.amount;

    gstSummary[gst].sgst +=
      row.sgst;

    gstSummary[gst].cgst +=
      row.cgst;
  }
});

  return (
    <div
      className={`main-wrapper ${
        includeSummary
          ? ""
          : "no-summary"
      }`}
    >
      <div
        className={`container ${
          includeWatermark
            ? "with-watermark"
            : ""
        }`}
      >
        <div id="logo">
          <b>GST INVOICE</b>
        </div>

        <div id="logo">
          <b>CREDIT</b>
        </div>

        <div className="invoice-header">
          <div className="invoice-no">
            <label>Invoice No:</label>

            <input
              type="text"
              value={invoiceNo}
              onChange={(e) =>
                setInvoiceNo(e.target.value)
              }
            />
          </div>

          <div className="invoice-date">
            <label>Invoice Date:</label>

            <input
              type="date"
              value={invoiceDate}
              onChange={(e) =>
                setInvoiceDate(e.target.value)
              }
            />
          </div>
        </div>

        <div className="billing-details">
          <div className="billed-by">
            <h3>BILLED BY</h3>

            <p>
              <strong>
                AL HIRAJ DISTRIBUTOR
              </strong>
            </p>

            <p>
              Address: 16, Next to Masjid
              Al-Jabbar, Medarahalli
            </p>

            <p>Bangalore - 560090</p>

            <p>GSTIN: 29GBHPS2824E1ZE</p>
          </div>

          <div className="billed-to">
            <h3>BILLED TO</h3>

            <div>Customer Name:
<input
  value={customer.customerName}
  onChange={(e) =>
    updateCustomer(
      "customerName",
      e.target.value
    )
  }
/></div>
            <div>Address:
<input
  value={customer.address}
  onChange={(e) =>
    updateCustomer(
      "address",
      e.target.value
    )
  }
/></div>
            <div>City:
<input
  value={customer.city}
  onChange={(e) =>
    updateCustomer(
      "city",
      e.target.value
    )
  }
/></div>
            <div>State:
<input
  value={customer.state}
  onChange={(e) =>
    updateCustomer(
      "state",
      e.target.value
    )
  }
/></div>
            <div>PIN:
<input
  value={customer.pin}
  onChange={(e) =>
    updateCustomer(
      "pin",
      e.target.value
    )
  }
/></div>
            <div>Phone:
<input
  value={customer.phone}
  onChange={(e) =>
    updateCustomer(
      "phone",
      e.target.value
    )
  }
/></div>
            <div>D.L No:
<input
  value={customer.dlNo}
  onChange={(e) =>
    updateCustomer(
      "dlNo",
      e.target.value
    )
  }
/></div>
            <div>GSTIN:
<input
  value={customer.gstin}
  onChange={(e) =>
    updateCustomer(
      "gstin",
      e.target.value
    )
  }
/></div>
          </div>
        </div>

        <div className="invoice-items">
          <table id="itemsTable">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Product</th>
                <th>HSN</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Qty</th>
                <th>Free</th>
                <th>MRP</th>

                {showPTR && <th>PTR</th>}
                {showPTS && <th>PTS</th>}

                <th>Rate</th>
                <th>Dis%</th>
                <th>Amount</th>
                <th>GST</th>
                <th>SGST</th>
                <th>CGST</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const row =
                  calculateRow(item);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <input
                        value={item.product}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "product",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.hsn}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "hsn",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.batchNo}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "batchNo",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.expiry}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "expiry",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.free}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "free",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.mrp}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "mrp",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    {showPTR && (
                      <td>
                        <input
                          type="number"
                          value={item.ptr}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "ptr",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                    )}

                    {showPTS && (
                      <td>
                        <input
                          type="number"
                          value={item.pts}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "pts",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                    )}

                    <td>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "rate",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "discount",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      {row.amount.toFixed(2)}
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.gst}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "gst",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      {row.sgst.toFixed(2)}
                    </td>

                    <td>
                      {row.cgst.toFixed(2)}
                    </td>

                    <td>
                      {row.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td
                  colSpan={
                    14 +
                    (showPTR ? 1 : 0) +
                    (showPTS ? 1 : 0)
                  }
                  style={{
                    textAlign: "right",
                  }}
                >                  
                  Grand Total
                </td>

                <td>
                  {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

        </div>

        <br />

        <div className="print-toolbar">
        <div className="toolbar-actions">
          <button onClick={addRow}>
            Add New Line
          </button>

          <button onClick={() => window.print()}>
            Download Invoice
          </button>

          <button onClick={() => router.push("/form")}>
            New Invoice
          </button>
        </div>

        <label
          htmlFor="includeSummary"
          className="summary-toggle"
        >
          <input
            type="checkbox"
            id="includeSummary"
            checked={includeSummary}
            onChange={(e) =>
              setIncludeSummary(
                e.target.checked
              )
            }
          />

          <span>
            Include Transaction Summary
          </span>
        </label>

        <label
          htmlFor="includeWatermark"
          className="summary-toggle"
        >
          <input
            type="checkbox"
            id="includeWatermark"
            checked={includeWatermark}
            onChange={(e) =>
              setIncludeWatermark(
                e.target.checked
              )
            }
          />

          <span>
            Include Watermark
          </span>
        </label>

        <label className="summary-toggle">
          <input
            type="checkbox"
            checked={showPTR}
            onChange={(e) =>
              setShowPTR(e.target.checked)
            }
          />

          <span>Show PTR</span>
        </label>

        <label className="summary-toggle">
          <input
            type="checkbox"
            checked={showPTS}
            onChange={(e) =>
              setShowPTS(e.target.checked)
            }
          />

          <span>Show PTS</span>
        </label>
      </div>


        <div className="summary-row">
          <div className="gst-summary">
            <table>
              <thead>
                <tr>
                  <th>CLASS</th>
                  <th>SUB TOTAL</th>
                  <th>SGST</th>
                  <th>CGST</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {[5, 12, 18, 28].map((gst) => (
                  <tr key={gst}>
                    <td>GST {gst}%</td>

                    <td>
                      {
                        gstSummary[
                          gst as 5 | 12 | 18 | 28
                        ].amount.toFixed(2)
                      }
                    </td>

                    <td>
                      {
                        gstSummary[
                          gst as 5 | 12 | 18 | 28
                        ].sgst.toFixed(2)
                      }
                    </td>

                    <td>
                      {
                        gstSummary[
                          gst as 5 | 12 | 18 | 28
                        ].cgst.toFixed(2)
                      }
                    </td>

                    <td>
                      {(
                        gstSummary[
                          gst as 5 | 12 | 18 | 28
                        ].sgst +
                        gstSummary[
                          gst as 5 | 12 | 18 | 28
                        ].cgst
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals-panel">
            <div>
              <span>SUB TOTAL</span>

              <span>
                ₹
                {items
                  .reduce(
                    (sum, item) =>
                      sum +
                      calculateRow(item).amount,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <div>
              <span>GST PAYABLE</span>

              <span>
                ₹
                {items
                  .reduce(
                    (sum, item) =>
                      sum +
                      calculateRow(item).sgst +
                      calculateRow(item).cgst,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <div>
              <span>NET TOTAL</span>

              <span>
                ₹
                {grandTotal.toFixed(2)}
              </span>
            </div>

            <div className="grand-total">
              <span>GRAND TOTAL</span>

              <span>
                ₹
                {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="terms-box">
            <h4>Terms & Conditions</h4>

            <p>
              GOODS ONCE SOLD WILL NOT BE TAKEN BACK OR EXCHANGED.
            </p>

            <p>
              ALL DISPUTES ARE SUBJECTED TO JURISDICTION ONLY.
            </p>

            <p>
              BILLS NOT PAID BY DUE DATE WILL ATTRACT 24% INTEREST.
            </p>
          </div>

          <div className="bank-details">
            <h4>Bank Details</h4>

            <p>
              <strong>Name:</strong> AL HIRAJ DISTRIBUTOR
            </p>

            <p>
              <strong>Bank:</strong> Bank of Baroda
            </p>

            <p>
              <strong>Account:</strong> 97510000203176
            </p>

            <p>
              <strong>IFSC:</strong> BARB0VJCHIK
            </p>
          </div>

          <div className="qr-section">
            <img
              src="/upi-id.jpg"
              alt="QR"
              className="qr-image"
            />
          </div>

          <div className="signature-section">
            <div className="signature-content">
              <h4>Authorized Signature</h4>
            </div>
          </div>
        </div>

      </div>


      <div
        className={`transaction-summary ${
          includeSummary
            ? "show-summary"
            : "hide-summary"
        }`}
      >
        <h3>Transaction Summary</h3>

        <p><strong>No:</strong> {invoiceNo}</p>
        <p><strong>Date:</strong> {invoiceDate}</p>
        <p><strong>Total:</strong></p>
        <h2>₹{grandTotal.toFixed(2)}</h2>
      </div>
    </div>
  );
}