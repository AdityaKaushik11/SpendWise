function ThemeToggle({ theme, setTheme }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
            <button
                onClick={() => setTheme('light')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${theme === 'light'
                        ? 'bg-blue-600 text-white'
                        : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
            >
                ☀️ Light
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${theme === 'dark'
                        ? 'bg-gray-900 text-white'
                        : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
            >
                🌙 Dark
            </button>
        </div>
    )
}

export default ThemeToggle