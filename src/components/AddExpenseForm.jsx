import { useEffect, useState } from 'react'

const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Education',
    'Other',
]

function AddExpenseForm({
    session,
    onExpenseAdded,
    editingExpense,
    onCancelEdit,
    theme,
}) {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        date: '',
        note: '',
        is_recurring: false,
    })

    const [loading, setLoading] = useState(false)
    const isDark = theme === 'dark'

    const cardBg = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const inputBg = isDark
        ? 'bg-gray-800 text-white border-gray-700 placeholder:text-gray-400'
        : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-500'
    const borderBox = isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
    const labelText = isDark ? 'text-gray-300' : 'text-gray-700'

    useEffect(() => {
        if (editingExpense) {
            setFormData({
                amount: editingExpense.amount || '',
                category: editingExpense.category || 'Food',
                date: editingExpense.date || '',
                note: editingExpense.note || '',
                is_recurring: editingExpense.is_recurring || false,
            })
        } else {
            setFormData({
                amount: '',
                category: 'Food',
                date: '',
                note: '',
                is_recurring: false,
            })
        }
    }, [editingExpense])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        await onExpenseAdded(
            {
                user_id: session.user.id,
                amount: Number(formData.amount),
                category: formData.category,
                date: formData.date,
                note: formData.note,
                is_recurring: formData.is_recurring,
            },
            editingExpense?.id
        )

        if (!editingExpense) {
            setFormData({
                amount: '',
                category: 'Food',
                date: '',
                note: '',
                is_recurring: false,
            })
        }

        setLoading(false)
    }

    return (
        <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
            <h2 className="mb-4 text-2xl font-bold">
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className={`rounded-lg border p-3 outline-none ${inputBg}`}
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`rounded-lg border p-3 outline-none ${inputBg}`}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`rounded-lg border p-3 outline-none ${inputBg}`}
                />

                <input
                    type="text"
                    name="note"
                    placeholder="Note"
                    value={formData.note}
                    onChange={handleChange}
                    className={`rounded-lg border p-3 outline-none ${inputBg}`}
                />

                <div className={`flex items-center gap-3 rounded-lg border p-3 md:col-span-2 ${borderBox}`}>
                    <input
                        id="is_recurring"
                        type="checkbox"
                        name="is_recurring"
                        checked={formData.is_recurring}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label htmlFor="is_recurring" className={`font-medium ${labelText}`}>
                        Mark this as a recurring expense
                    </label>
                </div>

                <div className="flex gap-3 md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                    >
                        {loading
                            ? editingExpense
                                ? 'Updating...'
                                : 'Saving...'
                            : editingExpense
                                ? 'Update Expense'
                                : 'Add Expense'}
                    </button>

                    {editingExpense && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="rounded-lg bg-gray-300 px-5 py-3 font-semibold text-black"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default AddExpenseForm