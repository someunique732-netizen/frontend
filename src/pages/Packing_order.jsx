import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  markPacked,
  getItems,
} from "../services/api";

export default function PackingPage() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const { orderId } = useParams();

  const order = state;

  const [stockItems, setStockItems] =
    useState([]);

  const [scanBarcode, setScanBarcode] =
    useState("");

  const [error, setError] =
    useState("");

  const [lastScan, setLastScan] =
    useState(null);

  const [itemsMap, setItemsMap] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LOAD STOCK
  // =====================================

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const data = await getItems();

      setStockItems(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <h2 className="text-2xl font-bold">
            Order Not Found
          </h2>

          <p className="text-gray-400 mt-2">
            #{orderId}
          </p>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // SCAN BARCODE
  // =====================================

  const handleScan = (e) => {
    if (e.key !== "Enter") return;

    const barcode =
      scanBarcode.trim();

    if (!barcode) return;

    let stockVariant = null;

    // FIND IN STOCK

    for (const item of stockItems) {
      const found =
        item.variants?.find(
          (variant) =>
            String(
              variant.barcode
            ) === String(barcode) ||
            String(
              variant.sku
            ) === String(barcode)
        );

      if (found) {
        stockVariant = found;
        break;
      }
    }

    // BARCODE NOT FOUND

    if (!stockVariant) {
      setError(
        "❌ BARCODE NOT FOUND"
      );

      setLastScan(null);

      setScanBarcode("");

      return;
    }

    // FIND IN ORDER

    const orderItem =
      order.items.find(
        (item) =>
          String(item.sku) ===
          String(stockVariant.sku)
      );

    const key =
      stockVariant.sku;

    const isWrong =
      !orderItem;

    setItemsMap((prev) => {
      const existing =
        prev[key] || {
          qty: 0,
          name:
            stockVariant.item_name,
          isWrong,
        };

      return {
        ...prev,
        [key]: {
          ...existing,
          qty:
            existing.qty + 1,
          isWrong,
        },
      };
    });

    setLastScan({
      name:
        stockVariant.item_name,
      sku: stockVariant.sku,
      barcode:
        stockVariant.barcode,
      wrong: isWrong,
    });

    setError(
      isWrong
        ? "⚠ WRONG ASSIGN ITEM"
        : ""
    );

    setScanBarcode("");
  };

  // =====================================
  // QTY CONTROLS
  // =====================================

  const increaseQty = (
    sku
  ) => {
    setItemsMap((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        qty:
          prev[sku].qty + 1,
      },
    }));
  };

  const decreaseQty = (
    sku
  ) => {
    setItemsMap((prev) => {
      const item =
        prev[sku];

      if (!item)
        return prev;

      if (item.qty <= 1) {
        const copy = {
          ...prev,
        };

        delete copy[sku];

        return copy;
      }

      return {
        ...prev,
        [sku]: {
          ...item,
          qty:
            item.qty - 1,
        },
      };
    });
  };

  const removeItem = (
    sku
  ) => {
    setItemsMap((prev) => {
      const copy = {
        ...prev,
      };

      delete copy[sku];

      return copy;
    });
  };

  // =====================================
  // PACKING STATUS
  // =====================================

  const totalItems =
    order.items.length;

  const packedCount =
    order.items.filter(
      (item) => {
        const packedQty =
          itemsMap[
            String(item.sku)
          ]?.qty || 0;

        return (
          packedQty >=
          item.quantity
        );
      }
    ).length;

  const remaining =
    totalItems -
    packedCount;

  const progress =
    totalItems === 0
      ? 0
      : Math.round(
          (packedCount /
            totalItems) *
            100
        );

  const wrongAssignCount =
    Object.values(
      itemsMap
    ).filter(
      (item) =>
        item.isWrong
    ).length;

 const isFullyCorrect =
  totalItems > 0 &&
  wrongAssignCount === 0 &&
  order.items.every((item) => {
    const qty = itemsMap[item.sku]?.qty || 0;
    return qty === item.quantity;
  });

  // =====================================
  // READY TO SHIP
  // =====================================

  const handleReadyToShip =
    async () => {
      try {
        await markPacked(
          order.id
        );

        navigate(
          "/orders"
        );
      } catch (err) {
        console.log(err);
      }
    };

  // =====================================
  // MERGED LIST
  // =====================================

  const mergedItems =
    useMemo(() => {
      const orderItems =
        order.items.map(
          (item) => ({
            ...item,
            isOrder: true,
            data:
              itemsMap[
                item.sku
              ] || {
                qty: 0,
              },
          })
        );

      const wrongItems =
        Object.entries(
          itemsMap
        )
          .filter(
            ([sku]) =>
              !order.items.find(
                (x) =>
                  x.sku ===
                  sku
              )
          )
          .map(
            ([
              sku,
              item,
            ]) => ({
              sku,
              item_name:
                item.name,
              quantity: 0,
              isOrder: false,
              data: item,
            })
          );

      return [
        ...orderItems,
        ...wrongItems,
      ];
    }, [
      itemsMap,
      order.items,
    ]);

    return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">

  <button
    onClick={() => navigate("/orders")}
    className="px-3 py-2 bg-zinc-900 rounded-xl border border-zinc-800"
  >
    ← Back
  </button>

  <div className="text-center">
    <h1 className="font-bold text-lg">
      Packing #{order.id}
    </h1>

    <p className="text-xs text-zinc-500">
      {packedCount} / {totalItems} items
    </p>
  </div>

  <div className="w-12" />
</div>

      <div className="max-w-7xl mx-auto p-4">

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl p-5">

            <p className="text-zinc-400 text-sm">
              Total Items
            </p>

            <h2 className="text-4xl font-black mt-2">
              {totalItems}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl p-5">

            <p className="text-zinc-400 text-sm">
              Packed
            </p>

            <h2 className="text-4xl font-black mt-2 text-green-400">
              {packedCount}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-3xl p-5">

            <p className="text-zinc-400 text-sm">
              Remaining
            </p>

            <h2 className="text-4xl font-black mt-2 text-yellow-400">
              {remaining}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-3xl p-5">

            <p className="text-zinc-400 text-sm">
              Wrong Assign
            </p>

            <h2 className="text-4xl font-black mt-2 text-red-400">
              {wrongAssignCount}
            </h2>

          </div>

        </div>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT PANEL */}

          <div>

            <div className="sticky top-28 space-y-4">

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">

                <h3 className="font-bold text-lg mb-4">
                  Barcode Scanner
                </h3>

                <input
                  autoFocus
                  value={scanBarcode}
                  onChange={(e) =>
                    setScanBarcode(
                      e.target.value
                    )
                  }
                  onKeyDown={handleScan}
                  placeholder="Scan barcode..."
                  className="w-full h-14 bg-black border border-zinc-700 rounded-2xl px-4 text-lg outline-none focus:border-green-500"
                />

                {error && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                    {error}
                  </div>
                )}

              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">

                <h3 className="font-bold mb-4">
                  Last Scan
                </h3>

                {lastScan ? (
                  <div>

                    <div className="font-bold text-lg">
                      {lastScan.name}
                    </div>

                    <div className="text-sm text-zinc-400 mt-1">
                      SKU: {lastScan.sku}
                    </div>

                    <div className="text-sm text-zinc-400">
                      Barcode: {lastScan.barcode}
                    </div>

                    <div
                      className={`mt-4 inline-flex px-3 py-1 rounded-xl text-sm font-semibold ${
                        lastScan.wrong
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {lastScan.wrong
                        ? "WRONG ASSIGN"
                        : "VALID ITEM"}
                    </div>

                  </div>
                ) : (
                  <p className="text-zinc-500">
                    No item scanned yet
                  </p>
                )}

              </div>

              {isFullyCorrect && (
                <div className="mt-6 sticky bottom-4">
                  <button
                    onClick={handleReadyToShip}
                    className="w-full h-14 rounded-2xl bg-green-500 text-black font-black text-lg shadow-lg"
                  >
                    READY TO SHIP
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* ITEMS */}

          <div className="lg:col-span-2">

            <div className="space-y-4">

              {mergedItems.map(
                (item) => {

                  const packedQty =
                    item.data.qty || 0;

                  const requiredQty =
                    item.isOrder
                      ? item.quantity
                      : 0;

                  const isDone =
                    item.isOrder &&
                    packedQty >=
                      requiredQty;

                  const isWrong =
                    !item.isOrder;

                  return (
                    <div
                      key={item.sku}
                      className={`rounded-3xl border p-5 transition-all
                      ${
                        isDone
                          ? "bg-green-500/10 border-green-500/30"
                          : ""
                      }
                      ${
                        isWrong
                          ? "bg-red-500/10 border-red-500/30"
                          : ""
                      }
                      ${
                        !isDone &&
                        !isWrong
                          ? "bg-zinc-900 border-zinc-800"
                          : ""
                      }`}
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>

                          <div className="flex items-center gap-3">

                            <h3 className="font-bold text-lg">
                              {item.item_name}
                            </h3>

                            {isDone && (
                              <span className="text-green-400 font-bold">
                                ✔ Packed
                              </span>
                            )}

                            {isWrong && (
                              <span className="text-red-400 font-bold">
                                ⚠ Wrong Assign
                              </span>
                            )}

                          </div>

                          <p className="text-zinc-500 text-sm mt-1">
                            SKU: {item.sku}
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <div className="text-lg font-black min-w-[80px] text-center">
                            {packedQty}/
                            {requiredQty}
                          </div>

                          <button
                            onClick={() =>
                              increaseQty(
                                item.sku
                              )
                            }
                            className="w-10 h-10 rounded-xl bg-green-500 text-black font-black"
                          >
                            +
                          </button>

                          <button
                            onClick={() =>
                              decreaseQty(
                                item.sku
                              )
                            }
                            className="w-10 h-10 rounded-xl bg-yellow-500 text-black font-black"
                          >
                            −
                          </button>

                          {isWrong && (
                            <button
                              onClick={() =>
                                removeItem(
                                  item.sku
                                )
                              }
                              className="w-10 h-10 rounded-xl bg-red-500 font-black"
                            >
                              ✕
                            </button>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}