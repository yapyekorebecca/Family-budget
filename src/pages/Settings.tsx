import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useExpenses } from '../context/ExpenseContext'
import Button from '../components/ui/Button'
import { Trash2, Moon, Sun, Download, AlertTriangle, Info, Shield, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SettingRowProps {
  title: string
  description: string
  children: React.ReactNode
  danger?: boolean
}

function SettingRow({ title, description, children, danger }: SettingRowProps) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-xl border transition-colors ${
      danger
        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
        : 'bg-surface-alt dark:bg-dark-surface-alt border-border dark:border-dark-border hover:border-text-muted/30 dark:hover:border-dark-text-muted/30'
    }`}>
      <div>
        <p className={`font-semibold ${danger ? 'text-red-700 dark:text-red-400' : 'text-text dark:text-dark-text'}`}>
          {title}
        </p>
        <p className="text-sm text-text-muted dark:text-dark-text-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { expenses } = useExpenses()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExportData = () => {
    const dataStr = JSON.stringify(expenses, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fambudget-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    localStorage.removeItem('expenses')
    window.location.reload()
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-800/50">
            <Shield className="w-3 h-3" />
            Preferences
          </span>
        </div>
        <h1 className="text-4xl font-black text-text dark:text-dark-text tracking-tight">Settings</h1>
        <p className="text-text-muted dark:text-dark-text-muted mt-1">Manage your app preferences and data</p>
      </motion.div>

      {/* Appearance */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border dark:border-dark-border">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-black text-text dark:text-dark-text">Appearance</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Customize how the app looks</p>
            </div>
          </div>

          <div className="p-5">
            <SettingRow
              title="Theme"
              description={isDark ? 'Dark mode is currently active' : 'Light mode is currently active'}
            >
              <button
                onClick={toggleTheme}
                className={`relative w-28 h-12 rounded-xl flex items-center gap-2 px-3 font-semibold text-sm transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                }`}
              >
                <motion.div
                  animate={{ rotate: isDark ? 0 : 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.div>
                {isDark ? 'Dark' : 'Light'}
              </button>
            </SettingRow>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border dark:border-dark-border">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="font-black text-text dark:text-dark-text">Data Management</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Import, export, and manage your data</p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <SettingRow
              title="Export Data"
              description={`Download your ${expenses.length} expense${expenses.length !== 1 ? 's' : ''} as JSON`}
            >
              <button
                onClick={handleExportData}
                disabled={expenses.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </SettingRow>

            <SettingRow
              title="Clear All Data"
              description="Permanently delete all expenses — this cannot be undone"
              danger
            >
              <button
                onClick={() => setShowConfirm(true)}
                disabled={expenses.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md shadow-red-500/20 hover:shadow-red-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </SettingRow>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border dark:border-dark-border">
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="font-black text-text dark:text-dark-text">About</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Application information</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Application', value: 'FamBudget' },
              { label: 'Version', value: 'v1.0.0' },
              { label: 'Description', value: 'Family Budget Manager' },
              { label: 'Storage', value: 'Local Storage' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-surface-alt dark:bg-dark-surface-alt">
                <p className="text-xs text-text-muted dark:text-dark-text-muted uppercase tracking-wider font-medium mb-1">{item.label}</p>
                <p className="font-bold text-text dark:text-dark-text">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-surface dark:bg-dark-surface rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border dark:border-dark-border pointer-events-auto relative overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', bounce: 0.25 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500" />

                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 mx-auto mb-5">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>

                <h3 className="text-xl font-black text-center text-text dark:text-dark-text mb-2">Delete All Data?</h3>
                <p className="text-center text-text-muted dark:text-dark-text-muted text-sm mb-7">
                  This will permanently delete all <strong className="text-text dark:text-dark-text">{expenses.length}</strong> expense entries.
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </Button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow"
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
