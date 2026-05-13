const router = require('express').Router()
const { z } = require('zod')
const { nanoid } = require('nanoid')
const db = require('../db/init')
const { requireAuth, optionalAuth } = require('../middleware/auth')

// ── POST /api/sites/publish ───────────────────────────
router.post('/publish', optionalAuth, (req, res) => {
  const schema = z.object({
    templateId: z.string().optional(),
    siteData: z.record(z.unknown()),
    siteName: z.string().min(1).max(120),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message })

  const { templateId, siteData, siteName } = parsed.data

  // Generate a readable slug: name-slug + random suffix
  const base = siteName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
  const slug = `${base}-${nanoid(6)}`

  const userId = req.user?.id || null

  db.prepare(`
    INSERT INTO sites (slug, user_id, template_id, site_name, site_data)
    VALUES (?, ?, ?, ?, ?)
  `).run(slug, userId, templateId || null, siteName, JSON.stringify(siteData))

  res.status(201).json({
    slug,
    url: `https://siteforge.ai/${slug}`,
    siteName,
  })
})

// ── GET /api/sites/mine ───────────────────────────────
router.get('/mine', requireAuth, (req, res) => {
  const rows = db.prepare(
    'SELECT id, slug, site_name, template_id, created_at, updated_at FROM sites WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id)

  res.json({ sites: rows })
})

// ── GET /api/sites/:slug ──────────────────────────────
router.get('/:slug', optionalAuth, (req, res) => {
  const row = db.prepare(
    'SELECT * FROM sites WHERE slug = ?'
  ).get(req.params.slug)

  if (!row) return res.status(404).json({ error: 'Site not found' })

  res.json({
    ...row,
    site_data: JSON.parse(row.site_data || '{}'),
  })
})

// ── DELETE /api/sites/:slug ───────────────────────────
router.delete('/:slug', requireAuth, (req, res) => {
  const result = db.prepare(
    'DELETE FROM sites WHERE slug = ? AND user_id = ?'
  ).run(req.params.slug, req.user.id)

  if (result.changes === 0) return res.status(404).json({ error: 'Site not found or not yours' })
  res.json({ deleted: true })
})

module.exports = router
