import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createItem, getCategories } from "../services/api"

export default function CreateItemPage() {

  const navigate = useNavigate()

  const [message, setMessage] = useState("")
  
  const [error, setError] = useState("")

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
  <div className="min-h-screen bg-zinc-950 text-white p-6">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Add Product
        </h1>

        <p className="text-zinc-400 mt-2">
          Create a new product and manage variants
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* TOP SECTION */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* IMAGE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h2 className="text-lg font-semibold mb-4">
              Product Image
            </h2>

            <div className="aspect-square rounded-2xl overflow-hidden bg-black border border-zinc-800">

              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  No Image Selected
                </div>
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mt-4 w-full bg-black border border-zinc-800 rounded-xl p-3"
            />

          </div>

          {/* PRODUCT INFO */}

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h2 className="text-lg font-semibold mb-5">
              Product Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 text-zinc-400">
                  Product Name
                </label>

                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl focus:border-white outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-zinc-400">
                  Category
                </label>

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl focus:border-white outline-none"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-5">

              <div>
                <label className="block mb-2 text-zinc-400">
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
                <label className="block mb-2 text-zinc-400">
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
                <label className="block mb-2 text-zinc-400">
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

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Product Variants
            </h2>

            <button
              type="button"
              onClick={addVariant}
              className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
            >
              + Add Variant
            </button>

          </div>

          <div className="space-y-4">

            {formData.variants.map(
              (variant, index) => (

                <div
                  key={index}
                  className="bg-black border border-zinc-800 rounded-2xl p-5"
                >

                  <div className="grid lg:grid-cols-6 gap-3">

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
                      className="bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-xl"
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
                      className="bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-xl"
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
                      className="bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-xl"
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
                      className="bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-xl"
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
                      className="bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(index)
                      }
                      className="bg-red-600 hover:bg-red-700 rounded-xl px-4"
                    >
                      Remove
                    </button>

                  </div>
                </div>

              )
            )}

          </div>

        </div>

        {/* ACTIONS */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/stock")
              }
              className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
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