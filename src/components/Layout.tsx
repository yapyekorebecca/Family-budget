import { Outlet, Link, useLocation } from 'react-router-dom'
import { BarChart3, Settings, TrendingUp, Wallet, Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3, color: 'from-amber-400 to-orange-500' },
    { path: '/expenses', label: 'Expenses', icon: Wallet, color: 'from-violet-400 to-indigo-500' },
    { path: '/statistics', label: 'Statistics', icon: TrendingUp, color: 'from-emerald-400 to-teal-500' },
    { path: '/settings', label: 'Settings', icon: Settings, color: 'from-rose-400 to-pink-500' },
  ]

  return (
    <div className="flex h-screen bg-background dark:bg-dark-background text-text dark:text-dark-text overflow-hidden">
      {/* Sidebar */}
      <nav className="w-72 border-r border-border dark:border-dark-border bg-surface dark:bg-dark-surface flex flex-col relative overflow-hidden">
        {/* Decorative background orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-36 h-36 bg-gradient-to-tr from-indigo-500/10 to-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="p-7 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                FamBudget
              </h1>
              <p className="text-xs text-text-muted dark:text-dark-text-muted font-medium">Family Finance</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-border dark:via-dark-border to-transparent mb-4" />

        {/* Navigation */}
        <div className="flex-1 px-3 py-2 space-y-1">
          <p className="text-[10px] font-semibold text-text-muted dark:text-dark-text-muted uppercase tracking-widest px-4 mb-3">Menu</p>
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-text-muted dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text hover:bg-surface-alt dark:hover:bg-dark-surface-alt'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color}`}
                      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20'
                      : `bg-surface-alt dark:bg-dark-surface-alt group-hover:bg-gradient-to-br group-hover:${item.color}`
                  }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                  </div>
                  <span className="relative z-10 font-semibold text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/70"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Bottom section */}
        <div className="p-4 space-y-3">
          <div className="mx-2 h-px bg-gradient-to-r from-transparent via-border dark:via-dark-border to-transparent" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-alt dark:bg-dark-surface-alt hover:bg-border dark:hover:bg-dark-border transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isDark
                ? <Sun className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
                : <Moon className="w-4 h-4 text-indigo-500" strokeWidth={2.5} />
              }
            </div>
            <span className="text-sm font-semibold text-text-muted dark:text-dark-text-muted">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background dark:bg-dark-background relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
