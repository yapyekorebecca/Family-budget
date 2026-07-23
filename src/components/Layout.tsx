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
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
  const location = useLocation()

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
        {/* Sidebar */}
        <nav className="w-56 bg-sidebar flex flex-col p-6 border-r border-border">
          {/* Logo Area */}
          <div className="mb-8">
            {/* FamBudget Logo in Florida Vibes Font */}
            <span className="text-3xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
              <span className="text-primary">Fam</span>
              <span className="text-gray-500">Budget</span>
            </span>
          </div>

          {/* Navigation */}
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

          {/* Footer note */}
          <div className="mt-auto text-xs text-text-muted">
            You've used 6 times this month to manage your money. Great Job!
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="p-6 flex items-center justify-between border-b border-border">
            <div></div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full">
                <Search className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted">Search</span>
              </div>
              {/* Settings */}
              <button className="text-text-muted hover:text-text">
                <SettingsIcon className="w-5 h-5" />
              </button>
              {/* User */}
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-text-muted" />
                <span className="text-sm">John Doe</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
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