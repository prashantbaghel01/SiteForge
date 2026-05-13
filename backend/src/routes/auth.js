const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const db = require('../db/init')
const { requireAuth } = require('../middleware/auth')

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// ── POST /api/auth/signup ─────────────────────────────
router.post('/signup', async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message })
  }

  const { name, email, password } = parsed.data

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 12)
  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hashed)

  const user = { id: result.lastInsertRowid, name, email }
  res.status(201).json({ token: signToken(user), user })
})

// ── POST /api/auth/login ──────────────────────────────
router.post('/login', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message })
  }

  const { email, password } = parsed.data
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!row) return res.status(401).json({ error: 'Invalid email or password' })

  const match = await bcrypt.compare(password, row.password)
  if (!match) return res.status(401).json({ error: 'Invalid email or password' })

  const user = { id: row.id, name: row.name, email: row.email }
  res.json({ token: signToken(user), user })
})

// ── GET /api/auth/me ──────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!row) return res.status(404).json({ error: 'User not found' })
  res.json({ user: row })
})

module.exports = router
