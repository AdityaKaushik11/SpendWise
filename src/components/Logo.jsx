import { Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link 
            to="/" 
            className="group fixed left-6 top-6 z-[100] flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-gray-200 dark:bg-gray-900/90 dark:border-gray-800"
        >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-inner">
                <div className="absolute inset-0 bg-white/20 opacity-0 blur-[2px] transition-opacity group-hover:opacity-100"></div>
                <Wallet className="relative z-10 h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                SpendWise
            </span>
        </Link>
    )
}
