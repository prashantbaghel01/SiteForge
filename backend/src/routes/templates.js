const router = require('express').Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { z } = require('zod')
const { nanoid } = require('nanoid')
const db = require('../db/init')
const { requireAuth, optionalAuth } = require('../middleware/auth')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const SYSTEM_PROMPT = `You are an expert website designer. Generate 5 VISUALLY DISTINCT website templates for the given idea.

Each template MUST use a different layout type from this list — use all 5, one each:
1. "split" — Hero with text on LEFT, visual/stats panel on RIGHT side by side
2. "centered" — Minimal centered layout, massive typography, lots of whitespace  
3. "bold" — Full-width dark dramatic hero, huge headline, strong color blocks
4. "magazine" — Editorial grid layout, asymmetric, image-heavy like a magazine
5. "sidebar" — Left sidebar navigation, main content area on right, dashboard-style

Return ONLY a valid JSON array — no markdown, no code fences, no explanation.

Each object must have EXACTLY these keys:
{
  "id": "unique 8-char alphanumeric",
  "title": "2-4 word catchy brand name relevant to the idea",
  "layout": one of exactly: "split" | "centered" | "bold" | "magazine" | "sidebar",
  "styleTag": one of: "Modern" | "Minimal" | "Bold" | "Elegant" | "Playful" | "Corporate",
  "industry": one of: "SaaS" | "Portfolio" | "E-commerce" | "Blog" | "Agency" | "Startup",
  "colors": ["#primaryhex", "#secondaryhex"],
  "font": one of: "sora" | "inter" | "playfair" | "mono" | "clash",
  "nav": {
    "brand": "brand name",
    "links": ["Link1", "Link2", "Link3", "Link4"]
  },
  "hero": {
    "badge": "short badge text",
    "headline": "compelling headline 6-10 words",
    "subheadline": "supporting sentence 15-20 words specific to the idea",
    "primaryCTA": "primary button text",
    "secondaryCTA": "secondary button text",
    "metric1": {"value": "10K+", "label": "relevant metric"},
    "metric2": {"value": "99%", "label": "relevant metric"},
    "metric3": {"value": "4.9★", "label": "relevant metric"}
  },
  "features": [
    {"icon": "emoji", "title": "feature name", "description": "one sentence 10-15 words"},
    {"icon": "emoji", "title": "feature name", "description": "one sentence 10-15 words"},
    {"icon": "emoji", "title": "feature name", "description": "one sentence 10-15 words"},
    {"icon": "emoji", "title": "feature name", "description": "one sentence 10-15 words"}
  ],
  "cta": {
    "headline": "action-oriented headline 5-8 words",
    "subtext": "supporting sentence 10-15 words",
    "button": "button text"
  },
  "footer": { "tagline": "4-6 word tagline" }
}

CRITICAL RULES:
- Each of the 5 templates MUST have a different layout value
- ALL content must be specific to the user's idea — never generic
- Colors must match the styleTag: Bold=vibrant, Minimal=muted, Elegant=gold/cream, Playful=bright, Modern=blue/purple, Corporate=navy/gray
- font "playfair" for Elegant, "mono" for Corporate/SaaS, "clash" for Bold/Playful, "sora" for Modern, "inter" for Minimal`

function extractJSON(text) {
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const start = clean.indexOf('[')
  const end = clean.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('No JSON array found')
  return JSON.parse(clean.slice(start, end + 1))
}

// POST /api/templates/generate
router.post('/generate', optionalAuth, async (req, res) => {
  const schema = z.object({ prompt: z.string().min(3).max(500) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Prompt must be 3-500 characters' })

  const { prompt } = parsed.data

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser's website idea: "${prompt}"\n\nGenerate 5 templates, each with a different layout type (split, centered, bold, magazine, sidebar).`
    const result = await model.generateContent(fullPrompt)
    const raw = result.response.text()
    console.log('[generate] raw preview:', raw.slice(0, 300))

    const templates = extractJSON(raw)
    const layouts = ['split', 'centered', 'bold', 'magazine', 'sidebar']

    const stamped = templates.map((t, i) => ({
      ...t,
      id: t.id || nanoid(8),
      colors: t.colors || ['#7c3aed', '#4f46e5'],
      layout: t.layout || layouts[i % layouts.length],
    }))

    res.json({ templates: stamped, prompt })
  } catch (err) {
    console.error('[generate] ERROR:', err.message)
    if (err instanceof SyntaxError) return res.status(502).json({ error: 'AI returned invalid JSON — please retry' })
    res.status(500).json({ error: 'Template generation failed: ' + err.message })
  }
})

// POST /api/templates/save
router.post('/save', requireAuth, (req, res) => {
  const schema = z.object({
    id: z.string(), title: z.string(),
    styleTag: z.string().optional(), industry: z.string().optional(),
    colors: z.array(z.string()).optional(), prompt: z.string().optional(),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message })

  const t = parsed.data
  db.prepare(`INSERT OR REPLACE INTO templates (id, user_id, title, description, style_tag, industry, colors, prompt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(t.id, req.user.id, t.title, '', t.styleTag || '', t.industry || '', JSON.stringify(t.colors || []), t.prompt || '')
  res.json({ saved: true, id: t.id })
})

// GET /api/templates
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM templates WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json({ templates: rows.map(r => ({ ...r, colors: JSON.parse(r.colors || '[]'), styleTag: r.style_tag })) })
})

// DELETE /api/templates/:id
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM templates WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Template not found' })
  res.json({ deleted: true })
})

module.exports = router
