import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginThunk, clearError } from '@/features/auth/authSlice'
import { cn } from '@/shared/lib/utils'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    dispatch(loginThunk({ username: username.trim(), password }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-siemens-dark relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,160,160,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,160,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-siemens-teal opacity-[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-siemens-green opacity-[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-siemens-teal to-siemens-green flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">SE</span>
            </div>
            <span className="font-display text-lg font-semibold text-white tracking-wide">
              Siemens Energy
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-siemens-muted text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-siemens-muted uppercase tracking-widest mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className={cn(
                  'w-full bg-siemens-dark border rounded-lg px-4 py-3 text-white placeholder-siemens-muted text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-siemens-teal/50 focus:border-siemens-teal',
                  'transition-all duration-200',
                  error ? 'border-red-500/50' : 'border-siemens-border'
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-siemens-muted uppercase tracking-widest mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={cn(
                  'w-full bg-siemens-dark border rounded-lg px-4 py-3 text-white placeholder-siemens-muted text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-siemens-teal/50 focus:border-siemens-teal',
                  'transition-all duration-200',
                  error ? 'border-red-500/50' : 'border-siemens-border'
                )}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 animate-fade-in"
              >
                <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 rounded-lg font-medium text-sm transition-all duration-200',
                'bg-gradient-to-r from-siemens-teal to-siemens-green text-siemens-dark',
                'hover:opacity-90 hover:shadow-lg hover:shadow-siemens-teal/20',
                'focus:outline-none focus:ring-2 focus:ring-siemens-teal/50 focus:ring-offset-2 focus:ring-offset-siemens-dark',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-siemens-muted text-xs mt-6">
          © {new Date().getFullYear()} Siemens Energy. All rights reserved.
        </p>
      </div>
    </div>
  )
}
