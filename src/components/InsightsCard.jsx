import { useMemo, useState } from 'react'

function InsightsCard({ expenses, theme }) {
    const [insights, setInsights] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isDark = theme === 'dark'

    const cardBg = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const mutedText = isDark ? 'text-gray-300' : 'text-gray-600'
    const softBox = isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
    const insightBox = isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'

    const last30DaysExpenses = useMemo(() => {
        const now = new Date()
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(now.getDate() - 30)

        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return expenseDate >= thirtyDaysAgo && expenseDate <= now
        })
    }, [expenses])

    const handleGenerateInsights = async () => {
        try {
            setLoading(true)
            setError('')
            setInsights([])

            const last30DaysExpenses = expenses.filter((expense) => {
                const expenseDate = new Date(expense.date)
                const today = new Date()
                const diffTime = today - expenseDate
                const diffDays = diffTime / (1000 * 60 * 60 * 24)
                return diffDays <= 30
            })

            const response = await fetch('http://localhost:5005/api/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expenses: last30DaysExpenses }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch insights')
            }

            setInsights(data.insights || [])
        } catch (error) {
            console.error(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold">AI Spending Insights</h2>
                    <p className={`mt-1 text-sm ${mutedText}`}>
                        Structured Gemini analysis for your last 30 days of spending
                    </p>
                </div>

                <button
                    onClick={handleGenerateInsights}
                    disabled={loading}
                    className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                    {loading ? 'Generating...' : 'Generate Insights'}
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {!insights && !loading && !error && (
                <div className={`rounded-xl p-4 ${softBox}`}>
                    Click Generate Insights to see 3 structured spending insights.
                </div>
            )}

            {loading && (
                <div className={`rounded-xl p-4 ${softBox}`}>
                    Analyzing your spending patterns...
                </div>
            )}

            {insights && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className={`rounded-xl border p-4 ${insightBox}`}>
                        <p className={`mb-2 text-sm font-medium ${mutedText}`}>Top Spending Category</p>
                        <h3 className="text-lg font-bold">
                            {insights.topCategory?.category || 'N/A'}
                        </h3>
                        <p className="mt-2 text-sm">
                            Amount: ₹{Number(insights.topCategory?.amount || 0).toFixed(2)}
                        </p>
                        <p className="mt-1 text-sm">
                            Share: {insights.topCategory?.percentage || 0}%
                        </p>
                    </div>

                    <div className={`rounded-xl border p-4 ${insightBox}`}>
                        <p className={`mb-2 text-sm font-medium ${mutedText}`}>Spending Pattern</p>
                        <h3 className="text-lg font-bold">
                            {insights.pattern?.title || 'Pattern'}
                        </h3>
                        <p className="mt-2 text-sm">
                            {insights.pattern?.summary || 'No summary available.'}
                        </p>
                    </div>

                    <div className={`rounded-xl border p-4 ${insightBox}`}>
                        <p className={`mb-2 text-sm font-medium ${mutedText}`}>Recommendation</p>
                        <h3 className="text-lg font-bold">
                            {insights.recommendation?.title || 'Recommendation'}
                        </h3>
                        <p className="mt-2 text-sm">
                            {insights.recommendation?.summary || 'No recommendation available.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InsightsCard