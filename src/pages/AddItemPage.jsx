import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createItem, getCategories } from "../services/api"

export default function CreateItemPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([])

  const [preview, setPreview] = useState(null)

  const [formData, setFormData] = useState({
    item_name: "",
    category_id: "",

    image: null,

    cost_price: "",
    selling_price: "",
    market_price: "",

    variants: [
      {
        size: "",
        design: "",
        sku: "",
        barcode: "",
        stock: "",
        minimum_stock: 5,
      },
    ],
  })

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.log(error)
    }
  }

  // ==========================================
  // PRODUCT FIELDS
  // ==========================================

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ==========================================
  // IMAGE
  // ==========================================

  function handleImage(e) {
    const file = e.target.files[0]

    if (!file) return

    setFormData((prev) => ({
      ...prev,
      image: file,
    }))

    setPreview(URL.createObjectURL(file))
  }

  // ==========================================
  // VARIANT CHANGE
  // ==========================================

  function handleVariantChange(
    index,
    field,
    value
  ) {
    const updated = [...formData.variants]

    updated[index][field] = value

    setFormData({
      ...formData,
      variants: updated,
    })
  }

  // ==========================================
  // ADD VARIANT
  // ==========================================

  function addVariant() {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          size: "",
          design: "",
          sku: "",
          barcode: "",
          stock: "",
          minimum_stock: 5,
        },
      ],
    })
  }

  // ==========================================
  // REMOVE VARIANT
  // ==========================================

  function removeVariant(index) {
    if (formData.variants.length === 1) return

    setFormData({
      ...formData,
      variants: formData.variants.filter(
        (_, i) => i !== index
      ),
    })
  }

  // ==========================================
  // TOTAL STOCK
  // ==========================================

  const totalStock = formData.variants.reduce(
    (total, item) =>
      total + Number(item.stock || 0),
    0
  )

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(e) {
  e.preventDefault()

  setLoading(true)

  try {

    const fd = new FormData()

    fd.append("item_name", formData.item_name)
    fd.append("category_id", formData.category_id)
    fd.append("cost_price", formData.cost_price)
    fd.append("selling_price", formData.selling_price)
    fd.append("market_price", formData.market_price)

    if (formData.image) {
      fd.append("image", formData.image)
    }

    fd.append(
      "variants",
      JSON.stringify(formData.variants)
    )

    const res = await createItem(fd)

    setMessage("Product created successfully")

    setTimeout(() => {
      navigate("/stock")
    }, 1000)

  } catch (error) {
    console.log(error)
    setError("Failed to create product")
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-gray-500 uppercase tracking-[4px] text-sm">
            Inventory Management
          </p>

          <h1 className="text-4xl font-black mt-2">
            Add Product
          </h1>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* TOP SECTION */}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* IMAGE */}

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

              <h2 className="font-bold mb-4">
                Product Image
              </h2>

              <div className="aspect-square rounded-2xl border border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">

                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">
                    No Image
                  </span>
                )}

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="mt-4 w-full"
              />

            </div>

            {/* PRODUCT INFO */}

            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 text-gray-300">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
                  />

                </div>

                <div>

                  <label className="block mb-2 text-gray-300">
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.category_name}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="grid md:grid-cols-3 gap-5 mt-5">

                <div>

                  <label className="block mb-2">
                    Cost Price
                  </label>

                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
                  />

                </div>

                <div>

                  <label className="block mb-2">
                    Selling Price
                  </label>

                  <input
                    type="number"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
                  />

                </div>

                <div>

                  <label className="block mb-2">
                    Market Price
                  </label>

                  <input
                    type="number"
                    name="market_price"
                    value={formData.market_price}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* VARIANTS */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold">
                Product Variants
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="bg-white text-black px-4 py-2 rounded-xl font-semibold"
              >
                + Add Variant
              </button>

            </div>

            <div className="space-y-4">

              {formData.variants.map(
                (variant, index) => (

                  <div
                    key={index}
                    className="grid lg:grid-cols-7 gap-3 border border-zinc-800 rounded-2xl p-4"
                  >

                    <input
                      placeholder="Size"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "size",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <input
                      placeholder="Design"
                      value={variant.design}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "design",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <input
                      placeholder="SKU"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sku",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <input
                      placeholder="Barcode"
                      value={variant.barcode}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "barcode",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <input
                      type="number"
                      placeholder="Min Stock"
                      value={
                        variant.minimum_stock
                      }
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "minimum_stock",
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-800 px-3 py-2 rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(index)
                      }
                      className="bg-red-600 rounded-xl"
                    >
                      Remove
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

          {/* FOOTER */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Variants:
                {" "}
                {formData.variants.length}
              </p>

              <p className="text-gray-400">
                Total Stock:
                {" "}
                {totalStock}
              </p>

            </div>

            <div className="flex gap-4">

              <button
                type="button"
                onClick={() =>
                  navigate("/stock")
                }
                className="bg-zinc-800 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black px-8 py-3 rounded-xl font-bold"
              >
                {loading
                  ? "Saving..."
                  : "Save Product"}
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  )
}