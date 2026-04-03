import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            setError(error.message)
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Decorative Side */}
            <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white lg:flex">
                <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
                
                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight">
                        Welcome back to SpendWise.
                    </h1>
                    <p className="text-lg text-blue-100">
                        Pick up where you left off. Review your AI insights, track new expenses, and stay on top of your financial goals.
                    </p>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
                        <p className="mt-2 text-gray-600">Enter your details below to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 py-4 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:opacity-70"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>

                        <p className="text-center text-gray-600">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login