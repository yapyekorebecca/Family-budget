import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Moon, Sun, AlertTriangle } from 'lucide-react'
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
        ? 'bg-red-50 border-red-200'
        : 'bg-background border-border hover:border-text-muted/30'
    }`}>
      <div>
        <p className={`font-semibold ${danger ? 'text-red-700' : 'text-text'}`}>
          {title}
        </p>
        <p className="text-sm text-text-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { logout, user } = useAuth()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-text-muted mt-1">Manage your app preferences and data</p>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Appearance</h2>
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
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="space-y-3">
            <SettingRow
              title="Email"
              description={user?.email ?? '—'}
            >
              <span className="text-xs text-text-muted px-3 py-1 bg-background rounded-lg">
                {user?.first_name} {user?.last_name}
              </span>
            </SettingRow>

            <SettingRow
              title="Sign Out"
              description="Log out of your account on this device"
              danger
            >
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md shadow-red-500/20 hover:shadow-red-500/40 transition-all"
              >
                Sign Out
              </button>
            </SettingRow>
          </div>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">About</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Application', value: 'FamBudget' },
              { label: 'Version', value: 'v1.0.0' },
              { label: 'Description', value: 'Family Budget Manager' },
              { label: 'Backend', value: 'Django REST API' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-background">
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">{item.label}</p>
                <p className="font-bold text-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Sign Out Confirmation Modal */}
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
            <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="p-8 max-w-sm w-full relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500 rounded-t-2xl" />
                <div className="pt-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mx-auto mb-5">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-center text-text mb-2">Sign Out?</h3>
                  <p className="text-center text-text-muted text-sm mb-7">
                    You will be logged out of your account. Your data is safely stored on the server.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                      Cancel
                    </Button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}