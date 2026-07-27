import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, ChevronLeft, ChevronRight, Mail, Lock, User, Users, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TOTAL_STEPS = 3

export default function SignupPage() {
  const { register, authLoading, isAuthenticated, errors, clearErrors } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    familyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    familyMembers: '',
    agree: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordStrength = () => {
    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[a-z]/.test(formData.password)) strength++
    if (/[A-Z]/.test(formData.password)) strength++
    if (/[0-9]/.test(formData.password)) strength++
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength++
    return strength
  }
  const strength = getPasswordStrength()
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-primary']

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (errors.length) {
      const t = setTimeout(clearErrors, 400)
      return () => clearTimeout(t)
    }
  }, [formData, errors, clearErrors])

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (step !== TOTAL_STEPS) return
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.agree) return

    const nameParts = formData.fullName.trim().split(' ')
    const first_name = nameParts[0] || ''
    const last_name = nameParts.slice(1).join(' ') || ''

    const success = await register({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name,
      last_name,
    })

    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-6xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
                <span className="text-primary">Fam</span>
                <span className="text-gray-500">Budget</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Tell us about your family"}
              {step === 3 && "Secure your account"}
            </h1>
            <p className="text-gray-600 text-sm">
              {step === 1 && "Let's start with your name and email"}
              {step === 2 && "Help us personalize FamBudget for your family"}
              {step === 3 && "Create a secure password to protect your account"}
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step > num ? 'bg-primary text-white' : step === num ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 text-gray-400'}`}>
                  {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                </div>
                <span className={`text-xs font-medium ${step >= num ? 'text-primary' : 'text-gray-400'}`}>
                  {num === 1 ? 'Personal' : num === 2 ? 'Family' : 'Security'}
                </span>
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="mb-6 space-y-2">
              {errors.map((msg, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Jane Doe"
                      autoFocus
                      disabled={authLoading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="jane@example.com"
                      disabled={authLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="familyName"
                      type="text"
                      value={formData.familyName}
                      onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="The Johnson Family"
                      autoFocus
                      disabled={authLoading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="familyMembers" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of family members <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="familyMembers"
                    type="number"
                    value={formData.familyMembers}
                    onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="4"
                    disabled={authLoading}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                      autoFocus
                      disabled={authLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={authLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColor[strength - 1] : 'bg-gray-100'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-gray-500">{strengthText[strength - 1] || ''}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                      disabled={authLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={authLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    disabled={authLoading}
                  />
                  <label htmlFor="agree" className="text-sm text-gray-600">
                    I agree to FamBudget's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={authLoading}
                >
                  Back
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={authLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={authLoading || !formData.agree}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Free Account</span>
                  )}
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-3 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" disabled={authLoading}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" disabled={authLoading}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Continue with Apple</span>
                </button>
              </div>
            </>
          )}

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
