import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (data.session) {
            // Email confirmation is OFF globally in Supabase
            setMessage('Account created successfully! Taking you to the dashboard...')
            setTimeout(() => navigate('/dashboard'), 1500)
        } else if (data.user) {
            // Email confirmation is ON
            setMessage('A confirmation email has been sent to you! Please check your inbox to verify your account, and then log in.')
            setTimeout(() => navigate('/login'), 4000)
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Decorative Side */}
            <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-tr from-purple-700 to-pink-500 p-12 text-white lg:flex">
                <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
                
                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight">
                        Start your journey today.
                    </h1>
                    <p className="text-lg text-purple-100">
                        Join SpendWise and take control of your spending. Get real-time AI insights, set budget goals, and start saving instantly.
                    </p>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">Sign up in seconds and start saving immediately.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
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
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                required
                            />
                        </div>

                        {message && (
                            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-purple-600 py-4 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg disabled:opacity-70"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup