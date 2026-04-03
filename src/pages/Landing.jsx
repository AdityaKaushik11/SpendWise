import { Link } from 'react-router-dom'
import { PieChart, LineChart, Wallet, ShieldCheck, Sparkles } from 'lucide-react'

function Landing({ session }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-200">
            {/* Floating NavBar Actions */}
            <div className="fixed right-6 top-6 z-50 flex items-center gap-4 rounded-2xl bg-white/40 px-5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl border border-white/50">
                {session ? (
                    <Link
                        to="/dashboard"
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="font-semibold text-gray-700 transition hover:text-blue-600">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>

            {/* Hero Section */}
            <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
                {/* Decorative Blobs */}
                <div className="absolute top-1/4 left-1/4 h-72 w-72 -translate-x-1/2 -transparent-y-1/2 rounded-full bg-purple-300/30 mix-blend-multiply blur-3xl filter"></div>
                <div className="absolute top-1/3 right-1/4 h-72 w-72 -translate-x-1/2 -transparent-y-1/2 rounded-full bg-blue-300/30 mix-blend-multiply blur-3xl filter"></div>
                <div className="absolute bottom-1/4 left-1/2 h-72 w-72 -translate-x-1/2 -transparent-y-1/2 rounded-full bg-pink-300/30 mix-blend-multiply blur-3xl filter"></div>

                <div className="relative z-10 max-w-4xl">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
                        Master your money with <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI-Powered
                        </span> Analytics
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
                        SpendWise helps you track expenses, set real-time budget goals, and provides intelligent Gemini AI insights so you can take control of your financial future.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {session ? (
                            <Link
                                to="/dashboard"
                                className="w-full rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700 sm:w-auto"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/signup"
                                className="w-full rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700 sm:w-auto"
                            >
                                Get Started for Free
                            </Link>
                        )}
                        <a
                            href="#about"
                            className="w-full rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-bold text-gray-700 shadow-sm transition hover:-translate-y-1 hover:bg-gray-50 sm:w-auto"
                        >
                            See how it works
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
                        <div className="lg:w-1/2">
                            <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl text-gray-900">About SpendWise</h2>
                            <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                                SpendWise wasn't just built to be another expense tracker. We created it to be your personal fractional CFO. By combining robust manual tracking with cutting-edge Google Gemini AI, SpendWise actively learns your spending habits and constructs tailored financial advice.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Whether you're trying to save up for a new house, control your weekend spending, or just visualize where your paycheck goes... SpendWise gives you total transparency.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:w-1/2">
                            <div className="rounded-2xl bg-blue-50 p-6">
                                <ShieldCheck className="mb-4 h-8 w-8 text-blue-600" />
                                <h4 className="mb-2 text-xl font-bold">Secure by Design</h4>
                                <p className="text-gray-600">Your data is authenticated securely with Supabase, ensuring only you have access to your financials.</p>
                            </div>
                            <div className="rounded-2xl bg-purple-50 p-6">
                                <Sparkles className="mb-4 h-8 w-8 text-purple-600" />
                                <h4 className="mb-2 text-xl font-bold">Instant Empathy</h4>
                                <p className="text-gray-600">AI insights that don't just give you raw numbers, but empathetic tailored advice to encourage good habits.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gray-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">Everything you need, nothing you don't</h2>
                        <p className="mt-4 text-gray-600 text-lg">Powerful features wrapped in a beautiful, simple interface.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <FeatureCard
                            icon={<LineChart className="h-10 w-10 text-blue-500" />}
                            title="Interactive Charts"
                            desc="Visualize your monthly and daily spending perfectly with beautiful dynamic Recharts integrations."
                        />
                        <FeatureCard
                            icon={<Wallet className="h-10 w-10 text-purple-500" />}
                            title="Smart Budgeting"
                            desc="Set and strictly monitor your budgeting limits with granular category tracking dashboards."
                        />
                        <FeatureCard
                            icon={<PieChart className="h-10 w-10 text-pink-500" />}
                            title="Gemini AI Insights"
                            desc="Instantly analyze your last 30 days of spending and receive personalized financial advice."
                        />
                    </div>
                </div>
            </section>

            {/* Bottom CTA / Login Signup Option */}
            {!session && (
                <section className="bg-gradient-to-br from-blue-900 to-purple-900 py-24 text-center text-white">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl">Ready to take control?</h2>
                        <p className="mb-10 text-lg text-blue-100 sm:text-xl">
                            Join thousands of users who have already started their journey to financial freedom. Sign up in seconds or login to view your dashboard.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/signup"
                                className="w-full rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-900 shadow-lg transition hover:scale-105 sm:w-auto"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                to="/login"
                                className="w-full rounded-xl border border-white/30 bg-transparent px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-white/10 sm:w-auto"
                            >
                                Login to Account
                            </Link>
                        </div>
                    </div>
                </section>
            )}
            
            {/* Simple Footer */}
            <footer className="bg-gray-50 py-8 text-center text-gray-500">
                <p>© {new Date().getFullYear()} SpendWise App. All rights reserved.</p>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="group rounded-3xl border border-gray-100 bg-white p-8 transition hover:border-blue-100 hover:shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 shadow-sm transition group-hover:scale-110">
                {icon}
            </div>
            <h3 className="mb-3 text-xl font-bold">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </div>
    )
}

export default Landing
