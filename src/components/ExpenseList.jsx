function ExpenseList({ expenses, onEdit, onDelete, theme }) {
    const isDark = theme === 'dark'

    const cardBg = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const headBg = isDark ? 'bg-gray-800' : 'bg-gray-100'
    const rowBorder = isDark ? 'border-gray-800' : 'border-gray-200'
    const mutedText = isDark ? 'text-gray-300' : 'text-gray-700'
    const emptyBg = isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'

    return (
        <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
            <h2 className="mb-4 text-2xl font-bold">Expense List</h2>

            {expenses.length === 0 ? (
                <div className={`rounded-xl p-6 text-center ${emptyBg}`}>
                    No expenses found for this search.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full overflow-hidden rounded-xl">
                        <thead>
                            <tr className={`${headBg} text-left`}>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Note</th>
                                <th className="px-4 py-3 font-semibold">Type</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className={`border-b last:border-b-0 ${rowBorder}`}>
                                    <td className="px-4 py-3 font-medium">₹{Number(expense.amount).toFixed(2)}</td>
                                    <td className={`px-4 py-3 ${mutedText}`}>{expense.category}</td>
                                    <td className={`px-4 py-3 ${mutedText}`}>
                                        {new Date(expense.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className={`px-4 py-3 ${mutedText}`}>{expense.note || '-'}</td>
                                    <td className="px-4 py-3">
                                        {expense.is_recurring ? (
                                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                Recurring
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                One-time
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(expense)}
                                                className="rounded-lg bg-yellow-400 px-3 py-1 text-sm font-medium text-black"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(expense.id)}
                                                className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ExpenseList