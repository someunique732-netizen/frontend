import React, { useEffect, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getOrderBill } from "../services/api";
import { BASE_MEDIA } from "../services/api";

export default function BillPrint() {
  const { orderId } = useParams();

  const printRef = useRef();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);

    getOrderBill(orderId)
      .then((res) => {
        setBill(res);
      })
      .catch((err) => {
        console.error("Bill Load Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Bill...
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        Bill Not Found
      </div>
    );
  }

  const {
    company,
    customer,
    items,
    summary,
    salesperson,
  } = bill;

  return (
    <div className="bg-gray-200 min-h-screen p-6">

      <div className="no-print bg-white border-b px-6 py-4 mb-4 flex items-center justify-between shadow-sm">

  {/* Left Side */}
  <div className="flex items-center gap-4">

    <button
      onClick={() => window.history.back()}
      className="text-gray-700 hover:text-black text-4xl font-bold leading-none"
    >
      ←
    </button>

    <h1 className="text-xl font-semibold text-gray-900">
      Sales Invoice #{bill.invoice_no}
    </h1>

  </div>

  {/* Right Side */}
  <div className="flex items-center gap-3">

    <button
      onClick={handlePrint}
      className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-3 rounded-xl text-black font-medium shadow-sm hover:bg-gray-100"
    >
      <span className="text-lg">🖨️</span>
      <span>Print Receipt</span>
    </button>

    <button className="border border-gray-300 bg-white p-3 rounded-xl text-black shadow-sm hover:bg-gray-100">
      ⋮
    </button>

  </div>

</div>

      {/* BILL */}
      <div
  ref={printRef}
  className="invoice w-[79mm] mx-auto bg-white text-black p-3 text-sm"
>

  {/* Header */}
  <div className="text-center">

  <p className="font-bold text-xs mb-2">
    THANK YOU FOR SHOPPING!
  </p>

  <div className="flex items-center justify-center gap-4 mb-3">

    {company?.logo && (
      <img
        src={`${BASE_MEDIA}${company.logo}`}
        alt="logo"
        className="w-20 h-20 object-contain"
      />
    )}

    <div className="text-left">

      <h1 className="text-3xl font-black leading-none">
        {company?.company_name}
      </h1>

      <p className="tracking-[4px] text-sm font-semibold">
          CLOTHING STORE
      </p>

    </div>

  </div>

  <hr className="border-black my-2" />

  <div className="space-y-1 text-sm">

    <div className="flex items-start gap-2 justify-center">
      <FaMapMarkerAlt className="mt-1 shrink-0" />
      <span>{company?.address}</span>
    </div>

    <div className="flex items-center gap-2 justify-center">
      <FaPhoneAlt />
      <span>{company?.phone}</span>
    </div>

    {company?.email && (
      <div className="flex items-center gap-2 justify-center">
        <FaEnvelope />
        <span>{company?.email}</span>
      </div>
    )}

    {company?.website && (
      <div className="flex items-center gap-2 justify-center">
        <FaGlobe />
        <span>{company?.website}</span>
      </div>
    )}

  </div>

</div>

  <hr className="my-3 border-dashed border-black" />

  {/* Invoice */}
  <div className="text-center">
    <h2 className="font-bold text-2xl">
      INVOICE
    </h2>

    <span className="inline-block bg-black text-white px-3 py-1 rounded font-bold">
      {bill.invoice_no}
    </span>
  </div>

  {/* Sales Person Info */}
  <div className="mt-3 text-sm">

  <div className="flex justify-between">
    <span>Date</span>
    <span>{bill.date}</span>
    <span>{bill.time}</span>
  </div>

  <div className="flex justify-between">
    <span>Order ID</span>
    <span>#{bill.order_id}</span>
  </div>

  <div className="flex justify-between">
    <span>Sales Person</span>
    <span>{salesperson?.name}</span>
  </div>

  <div className="flex justify-between">
    <span>Payment Type</span>
    <span>Cash</span>
  </div>

   <div className="flex justify-between">
    <span>Delivery</span>
    <span>{bill.delivery_method || "-"}</span>
  </div>


</div>
 {/* CUSTOMER INFO */}
<div className="border-t border-dashed border-black mt-2 pt-2">
  <h3 className="font-bold text-lg">
    BILL TO:
  </h3>

  <p className="font-bold">
    {customer?.name}
  </p>

  <div className="flex items-center gap-2">
    <FaPhoneAlt className="text-xs" />
    <span>{customer?.phone}</span>
  </div>

  <div className="flex items-start gap-2">
    <FaMapMarkerAlt className="mt-1 text-xs shrink-0" />
    <span>
      {customer?.address}
      <br />
      {customer?.municipality}
    </span>
  </div>
</div>

{/* ITEMS INFO */}
<table className="w-full text-sm mt-2">
  <thead>
    <tr className="border-y border-dashed border-black">
      <th className="text-left py-1">Item</th>
      <th>Qty</th>
      <th>Rate</th>
      <th className="text-right">Total</th>
    </tr>
  </thead>

  <tbody>
    {items.map((item,index)=>(
      <tr key={index}>
        <td className="py-1">
          <div>{item.item_name}</div>
          <div className="text-xs text-gray-600">
            {item.size} / {item.design}
          </div>
        </td>

        <td className="text-center">
          {item.qty}
        </td>

        <td className="text-center">
          {Number(item.rate).toFixed(2)}
        </td>

        <td className="text-right">
          {Number(item.total).toFixed(2)}
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* SUMMARY */}
<div className="border-t border-dashed border-black mt-2 pt-2">

  <div className="flex justify-between">
    <span>Sub Total</span>
    <span>{Number(summary?.subtotal).toFixed(2)}</span>
  </div>

  {Number(summary?.discount) > 0 && (
  <div className="flex justify-between">
    <span>Discount</span>
    <span>-{Number(summary?.discount).toFixed(2)}</span>
  </div>
)}

  <div className="flex justify-between">
    <span>Delivery Charge</span>
    <span>{Number(summary?.delivery_charge).toFixed(2)}</span>
  </div>

</div>

 {/* TOTAL AMOUNT */}
<div className="border-y border-dashed border-black py-2 mt-2">

  <div className="flex justify-between font-extrabold text-xl">

    <span>GRAND TOTAL</span>

    <span>
      {Number(summary?.grand_total).toFixed(2)}
    </span>

  </div>

</div>
 {/* DUE AMOUNT */}
<div className="border border-black mt-3">

  <div className="flex justify-between p-2">
    <span>Paid Amount (Advance)</span>

    <span>
      {Number(summary?.advance_paid).toFixed(2)}
    </span>
  </div>

  <div className="border-t border-black flex justify-between p-2 font-bold text-lg">

    <span>DUE AMOUNT</span>

    <span>
      {Number(summary?.due_amount).toFixed(2)}
    </span>

  </div>

</div>

  {/* QR CODE */}
  {company?.qr_code && (
  <div className="text-center mt-4">

    <img
      src={`${BASE_MEDIA}${company.qr_code}`}
      alt="QR"
      className="w-28 h-28 mx-auto"
    />

    <p className="text-lg">
      Scan to Pay
    </p>

  </div>
)}

  {/* FOOTER */}
  <div className="text-center mt-4 border-t border-black pt-2">

  <p className="font-medium">
    Exchange within 7 days with receipt
  </p>

  <p className="font-medium">
    Please come again.
  </p>

</div>

</div>
<style>{`

@page {
  size: 79mm auto;
  margin: 0;
}

@media print {

  html,
  body {
    width: 79mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  body * {
    visibility: hidden;
  }

  .invoice,
  .invoice * {
    visibility: visible;
  }

  .invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 79mm !important;
    max-width: 79mm !important;
    min-width: 79mm !important;
    margin: 0 !important;
    padding: 12px !important;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
  }

  .no-print {
    display: none !important;
  }
}

`}</style>

    </div>
  );
}