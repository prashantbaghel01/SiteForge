const router = require('express').Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Robustly extract JSON from Gemini response
function extractJSON(text) {
  // Strip markdown code fences
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  // Find first [ or { and last ] or }
  const firstArr = clean.indexOf('[')
  const firstObj = clean.indexOf('{')
  if (firstArr === -1 && firstObj === -1) throw new Error('No JSON found in response')
  const isArray = firstArr !== -1 && (firstObj === -1 || firstArr < firstObj)
  const start = isArray ? firstArr : firstObj
  const end = isArray ? clean.lastIndexOf(']') : clean.lastIndexOf('}')
  if (end === -1) throw new Error('Malformed JSON in response')
  return JSON.parse(clean.slice(start, end + 1))
}

async function ask(prompt) {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

// POST /api/ai/improve
router.post('/improve', async (req, res) => {
  const { section, data, context } = req.body
  if (!section || !data) return res.status(400).json({ error: 'Missing section or data' })

  try {
    let prompt = ''

    if (section === 'hero') {
      prompt = `You are a professional copywriter. Rewrite this hero section with more compelling copy.
Context: ${context || 'general website'}
Current hero:
Badge: ${data.badge}
Headline: ${data.headline}
Subheadline: ${data.subheadline}
Primary CTA: ${data.primaryCTA}
Secondary CTA: ${data.secondaryCTA}

Respond with ONLY this JSON object and nothing else:
{"badge":"improved badge text","headline":"improved headline","subheadline":"improved subheadline","primaryCTA":"button text","secondaryCTA":"button text"}`
    }

    else if (section === 'features') {
      const list = Array.isArray(data) ? data : []
      prompt = `You are a professional copywriter. Rewrite these website features with better copy.
Context: ${context || 'general website'}
Current features:
${list.map((f, i) => `${i + 1}. Icon:${f.icon} Title:${f.title} Desc:${f.description}`).join('\n')}

Respond with ONLY this JSON array and nothing else:
[{"icon":"emoji","title":"title","description":"description"},{"icon":"emoji","title":"title","description":"description"},{"icon":"emoji","title":"title","description":"description"}]`
    }

    else if (section === 'cta') {
      prompt = `You are a professional copywriter. Rewrite this CTA section to be more persuasive.
Context: ${context || 'general website'}
Current CTA:
Headline: ${data.headline}
Subtext: ${data.subtext}
Button: ${data.button}

Respond with ONLY this JSON object and nothing else:
{"headline":"improved headline","subtext":"improved subtext","button":"button text"}`
    }

    else if (section === 'nav') {
      prompt = `Suggest 4 navigation link names for this website.
Context: ${context || 'general website'}
Current links: ${JSON.stringify(data.links)}

Respond with ONLY this JSON array and nothing else:
["Link1","Link2","Link3","Link4"]`
    }

    else {
      return res.status(400).json({ error: 'Unknown section: ' + section })
    }

    const raw = await ask(prompt)
    console.log(`[ai/improve:${section}] raw:`, raw.slice(0, 200))

    const improved = extractJSON(raw)
    res.json({ improved })

  } catch (err) {
    console.error('[ai/improve] ERROR:', err.message)
    res.status(500).json({ error: 'AI improve failed: ' + err.message })
  }
})

// POST /api/ai/section
router.post('/section', async (req, res) => {
  const { prompt: userPrompt, context } = req.body
  if (!userPrompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const prompt = `You are a website section generator. Create a website section for: "${userPrompt}"
Context: ${context || 'general website'}

Respond with ONLY this JSON object and nothing else:
{"type":"pricing","title":"Section Title","subtitle":"Optional subtitle","items":[{"icon":"emoji","title":"Item title","description":"Item description","extra":"optional price or label"},{"icon":"emoji","title":"Item title","description":"Item description","extra":"optional"},{"icon":"emoji","title":"Item title","description":"Item description","extra":"optional"}]}`

    const raw = await ask(prompt)
    console.log('[ai/section] raw:', raw.slice(0, 200))

    const section = extractJSON(raw)
    res.json({ section })

  } catch (err) {
    console.error('[ai/section] ERROR:', err.message)
    res.status(500).json({ error: 'Section generation failed: ' + err.message })
  }
})

module.exports = router
