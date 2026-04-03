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

function BudgetGoals({
    session,
    budgets,
    onSaveBudget,
    onDeleteBudget,
    editingBudget,
    onEditBudget,
    onCancelEdit,
    spendingByCategory,
    theme,
}) {
    const [formData, setFormData] = useState({
        category: 'Food',
        monthly_limit: '',
    })

    const [loading, setLoading] = useState(false)
    const isDark = theme === 'dark'

    const cardBg = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const inputBg = isDark
        ? 'bg-gray-800 text-white border-gray-700 placeholder:text-gray-400'
        : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-500'
    const mutedText = isDark ? 'text-gray-300' : 'text-gray-600'
    const emptyBg = isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
    const rowBg = isDark ? 'bg-gray-800' : 'bg-gray-50'

    useEffect(() => {
        if (editingBudget) {
            setFormData({
                category: editingBudget.category || 'Food',
                monthly_limit: editingBudget.monthly_limit || '',
            })
        } else {
            setFormData({
                category: 'Food',
                monthly_limit: '',
            })
        }
    }, [editingBudget])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        await onSaveBudget(
            {
                user_id: session.user.id,
                category: formData.category,
                monthly_limit: Number(formData.monthly_limit),
            },
            editingBudget?.id
        )

        if (!editingBudget) {
            setFormData({
                category: 'Food',
                monthly_limit: '',
            })
        }

        setLoading(false)
    }

    return (
        <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
            <h2 className="mb-4 text-2xl font-bold">
                {editingBudget ? 'Edit Budget Goal' : 'Budget Goals'}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
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
                    type="number"
                    name="monthly_limit"
                    placeholder="Monthly limit"
                    value={formData.monthly_limit}
                    onChange={handleChange}
                    required
                    className={`rounded-lg border p-3 outline-none ${inputBg}`}
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                    >
                        {loading
                            ? editingBudget
                                ? 'Updating...'
                                : 'Saving...'
                            : editingBudget
                                ? 'Update Budget'
                                : 'Save Budget'}
                    </button>

                    {editingBudget && (
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

            <div className="mt-6">
                {budgets.length === 0 ? (
                    <div className={`rounded-xl p-6 text-center ${emptyBg}`}>
                        No budget goals set yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const spent = Number(spendingByCategory[budget.category] || 0)
                            const limit = Number(budget.monthly_limit)
                            const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                            const overBudget = spent > limit

                            return (
                                <div key={budget.id} className={`rounded-xl p-4 ${rowBg}`}>
                                    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{budget.category}</h3>
                                            <p className={`text-sm ${mutedText}`}>
                                                ₹{spent.toFixed(2)} spent of ₹{limit.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditBudget(budget)}
                                                className="rounded-lg bg-yellow-400 px-3 py-1 text-sm font-medium text-black"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteBudget(budget.id)}
                                                className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-300">
                                        <div
                                            className={`h-full rounded-full ${overBudget ? 'bg-red-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <p className={`mt-2 text-sm font-medium ${overBudget ? 'text-red-400' : mutedText}`}>
                                        {overBudget
                                            ? `Over budget by ₹${(spent - limit).toFixed(2)}`
                                            : `${progress.toFixed(1)}% used`}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BudgetGoals