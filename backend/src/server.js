require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

// ── Validate required env vars ────────────────────────
const REQUIRED = ['GEMINI_API_KEY', 'JWT_SECRET']
const missing = REQUIRED.filter(k => !process.env[k])
if (missing.length) {
  console.error(`\n❌  Missing env vars: ${missing.join(', ')}`)
  console.error('    Copy .env.example → .env and fill in values.\n')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://siteforge.ai']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))

app.use(express.json({ limit: '1mb' }))

// Global rate limit: 200 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))

// Tighter limit on AI generation endpoint
app.use('/api/templates/generate', rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many generation requests. Please wait a minute.' },
}))

// ── Routes ────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/templates', require('./routes/templates'))
app.use('/api/sites',     require('./routes/sites'))
app.use('/api/ai',        require('./routes/ai'))

// ── Health check ──────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() })
)

// ── 404 handler ───────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }))

// ── Global error handler ──────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[error]', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ── Start ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  SiteForge backend running on http://localhost:${PORT}`)
  console.log(`    Health: http://localhost:${PORT}/api/health\n`)
})
