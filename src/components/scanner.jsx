import { useState } from "react"

export default function PackingModal({
  order,
  onClose,
}) {

  const [scanBarcode, setScanBarcode] =
    useState("")

  const [packedItems, setPackedItems] =
    useState([])

  const [scanResult, setScanResult] =
    useState(null)

  const [readyToShip, setReadyToShip] =
    useState(false)

  const handleScan = (e) => {

    if (e.key !== "Enter") return

    const barcode =
      scanBarcode.trim()

    if (!barcode) return

    const foundItem =
      order.items.find(
        item =>
          item.sku?.trim() === barcode
      )

    if (foundItem) {

      let updatedPacked =
        [...packedItems]

      if (
        !updatedPacked.includes(
          barcode
        )
      ) {

        updatedPacked.push(
          barcode
        )

        setPackedItems(
          updatedPacked
        )

      }

      setScanResult({
        success: true,
        name: foundItem.item_name
      })

      const allPacked =
        order.items.every(
          item =>
            updatedPacked.includes(
              item.sku
            )
        )

      if (allPacked) {

        setReadyToShip(true)

        setScanResult({
          success: true,
          name: "Order Ready To Ship"
        })

        // API CALL HERE LATER
        // await readyToShipOrder(order.id)
      }

    } else {

      setScanResult({
        success: false,
        name: barcode
      })

    }

    setScanBarcode("")

  }

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl p-6 border border-zinc-700">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-2xl font-bold text-white">

              📦 Packing Order #{order.id}

            </h2>

            <p className="text-gray-400">

              Scan item barcodes to verify packing

            </p>

          </div>

          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white"
          >
            Close
          </button>

        </div>

        {/* SCANNER */}

        <div className="mb-6">

          <input
            autoFocus
            type="text"
            value={scanBarcode}
            onChange={(e) =>
              setScanBarcode(
                e.target.value
              )
            }
            onKeyDown={handleScan}
            placeholder="Scan barcode here..."
            className="w-full bg-black border border-zinc-700 rounded-2xl p-4 text-white outline-none"
          />

          {scanResult && (

            <div
              className={`mt-4 p-4 rounded-xl text-center font-bold ${
                scanResult.success
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >

              {scanResult.success ? (
                <>✔️ {scanResult.name}</>
              ) : (
                <>❌ Barcode Not Found</>
              )}

            </div>

          )}

        </div>

        {/* ITEMS */}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">

          {order.items?.map(item => {

            const packed =
              packedItems.includes(
                item.sku
              )

            return (

              <div
                key={item.id}
                className="flex justify-between items-center bg-black/30 border border-zinc-800 rounded-2xl p-4"
              >

                <div>

                  <h3 className="font-semibold text-white">

                    {item.item_name}

                  </h3>

                  <p className="text-gray-400 text-sm">

                    SKU: {item.sku}

                  </p>

                  <p className="text-gray-400 text-sm">

                    Qty: {item.quantity}

                  </p>

                </div>

                <div className="text-4xl">

                  {packed ? (
                    <span>
                      ✅
                    </span>
                  ) : (
                    <span>
                      ❌
                    </span>
                  )}

                </div>

              </div>

            )

          })}

        </div>

        {/* READY TO SHIP */}

        {readyToShip && (

          <div className="mt-6 bg-green-600 text-white font-bold text-center p-5 rounded-2xl text-xl">

            🚚 READY TO SHIP

          </div>

        )}

      </div>

    </div>

  )

}