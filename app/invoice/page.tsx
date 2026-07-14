"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const thClass =
  "border border-gray-500 bg-gray-100 px-1 py-[3px] text-center text-[12px] font-bold";

const tdClass =
  "border border-gray-500 px-1 py-[3px] text-center text-[12px]";

const inputClass =
  "w-full border-none bg-transparent px-[3px] py-[2px] text-[12px] outline-none";

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
  const stored = localStorage.getItem("invoice-data");

  if (!stored) return;

  try {
    const data = JSON.parse(stored);

    setInvoiceNo(data.invoiceNo || "");

    setInvoiceDate(
      data.invoiceDate ??
        new Date().toISOString().split("T")[0]
    );

    setIncludeSummary(data.includeSummary ?? true);
    setIncludeWatermark(data.includeWatermark ?? true);
    setShowPTR(data.showPTR ?? true);
    setShowPTS(data.showPTS ?? true);

    if (data.customer) {
      setCustomer(data.customer);
    }

    if (
      Array.isArray(data.items) &&
      data.items.length > 0
    ) {
      setItems(data.items);
    }

    localStorage.removeItem("invoice-data");
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

const CellInput = ({
  value,
  onChange,
  type = "text",
}: {
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <input
    className={inputClass}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

  return (
    <div
      className={`flex min-h-screen w-full ${
        includeSummary ? "" : "no-summary"
      }`}
    >
      <div
        className={`relative flex-1 overflow-x-auto bg-white p-2 ${
          includeWatermark ? "with-watermark" : ""
        }`}
      >
        <div id="logo">
          <b>GST INVOICE</b>
        </div>

        <div id="logo">
          <b>CREDIT</b>
        </div>

        <div className="flex justify-between gap-2 my-1.5">
          <div className="flex items-center gap-1 text-[12px]">
            <label>Invoice No:</label>

            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="px-[5px] py-[3px] text-[12px] border border-gray-300 rounded-sm outline-none focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-1 text-[12px]">
            <label>Invoice Date:</label>

            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="px-[5px] py-[3px] text-[12px] border border-gray-300 rounded-sm outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="mb-2 flex gap-2 max-[900px]:flex-col print:grid print:grid-cols-2 print:gap-1 print:items-stretch">

          {/* Billed By */}
          <div className="min-w-0 flex-1 border border-gray-300 bg-transparent p-2 text-[12px] print:w-auto">
            <h3 className="mb-1.5 text-[14px] font-bold">
              BILLED BY
            </h3>

            <p className="mb-0.5 leading-[1.35]">
              <strong>AL HIRAJ DISTRIBUTOR</strong>
            </p>

            <p className="mb-0.5 leading-[1.35]">
              Address: 16, Next to Masjid Al-Jabbar,
              Medarahalli
            </p>

            <p className="mb-0.5 leading-[1.35]">
              Bangalore - 560090
            </p>

            <p className="leading-[1.35]">
              GSTIN: 29GBHPS2824E1ZE
            </p>
          </div>

          {/* Billed To */}
          <div className="flex min-w-0 flex-1 flex-col border border-gray-300 bg-transparent p-2 text-[12px] print:w-auto">
            <h3 className="mb-1.5 text-[14px] font-bold">
              BILLED TO
            </h3>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] font-bold uppercase outline-none"
                value={customer.customerName}
                onChange={(e) =>
                  updateCustomer("customerName", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">Address:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.address}
                onChange={(e) =>
                  updateCustomer("address", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">City:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.city}
                onChange={(e) =>
                  updateCustomer("city", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">State:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.state}
                onChange={(e) =>
                  updateCustomer("state", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">PIN:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.pin}
                onChange={(e) =>
                  updateCustomer("pin", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">Phone:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.phone}
                onChange={(e) =>
                  updateCustomer("phone", e.target.value)
                }
              />
            </div>

            <div className="mb-0.5 flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">D.L. No:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.dlNo}
                onChange={(e) =>
                  updateCustomer("dlNo", e.target.value)
                }
              />
            </div>

            <div className="flex items-center leading-[1.35]">
              <span className="mr-1 shrink-0">GSTIN:</span>
              <input
                className="flex-1 border-none bg-transparent p-0 text-[12px] outline-none"
                value={customer.gstin}
                onChange={(e) =>
                  updateCustomer("gstin", e.target.value)
                }
              />
            </div>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed border-collapse print:min-w-full">

            <thead>
              <tr>
                <th className={`${thClass} w-[42px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Sl No.
                </th>

                <th className={`${thClass} print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Product
                </th>

                <th className={`${thClass} w-[90px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  HSN
                </th>

                <th className={`${thClass} w-[90px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Batch
                </th>

                <th className={`${thClass} w-[78px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Expiry
                </th>

                <th className={`${thClass} w-[48px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Qty
                </th>

                <th className={`${thClass} w-[55px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Free
                </th>

                <th className={`${thClass} w-[58px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  MRP
                </th>

                {showPTR && (
                  <th className={`${thClass} w-[58px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                    PTR
                  </th>
                )}

                {showPTS && (
                  <th className={`${thClass} w-[58px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                    PTS
                  </th>
                )}

                <th className={`${thClass} w-[58px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Rate
                </th>

                <th className={`${thClass} w-[48px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Dis%
                </th>

                <th className={`${thClass} print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Amount
                </th>

                <th className={`${thClass} w-[48px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  GST
                </th>

                <th className={`${thClass} w-[55px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  SGST
                </th>

                <th className={`${thClass} w-[55px] print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  CGST
                </th>

                <th className={`${thClass} print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`}>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const row = calculateRow(item);

                const printTd = `${tdClass} print:border-black print:px-[3px] print:py-[2px] print:text-[11px]`;

                return (
                  <tr key={index}>
                    <td className={printTd}>{index + 1}</td>

                    <td className={printTd}>
                      <CellInput
                        value={item.product}
                        onChange={(v) =>
                          updateItem(index, "product", v)
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        value={item.hsn}
                        onChange={(v) =>
                          updateItem(index, "hsn", v)
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        value={item.batchNo}
                        onChange={(v) =>
                          updateItem(index, "batchNo", v)
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        value={item.expiry}
                        onChange={(v) =>
                          updateItem(index, "expiry", v)
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        type="number"
                        value={item.quantity}
                        onChange={(v) =>
                          updateItem(index, "quantity", Number(v))
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        value={item.free}
                        onChange={(v) =>
                          updateItem(index, "free", v)
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        value={item.mrp}
                        onChange={(v) =>
                          updateItem(index, "mrp", v)
                        }
                      />
                    </td>

                    {showPTR && (
                      <td className={printTd}>
                        <CellInput
                          type="number"
                          value={item.ptr}
                          onChange={(v) =>
                            updateItem(index, "ptr", Number(v))
                          }
                        />
                      </td>
                    )}

                    {showPTS && (
                      <td className={printTd}>
                        <CellInput
                          type="number"
                          value={item.pts}
                          onChange={(v) =>
                            updateItem(index, "pts", Number(v))
                          }
                        />
                      </td>
                    )}

                    <td className={printTd}>
                      <CellInput
                        type="number"
                        value={item.rate}
                        onChange={(v) =>
                          updateItem(index, "rate", Number(v))
                        }
                      />
                    </td>

                    <td className={printTd}>
                      <CellInput
                        type="number"
                        value={item.discount}
                        onChange={(v) =>
                          updateItem(index, "discount", Number(v))
                        }
                      />
                    </td>

                    <td className={printTd}>
                      {row.amount.toFixed(2)}
                    </td>

                    <td className={printTd}>
                      <CellInput
                        type="number"
                        value={item.gst}
                        onChange={(v) =>
                          updateItem(index, "gst", Number(v))
                        }
                      />
                    </td>

                    <td className={printTd}>
                      {row.sgst.toFixed(2)}
                    </td>

                    <td className={printTd}>
                      {row.cgst.toFixed(2)}
                    </td>

                    <td className={printTd}>
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
                  className="border border-gray-500 bg-gray-50 px-1 py-[3px] text-right text-[12px] font-bold print:border-black print:px-[3px] print:py-[2px] print:text-[11px]"
                >
                  Grand Total
                </td>

                <td className="border border-gray-500 bg-gray-50 px-1 py-[3px] text-center text-[12px] font-bold print:border-black print:px-[3px] print:py-[2px] print:text-[11px]">
                  {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>

          </table>
        </div>

        <br />

        <div className="my-2 flex items-center justify-between gap-3 rounded-md border border-gray-300 bg-gray-50 p-3 print:hidden">
          <div className="flex gap-2 max-md:w-full max-md:flex-col sm:max-md:flex-row">
            <button
              onClick={addRow}
              className="rounded bg-green-600 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-green-700"
            >
              Add New Line
            </button>

            <button
              onClick={() => window.print()}
              className="rounded bg-green-600 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-green-700"
            >
              Download Invoice
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded bg-green-600 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-green-700"
            >
              New Invoice
            </button>
          </div>
        </div>

        <div className="mt-2 grid w-full grid-cols-2 gap-1 max-[900px]:grid-cols-1 print:grid-cols-2 print:gap-[2px]">

          {/* GST Summary */}
          <div className="mt-0 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${thClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                    CLASS
                  </th>
                  <th className={`${thClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                    SUB TOTAL
                  </th>
                  <th className={`${thClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                    SGST
                  </th>
                  <th className={`${thClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                    CGST
                  </th>
                  <th className={`${thClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {[5, 12, 18, 28].map((gst) => (
                  <tr key={gst}>
                    <td className={`${tdClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                      GST {gst}%
                    </td>

                    <td className={`${tdClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                      {gstSummary[gst as 5 | 12 | 18 | 28].amount.toFixed(2)}
                    </td>

                    <td className={`${tdClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                      {gstSummary[gst as 5 | 12 | 18 | 28].sgst.toFixed(2)}
                    </td>

                    <td className={`${tdClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                      {gstSummary[gst as 5 | 12 | 18 | 28].cgst.toFixed(2)}
                    </td>

                    <td className={`${tdClass} print:border-black print:text-[11px] print:px-[3px] print:py-[2px]`}>
                      {(
                        gstSummary[gst as 5 | 12 | 18 | 28].sgst +
                        gstSummary[gst as 5 | 12 | 18 | 28].cgst
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col justify-center border border-gray-500 bg-transparent p-2 text-[12px] print:border-black print:p-2 print:text-[12px]">

            <div className="mb-1.5 flex justify-between">
              <span>SUB TOTAL</span>
              <span>
                ₹
                {items
                  .reduce(
                    (sum, item) =>
                      sum + calculateRow(item).amount,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <div className="mb-1.5 flex justify-between">
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

            <div className="mb-1.5 flex justify-between">
              <span>NET TOTAL</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>GRAND TOTAL</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

          </div>

        </div>

        <div className="mt-[3px] grid w-full grid-cols-[2.2fr_1.5fr_0.9fr_1.2fr] gap-[3px] max-[900px]:grid-cols-1 print:grid-cols-[2fr_1.4fr_0.8fr_1fr] print:gap-[2px]">

        {/* Terms */}
        <div className="overflow-hidden border border-gray-500 bg-transparent px-[6px] py-[5px] text-[10px] leading-[1.25] print:border-black print:p-1 print:text-[9px]">
          <h4 className="mb-1 text-[11px] font-bold uppercase print:mb-[3px] print:text-[10px]">
            Terms & Conditions
          </h4>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            GOODS ONCE SOLD WILL NOT BE TAKEN BACK OR EXCHANGED.
          </p>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            ALL DISPUTES ARE SUBJECTED TO JURISDICTION ONLY.
          </p>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            BILLS NOT PAID BY DUE DATE WILL ATTRACT 24% INTEREST.
          </p>
        </div>

        {/* Bank */}
        <div className="overflow-hidden border border-gray-500 bg-transparent px-[6px] py-[5px] text-[10px] print:border-black print:p-1 print:text-[9px]">
          <h4 className="mb-1 text-[11px] font-bold uppercase print:mb-[3px] print:text-[10px]">
            Bank Details
          </h4>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            <strong>Name:</strong> AL HIRAJ DISTRIBUTOR
          </p>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            <strong>Bank:</strong> Bank of Baroda
          </p>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            <strong>Account:</strong> 67130200001579
          </p>

          <p className="my-[2px] leading-[1.2] print:my-[1px] print:leading-[1.15]">
            <strong>IFSC:</strong> BARB0VJCHIK
          </p>
        </div>

        {/* QR */}
        <div className="flex items-center justify-center overflow-hidden border border-gray-500 bg-transparent px-[6px] py-[5px] print:border-black print:p-1">
          <img
            src="/upi-id.jpg"
            alt="QR"
            className="h-[75px] w-[75px] object-contain print:h-[65px] print:w-[65px]"
          />
        </div>

        {/* Signature */}
        <div className="flex min-h-[85px] items-end justify-center overflow-hidden border border-gray-500 bg-transparent px-[6px] py-[5px] print:min-h-[72px] print:border-black print:p-1">
          <div className="w-full text-center">
            <h4 className="mb-0 text-[11px] font-bold uppercase print:text-[10px]">
              Authorized Signature
            </h4>
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