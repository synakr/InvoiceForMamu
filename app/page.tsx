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
  rate: number;
  discount: number;
  gst: number;
};

type Customer = {
  customerName: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  dlNo: string;
  gstin: string;
};

export default function InvoiceForm() {
const router = useRouter();

const [invoiceNo, setInvoiceNo] = useState("");

const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [customer, setCustomer] = useState<Customer>({
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
  field: keyof Customer,
  value: string
) => {
  const updated = {
    ...customer,
    [field]: value,
  };

  if (field === "customerName") {
    const match = savedCustomers.find(
      (c) =>
        c.customerName.toLowerCase() ===
        value.toLowerCase()
    );

    setCustomer(match ?? updated);
    return;
  }

  setCustomer(updated);
};

const [includeSummary, setIncludeSummary] =
  useState(true);

const [includeWatermark, setIncludeWatermark] =
  useState(true);

const [showPTR, setShowPTR] = useState(true);

const [showPTS, setShowPTS] = useState(true);

const emptyItem = (): InvoiceItem => ({
  product: "",
  hsn: "",
  batchNo: "",
  expiry: "",
  quantity: 1,
  free: "",
  mrp: "",
  rate: 1,
  discount: 0,
  gst: 18,
});

const [currentItem, setCurrentItem] =
  useState<InvoiceItem>(emptyItem());

const [items, setItems] = useState<InvoiceItem[]>([]);

const updateItem = (
  field: keyof InvoiceItem,
  value: string | number
) => {
  setCurrentItem((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const addProduct = () => {
  if (!currentItem.product.trim()) return;

  setItems((prev) => [...prev, currentItem]);

  setCurrentItem({
    ...emptyItem(),
    gst: currentItem.gst,
    hsn: currentItem.hsn,
  });
};

const removeProduct = (index: number) => {
  setItems((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const sectionCardClass =
  "rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm";

const inputClass =
  "h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-slate-600";

const generateInvoice = () => {
  localStorage.setItem(
    "invoice-data",
    JSON.stringify({
      invoiceNo,
      invoiceDate,

      includeSummary,
      includeWatermark,
      showPTR,
      showPTS,

      customer,

      items,
    })
  );

  const customers = JSON.parse(
    localStorage.getItem("customers") ?? "[]"
  );

  const exists = customers.some(
    (c: Customer) =>
      c.customerName.toLowerCase() ===
      customer.customerName.toLowerCase()
  );

  if (!exists && customer.customerName.trim()) {
    customers.push(customer);
    localStorage.setItem(
      "customers",
      JSON.stringify(customers)
    );
    setSavedCustomers(customers);
  }

  router.push("/invoice");
};

const [savedCustomers, setSavedCustomers] = useState<Customer[]>([]);

useEffect(() => {
  const stored = localStorage.getItem("customers");

  if (stored) {
    setSavedCustomers(JSON.parse(stored));
  }
}, []);

const [installPrompt, setInstallPrompt] = useState<any>(null);
useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault();
    setInstallPrompt(e);
  };

  window.addEventListener(
    "beforeinstallprompt",
    handler
  );

  return () => {
    window.removeEventListener(
      "beforeinstallprompt",
      handler
    );
  };
}, []);

const installApp = async () => {
  if (!installPrompt) return;

  installPrompt.prompt();

  const { outcome } =
    await installPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("PWA installed");
  }

  setInstallPrompt(null);
};

useEffect(() => {
  const handler = () => {
    setInstallPrompt(null);
  };

  window.addEventListener(
    "appinstalled",
    handler
  );

  return () => {
    window.removeEventListener(
      "appinstalled",
      handler
    );
  };
}, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-10 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white/95 p-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:px-6 sm:py-6 lg:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Invoice Builder
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Invoice Entry
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          <section className={`${sectionCardClass} p-5 sm:p-6 lg:p-7`}>
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Invoice Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">Header information for this bill.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                Header
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label className={labelClass}>Invoice No</label>
                <input
                  placeholder="Invoice No"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className={labelClass}>Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className={`${sectionCardClass} p-5 sm:p-6 lg:p-7`}>
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Customer Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">Keep the party details readable and separated.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                Party
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col gap-2 lg:col-span-1">
                  <label className={labelClass}>Customer Name</label>
                  <input
                    list="customer-list"
                    placeholder="Customer Name"
                    value={customer.customerName}
                    onChange={(e) =>
                      updateCustomer(
                        "customerName",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-2">
                  <label className={labelClass}>Address</label>
                  <input
                    placeholder="Address"
                    value={customer.address}
                    onChange={(e) =>
                      updateCustomer(
                        "address",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex min-w-0 flex-col gap-2">
                  <label className={labelClass}>City</label>
                  <input
                    placeholder="City"
                    value={customer.city}
                    onChange={(e) =>
                      updateCustomer("city", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label className={labelClass}>State</label>
                  <input
                    placeholder="State"
                    value={customer.state}
                    onChange={(e) =>
                      updateCustomer("state", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label className={labelClass}>PIN</label>
                  <input
                    placeholder="PIN"
                    value={customer.pin}
                    onChange={(e) =>
                      updateCustomer("pin", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <label className={labelClass}>Phone</label>
                  <input
                    placeholder="Phone"
                    value={customer.phone}
                    onChange={(e) =>
                      updateCustomer("phone", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col gap-2 lg:col-span-1">
                  <label className={labelClass}>DL No.</label>
                  <input
                    placeholder="DL No"
                    value={customer.dlNo}
                    onChange={(e) =>
                      updateCustomer("dlNo", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-2">
                  <label className={labelClass}>GSTIN</label>
                  <input
                    placeholder="GSTIN"
                    value={customer.gstin}
                    onChange={(e) =>
                      updateCustomer("gstin", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={`${sectionCardClass} p-5 sm:p-6 lg:p-7`}>
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Add Product
                </h2>
                <p className="mt-1 text-sm text-slate-500">Split the line item inputs into clearer rows.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                Line item
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <div className="flex min-w-0 flex-col gap-2 lg:col-span-5">
                  <label className={labelClass}>Product</label>
                  <input
                    value={currentItem.product}
                    onChange={(e) => updateItem("product", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-3">
                  <label className={labelClass}>HSN</label>
                  <input
                    value={currentItem.hsn}
                    onChange={(e) => updateItem("hsn", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                  <label className={labelClass}>Batch No.</label>
                  <input
                    value={currentItem.batchNo}
                    onChange={(e) => updateItem("batchNo", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                  <label className={labelClass}>Expiry</label>
                  <input
                    value={currentItem.expiry}
                    onChange={(e) => updateItem("expiry", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-2">
                  <label className={labelClass}>Qty</label>
                  <input
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) =>
                      updateItem("quantity", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-3">
                  <label className={labelClass}>Free</label>
                  <input
                    value={currentItem.free}
                    onChange={(e) => updateItem("free", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-3">
                  <label className={labelClass}>MRP</label>
                  <input
                    value={currentItem.mrp}
                    onChange={(e) => updateItem("mrp", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                  <label className={labelClass}>Rate</label>
                  <input
                    type="number"
                    value={currentItem.rate}
                    onChange={(e) =>
                      updateItem("rate", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                  <label className={labelClass}>Disc %</label>
                  <input
                    type="number"
                    value={currentItem.discount}
                    onChange={(e) =>
                      updateItem("discount", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                  <label className={labelClass}>GST %</label>
                  <input
                    type="number"
                    value={currentItem.gst}
                    onChange={(e) =>
                      updateItem("gst", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-start sm:justify-end">
                <button
                  onClick={addProduct}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow active:scale-[0.99]"
                >
                  Add Product
                </button>
              </div>
            </div>
          </section>

          <section className={`${sectionCardClass} p-5 sm:p-6`}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Products
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        No products added.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="max-w-72 truncate px-4 py-3">
                          {item.product}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="rounded-md bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${sectionCardClass} p-5 sm:p-6`}>
            <div className="mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Invoice Options
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose what should appear in the generated invoice.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-emerald-500">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                />
                <span>Include Transaction Summary</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-emerald-500">
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                />
                <span>Include Watermark</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-emerald-500">
                <input
                  type="checkbox"
                  checked={showPTR}
                  onChange={(e) => setShowPTR(e.target.checked)}
                />
                <span>Show PTR</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-emerald-500">
                <input
                  type="checkbox"
                  checked={showPTS}
                  onChange={(e) => setShowPTS(e.target.checked)}
                />
                <span>Show PTS</span>
              </label>
            </div>
          </section>

          <div className="flex gap-3">
            {installPrompt && (
              <button
                type="button"
                onClick={installApp}
                className="rounded-2xl border border-emerald-600 px-6 py-3.5 font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Install App
              </button>
            )}

            <button
              onClick={generateInvoice}
              className="flex-1 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 font-semibold text-white"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      </div>

      <datalist id="customer-list">
        {savedCustomers.map((c) => (
          <option
            key={c.customerName}
            value={c.customerName}
          />
        ))}
      </datalist>
    </div>
  );
}