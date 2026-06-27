"use client";

import { useState } from "react";
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

export default function InvoiceForm() {
  const router = useRouter();

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [dlNo, setDlNo] = useState("");
  const [gstin, setGstin] = useState("");

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

    setItems([...items, currentItem]);

    setCurrentItem({
      ...emptyItem(),
      gst: currentItem.gst,
      hsn: currentItem.hsn,
    });
  };

  const removeProduct = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const generateInvoice = () => {
    localStorage.setItem(
      "invoice-data",
      JSON.stringify({
        invoiceNo,
        invoiceDate,

        customer: {
          customerName,
          address,
          city,
          state,
          pin,
          phone,
          dlNo,
          gstin,
        },

        items,
      })
    );

    router.push("/");
  };

  return (
    <div className="invoice-form-page">

      <h1>Invoice Entry</h1>

      <section>

        <h2>Invoice Details</h2>

        <div className="form-field">
        <input
            placeholder="Invoice No"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
        />
        </div>

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) =>
            setInvoiceDate(e.target.value)
          }
        />

      </section>

      <section>

        <h2>Customer Details</h2>

        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
        />

        <input
          placeholder="State"
          value={state}
          onChange={(e) =>
            setState(e.target.value)
          }
        />

        <input
          placeholder="PIN"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value)
          }
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          placeholder="DL No"
          value={dlNo}
          onChange={(e) =>
            setDlNo(e.target.value)
          }
        />

        <input
          placeholder="GSTIN"
          value={gstin}
          onChange={(e) =>
            setGstin(e.target.value)
          }
        />

      </section>

      <section>

        <h2>Add Product</h2>

        <div className="form-field">
        <label>Product</label>
        <input
            value={currentItem.product}
            onChange={(e) =>
            updateItem("product", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>HSN</label>
        <input
            value={currentItem.hsn}
            onChange={(e) =>
            updateItem("hsn", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>Batch No.</label>
        <input
            value={currentItem.batchNo}
            onChange={(e) =>
            updateItem("batchNo", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>Expiry</label>
        <input
            value={currentItem.expiry}
            onChange={(e) =>
            updateItem("expiry", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>Quantity</label>
        <input
            type="number"
            value={currentItem.quantity}
            onChange={(e) =>
            updateItem(
                "quantity",
                Number(e.target.value)
            )
            }
        />
        </div>

        <div className="form-field">
        <label>Free Qty</label>
        <input
            value={currentItem.free}
            onChange={(e) =>
            updateItem("free", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>MRP</label>
        <input
            value={currentItem.mrp}
            onChange={(e) =>
            updateItem("mrp", e.target.value)
            }
        />
        </div>

        <div className="form-field">
        <label>Rate</label>
        <input
            type="number"
            value={currentItem.rate}
            onChange={(e) =>
            updateItem(
                "rate",
                Number(e.target.value)
            )
            }
        />
        </div>

        <div className="form-field">
        <label>Discount (%)</label>
        <input
            type="number"
            value={currentItem.discount}
            onChange={(e) =>
            updateItem(
                "discount",
                Number(e.target.value)
            )
            }
        />
        </div>

        <div className="form-field">
        <label>GST (%)</label>
        <input
            type="number"
            value={currentItem.gst}
            onChange={(e) =>
            updateItem(
                "gst",
                Number(e.target.value)
            )
            }
        />
        </div>


        <button onClick={addProduct}>
          Add Product
        </button>

      </section>

      <section>

        <h2>Products</h2>

        <div className="products-list">

            {items.map((item, index) => (

            <div
              key={index}
              className="product-card"
            >
              <span className="product-name">
                {index + 1}. {item.product}
              </span>

              <button
                type="button"
                className="delete-btn"
                onClick={() => removeProduct(index)}
              >
                ×
              </button>
            </div>

            ))}

        </div>

        </section>

      <button
        className="generate-btn"
        onClick={generateInvoice}
        >
        Generate Invoice
        </button>

    </div>
  );
}