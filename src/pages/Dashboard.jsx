import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import AddExpenseForm from '../components/AddExpenseForm'
import ExpenseList from '../components/ExpenseList'
import BudgetGoals from '../components/BudgetGoals'
import InsightsCard from '../components/InsightsCard'
import ThemeToggle from '../components/ThemeToggle'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
} from 'recharts'

function Dashboard({ session }) {
    const [expenses, setExpenses] = useState([])
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingExpense, setEditingExpense] = useState(null)
    const [editingBudget, setEditingBudget] = useState(null)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [theme, setTheme] = useState(localStorage.getItem('spendwise-theme') || 'light')
    const formRef = useRef(null)

    useEffect(() => {
        localStorage.setItem('spendwise-theme', theme)
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const isDark = theme === 'dark'

    const chartAxisColor = isDark ? '#9CA3AF' : '#4B5563'
    const chartGridColor = isDark ? '#374151' : '#D1D5DB'
    const chartBarColor = isDark ? '#60A5FA' : '#2563EB'
    const chartLineColor = isDark ? '#34D399' : '#059669'
    const chartPieColors = isDark
        ? ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#F87171', '#22D3EE']
        : ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2']

    const pageBg = isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
    const cardBg = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const mutedText = isDark ? 'text-gray-300' : 'text-gray-600'
    const subText = isDark ? 'text-gray-400' : 'text-gray-500'
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200'
    const inputBg = isDark
        ? 'bg-gray-800 text-white border-gray-700 placeholder:text-gray-400'
        : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-500'
    const softBg = isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-500'

    const fetchExpenses = async () => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', session.user.id)
            .order('date', { ascending: false })

        if (error) setError(error.message)
        else setExpenses(data || [])
    }

    const fetchBudgets = async () => {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })

        if (error) setError(error.message)
        else setBudgets(data || [])
    }

    const fetchAllData = async () => {
        setLoading(true)
        setError('')
        await Promise.all([fetchExpenses(), fetchBudgets()])
        setLoading(false)
    }

    useEffect(() => {
        fetchAllData()
    }, [session.user.id])

    const handleAddOrUpdateExpense = async (payload, expenseId = null) => {
        setError('')

        if (expenseId) {
            const { error } = await supabase
                .from('expenses')
                .update({
                    amount: payload.amount,
                    category: payload.category,
                    date: payload.date,
                    note: payload.note,
                    is_recurring: payload.is_recurring,
                })
                .eq('id', expenseId)

            if (error) {
                setError(error.message)
                return
            }

            setEditingExpense(null)
        } else {
            const { error } = await supabase.from('expenses').insert([payload])

            if (error) {
                setError(error.message)
                return
            }
        }

        await fetchExpenses()
    }

    const handleDeleteExpense = async (expenseId) => {
        const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
        if (error) {
            setError(error.message)
            return
        }
        await fetchExpenses()
    }

    const handleSaveBudget = async (payload, budgetId = null) => {
        setError('')

        if (budgetId) {
            const { error } = await supabase
                .from('budgets')
                .update({
                    category: payload.category,
                    monthly_limit: payload.monthly_limit,
                })
                .eq('id', budgetId)

            if (error) {
                setError(error.message)
                return
            }

            setEditingBudget(null)
        } else {
            const { error } = await supabase.from('budgets').insert([payload])

            if (error) {
                setError(error.message)
                return
            }
        }

        await fetchBudgets()
    }

    const handleDeleteBudget = async (budgetId) => {
        const { error } = await supabase.from('budgets').delete().eq('id', budgetId)
        if (error) {
            setError(error.message)
            return
        }
        await fetchBudgets()
    }

    const handleEditExpense = (expense) => {
        setEditingExpense(expense)
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const filteredExpenses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return expenses

        return expenses.filter((expense) => {
            const note = (expense.note || '').toLowerCase()
            const category = (expense.category || '').toLowerCase()
            return note.includes(term) || category.includes(term)
        })
    }, [expenses, searchTerm])

    const handleExportCSV = () => {
        if (filteredExpenses.length === 0) {
            alert('No expenses available to export.')
            return
        }

        const headers = ['Amount', 'Category', 'Date', 'Note', 'Type']
        const rows = filteredExpenses.map((expense) => [
            Number(expense.amount).toFixed(2),
            expense.category,
            expense.date,
            expense.note || '',
            expense.is_recurring ? 'Recurring' : 'One-time',
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map((row) =>
                row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
            ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'spendwise-expenses.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const totalThisMonth = useMemo(() => {
        const now = new Date()
        return expenses
            .filter((expense) => {
                const expenseDate = new Date(expense.date)
                return (
                    expenseDate.getMonth() === now.getMonth() &&
                    expenseDate.getFullYear() === now.getFullYear()
                )
            })
            .reduce((sum, expense) => sum + Number(expense.amount), 0)
    }, [expenses])

    const highestCategory = useMemo(() => {
        const totals = {}
        expenses.forEach((expense) => {
            totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount)
        })

        let maxCategory = 'N/A'
        let maxAmount = 0

        for (const category in totals) {
            if (totals[category] > maxAmount) {
                maxAmount = totals[category]
                maxCategory = category
            }
        }

        return maxCategory
    }, [expenses])

    const spendingByCategory = useMemo(() => {
        const now = new Date()
        const result = {}

        expenses.forEach((expense) => {
            const expenseDate = new Date(expense.date)
            if (
                expenseDate.getMonth() === now.getMonth() &&
                expenseDate.getFullYear() === now.getFullYear()
            ) {
                result[expense.category] = (result[expense.category] || 0) + Number(expense.amount)
            }
        })

        return result
    }, [expenses])

    const pieChartData = useMemo(() => {
        const grouped = {}
        expenses.forEach((expense) => {
            grouped[expense.category] = (grouped[expense.category] || 0) + Number(expense.amount)
        })

        const total = Object.values(grouped).reduce((sum, value) => sum + value, 0)

        return Object.entries(grouped).map(([name, value]) => ({
            name,
            value,
            percentage: total ? ((value / total) * 100).toFixed(1) : 0,
        }))
    }, [expenses])

    const dailyBarData = useMemo(() => {
        const now = new Date()
        const currentMonthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return (
                expenseDate.getMonth() === now.getMonth() &&
                expenseDate.getFullYear() === now.getFullYear()
            )
        })

        const grouped = {}

        currentMonthExpenses.forEach((expense) => {
            const dateObj = new Date(expense.date)
            const day = dateObj.getDate()
            const fullDate = dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })

            if (!grouped[day]) {
                grouped[day] = {
                    day,
                    fullDate,
                    total: 0,
                    categories: [],
                }
            }

            grouped[day].total += Number(expense.amount)
            grouped[day].categories.push(`${expense.category}: ₹${Number(expense.amount).toFixed(2)}`)
        })

        return Object.values(grouped).sort((a, b) => a.day - b.day)
    }, [expenses])

    const monthlyLineData = useMemo(() => {
        const now = new Date()
        const result = []

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthLabel = date.toLocaleString('default', { month: 'short' })
            const year = date.getFullYear()

            const monthExpenses = expenses.filter((expense) => {
                const expenseDate = new Date(expense.date)
                return (
                    expenseDate.getMonth() === date.getMonth() &&
                    expenseDate.getFullYear() === year
                )
            })

            const total = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
            const categories = [...new Set(monthExpenses.map((expense) => expense.category))]

            result.push({
                month: monthLabel,
                fullMonth: date.toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                }),
                total,
                categories: categories.join(', ') || 'No categories',
            })
        }

        return result
    }, [expenses])

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div
                    className={`rounded-lg border p-3 shadow-lg ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
                        }`}
                >
                    <p className="font-semibold">{data.name}</p>
                    <p>Amount: ₹{Number(data.value).toFixed(2)}</p>
                    <p>Percentage: {data.percentage}%</p>
                </div>
            )
        }
        return null
    }

    const CustomBarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div
                    className={`max-w-xs rounded-lg border p-3 shadow-lg ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
                        }`}
                >
                    <p className="font-semibold">{data.fullDate}</p>
                    <p>Total: ₹{Number(data.total).toFixed(2)}</p>
                    <p className="mt-2 text-sm font-medium">Categories:</p>
                    <ul className="list-disc pl-5 text-sm">
                        {data.categories.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )
        }
        return null
    }

    const CustomLineTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div
                    className={`rounded-lg border p-3 shadow-lg ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
                        }`}
                >
                    <p className="font-semibold">{data.fullMonth}</p>
                    <p>Total: ₹{Number(data.total).toFixed(2)}</p>
                    <p>Categories: {data.categories}</p>
                </div>
            )
        }
        return null
    }

    const hasNoExpenses = expenses.length === 0

    return (
        <div className={`min-h-screen p-6 transition-colors duration-300 ${pageBg}`}>
            <div className="mx-auto max-w-7xl space-y-6">
                <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">SpendWise Dashboard</h1>
                            <p className={`mt-1 ${mutedText}`}>
                                Logged in as <span className="font-medium">{session.user.email}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <ThemeToggle theme={theme} setTheme={setTheme} />
                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                        <p className={`text-sm ${subText}`}>Total This Month</p>
                        <h2 className="mt-2 text-3xl font-bold">₹{totalThisMonth.toFixed(2)}</h2>
                    </div>

                    <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                        <p className={`text-sm ${subText}`}>Highest Category</p>
                        <h2 className="mt-2 text-3xl font-bold">{highestCategory}</h2>
                    </div>
                </div>

                <div ref={formRef}>
                    <AddExpenseForm
                        session={session}
                        onExpenseAdded={handleAddOrUpdateExpense}
                        editingExpense={editingExpense}
                        onCancelEdit={() => setEditingExpense(null)}
                        theme={theme}
                    />
                </div>

                <BudgetGoals
                    session={session}
                    budgets={budgets}
                    onSaveBudget={handleSaveBudget}
                    onDeleteBudget={handleDeleteBudget}
                    editingBudget={editingBudget}
                    onEditBudget={setEditingBudget}
                    onCancelEdit={() => setEditingBudget(null)}
                    spendingByCategory={spendingByCategory}
                    theme={theme}
                />

                <InsightsCard expenses={expenses} theme={theme} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                        <h2 className="mb-4 text-2xl font-bold">Category Breakdown</h2>
                        {pieChartData.length === 0 ? (
                            <div className={`flex h-80 items-center justify-center rounded-xl text-center ${softBg}`}>
                                No chart data yet. Add some expenses and the pie chart will wake up.
                            </div>
                        ) : (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={chartPieColors[index % chartPieColors.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                        <h2 className="mb-4 text-2xl font-bold">Daily Totals This Month</h2>
                        {dailyBarData.length === 0 ? (
                            <div className={`flex h-80 items-center justify-center rounded-xl text-center ${softBg}`}>
                                No daily spending data yet for this month.
                            </div>
                        ) : (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyBarData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                        <XAxis dataKey="day" stroke={chartAxisColor} />
                                        <YAxis stroke={chartAxisColor} />
                                        <Tooltip content={<CustomBarTooltip />} />
                                        <Bar dataKey="total" fill={chartBarColor} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                    <h2 className="mb-4 text-2xl font-bold">Last 6 Months Spending</h2>
                    {monthlyLineData.every((item) => item.total === 0) ? (
                        <div className={`flex h-80 items-center justify-center rounded-xl text-center ${softBg}`}>
                            No monthly trend yet. Once you log expenses, this line will tell the story.
                        </div>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyLineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                    <XAxis dataKey="month" stroke={chartAxisColor} />
                                    <YAxis stroke={chartAxisColor} />
                                    <Tooltip content={<CustomLineTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke={chartLineColor}
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:max-w-md">
                            <label className={`mb-2 block text-sm font-medium ${mutedText}`}>
                                Search Expenses
                            </label>
                            <input
                                type="text"
                                placeholder="Search by note or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full rounded-lg border p-3 outline-none transition ${inputBg}`}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleExportCSV}
                                className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <p className={`mt-3 text-sm ${subText}`}>
                        Showing {filteredExpenses.length} of {expenses.length} expenses
                    </p>
                </div>

                {loading ? (
                    <div className={`rounded-2xl p-6 shadow-md ${cardBg}`}>
                        Loading expenses...
                    </div>
                ) : hasNoExpenses ? (
                    <div className={`rounded-2xl p-10 text-center shadow-md ${cardBg}`}>
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
                            💸
                        </div>
                        <h3 className="text-2xl font-bold">No expenses yet</h3>
                        <p className={`mt-2 ${mutedText}`}>
                            Start by adding your first expense above. Your charts, budgets, and AI insights will begin filling up right after that.
                        </p>
                    </div>
                ) : (
                    <ExpenseList
                        expenses={filteredExpenses}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                        theme={theme}
                    />
                )}
            </div>
        </div>
    )
}

export default Dashboard