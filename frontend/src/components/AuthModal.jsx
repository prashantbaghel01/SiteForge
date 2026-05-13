import { useState } from 'react'
import { signup, login } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ onClose }) {
  const { loginUser } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let res
      if (mode === 'signup') {
        res = await signup(name, email, password)
      } else {
        res = await login(email, password)
      }
      loginUser(res.data.user, res.data.token)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'none',
            border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
        >✕</button>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
          {mode === 'login' ? 'Sign in to your SiteForge account' : 'Start building amazing websites'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13,
            marginBottom: 18,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <input
              className="sfinput"
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name"
              required
              style={{ padding: '12px 14px', borderRadius: 11 }}
            />
          )}
          <input
            className="sfinput"
            type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            style={{ padding: '12px 14px', borderRadius: 11 }}
          />
          <input
            className="sfinput"
            type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            required
            minLength={mode === 'signup' ? 8 : 1}
            style={{ padding: '12px 14px', borderRadius: 11 }}
          />
          <button
            className="btn-p"
            type="submit"
            disabled={loading}
            style={{
              padding: '13px', borderRadius: 11, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite',
                }}/>
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
            style={{
              background: 'none', border: 'none', color: '#a78bfa',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
