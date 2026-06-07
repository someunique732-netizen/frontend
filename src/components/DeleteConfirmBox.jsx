export default function DeleteConfirmBox({
  onCancel,
  onConfirm,
  loading = false
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-3">
          Delete Order?
        </h2>

        <p className="text-gray-400 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-zinc-800 px-5 py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 px-5 py-2 rounded-xl disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}