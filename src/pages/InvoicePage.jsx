import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderBill } from "../services/api";

const BASE_MEDIA = "http://192.168.1.37:8000";

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

      {/* PRINT BUTTON */}
      <div className="text-center mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold"
        >
          Print Bill
        </button>
      </div>

      {/* BILL */}
      <div ref={printRef} className="invoice">

        {/* HEADER */}
        <div className="text-center">

          <p className="top-title">
            THANK YOU FOR SHOPPING!
          </p>

          {company?.logo && (
            <img
              src={`${BASE_MEDIA}${company.logo}`}
              alt="logo"
              className="logo"
            />
          )}

          <h1 className="shop-name">
            {company?.company_name}
          </h1>

          <p>{company?.address}</p>
          <p>{company?.phone}</p>

          {company?.email && (
            <p>{company.email}</p>
          )}
        </div>

        <hr />

        {/* INVOICE TITLE */}
        <div className="text-center mt-3">

          <h2 className="invoice-title">
            INVOICE
          </h2>

          <div className="invoice-number">
            {bill.invoice_no}
          </div>

        </div>

        {/* ORDER INFO */}
        <div className="info-section">

          <div className="row">
            <span>Date</span>
            <span>{bill.date}</span>
          </div>

          <div className="row">
            <span>Time</span>
            <span>{bill.time}</span>
          </div>

          <div className="row">
            <span>Order ID</span>
            <span>#{bill.order_id}</span>
          </div>

          <div className="row">
            <span>Sales Person</span>
            <span>{salesperson?.name || "-"}</span>
          </div>

          <div className="row">
            <span>Payment</span>
            <span>Cash</span>
          </div>

          <div className="row">
            <span>Delivery</span>
            <span>{bill.delivery_method}</span>
          </div>

        </div>

        <hr />

        {/* CUSTOMER */}
        <div className="customer-section">

          <h3>BILL TO</h3>

          <p className="customer-name">
            {customer?.name}
          </p>

          <p>{customer?.phone}</p>

          <p>
            {customer?.address}
            <br />
            {customer?.municipality}
          </p>

        </div>

        <hr />

        {/* ITEMS */}
        <table className="item-table">

          <thead>
            <tr>
              <th align="left">Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            {items?.map((item, index) => (
              <tr key={index}>
                <td>

                  {item.item_name}

                  <div className="variant">
                    {item.size} / {item.design}
                  </div>

                </td>

                <td>{item.qty}</td>

                <td>
                  {Number(item.rate).toFixed(2)}
                </td>

                <td>
                  {Number(item.total).toFixed(2)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

        <hr />

        {/* SUMMARY */}
        <div className="summary">

          <div className="row">
            <span>Sub Total</span>
            <span>
              {Number(summary?.subtotal).toFixed(2)}
            </span>
          </div>

          <div className="row">
            <span>Discount</span>
            <span>
              - {Number(summary?.discount).toFixed(2)}
            </span>
          </div>

          <div className="row">
            <span>Delivery Charge</span>
            <span>
              {Number(summary?.delivery_charge).toFixed(2)}
            </span>
          </div>

          <div className="grand-total">

            <div className="row">
              <span>GRAND TOTAL</span>

              <span>
                {Number(summary?.grand_total).toFixed(2)}
              </span>
            </div>

          </div>

        </div>

        {/* PAYMENT BOX */}
        <div className="payment-box">

          <div className="row">
            <span>Paid Amount (Advance)</span>

            <span>
              {Number(summary?.advance_paid).toFixed(2)}
            </span>
          </div>

          <div className="due-box">

            <div className="row">
              <span>DUE AMOUNT</span>

              <span>
                {Number(summary?.due_amount).toFixed(2)}
              </span>
            </div>

          </div>

        </div>

        {/* QR CODE */}
        {company?.qr_code && (
          <div className="qr-section">

            <img
              src={`${BASE_MEDIA}${company.qr_code}`}
              alt="qr"
              className="qr"
            />

            <p>Scan To Pay</p>

          </div>
        )}

        {/* FOOTER */}
        <div className="footer">

          <hr />

          <p>We appreciate your business!</p>

          <p>
            Please keep this bill for your records.
          </p>

        </div>

      </div>

      {/* CSS */}
      <style>{`

        .invoice{
          width:79mm;
          background:white;
          color:black;
          margin:auto;
          padding:10px;
          font-family:Arial, sans-serif;
          font-size:12px;
          box-shadow:0 0 10px rgba(0,0,0,.2);
        }

        .top-title{
          font-size:12px;
          font-weight:bold;
          margin-bottom:8px;
        }

        .logo{
          width:65px;
          height:auto;
          margin:auto;
          margin-bottom:5px;
        }

        .shop-name{
          font-size:26px;
          font-weight:bold;
          margin:0;
        }

        .invoice-title{
          font-size:18px;
          margin-bottom:6px;
        }

        .invoice-number{
          display:inline-block;
          background:black;
          color:white;
          padding:4px 12px;
          border-radius:4px;
          font-weight:bold;
          font-size:13px;
        }

        .info-section,
        .customer-section,
        .summary{
          margin-top:8px;
        }

        .customer-name{
          font-weight:bold;
          font-size:14px;
        }

        .row{
          display:flex;
          justify-content:space-between;
          margin:3px 0;
        }

        .item-table{
          width:100%;
          border-collapse:collapse;
          margin-top:8px;
        }

        .item-table th{
          border-bottom:1px dashed #999;
          padding:4px;
        }

        .item-table td{
          padding:5px 3px;
          vertical-align:top;
          text-align:center;
        }

        .item-table td:first-child{
          text-align:left;
        }

        .variant{
          font-size:10px;
          color:#666;
        }

        .grand-total{
          border-top:1px dashed #000;
          margin-top:5px;
          padding-top:5px;
          font-weight:bold;
          font-size:14px;
        }

        .payment-box{
          border:1px solid #000;
          margin-top:10px;
        }

        .payment-box .row{
          padding:6px;
        }

        .due-box{
          border-top:1px solid black;
          font-weight:bold;
          font-size:15px;
        }

        .qr-section{
          text-align:center;
          margin-top:12px;
        }

        .qr{
          width:110px;
          height:110px;
          margin:auto;
        }

        .footer{
          text-align:center;
          margin-top:10px;
          font-size:11px;
        }

        hr{
          border:none;
          border-top:1px dashed #999;
          margin:8px 0;
        }

        @page{
          size:79mm auto;
          margin:0;
        }

        @media print{

          body{
            background:white !important;
          }

          .no-print{
            display:none !important;
          }

          .invoice{
            box-shadow:none;
            width:79mm;
            margin:0;
            padding:6px;
          }

        }

      `}</style>

    </div>
  );
}