import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  PieChart,
  Users,
  Target,
  Settings as SettingsIcon,
  Search,
  LogOut,
  Loader2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const location = useLocation()
  const { logout, authLoading, user } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/expenses', label: 'Expenses', icon: Wallet },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/budgets', label: 'Budgets', icon: PieChart },
    { path: '/family', label: 'Family', icon: Users },
    { path: '/savings', label: 'Savings Goals', icon: Target },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen bg-surface text-text overflow-hidden">
        <nav className="w-56 bg-sidebar flex flex-col p-6 border-r border-border">
          <div className="mb-8">
            <span className="text-3xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
              <span className="text-primary">Fam</span>
              <span className="text-gray-500">Budget</span>
            </span>
          </div>

          <div className="flex-1 space-y-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary text-white' : ''}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="mt-auto">
            <div className="border-t border-border pt-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text truncate">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email || 'User'}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                disabled={authLoading}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 disabled:opacity-50 transition-all"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="p-6 flex items-center justify-between border-b border-border">
            <div></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full">
                <Search className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted">Search</span>
              </div>
              <button className="text-text-muted hover:text-text">
                <SettingsIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
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
