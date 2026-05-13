import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sf_token')
      localStorage.removeItem('sf_user')
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// ── Templates ─────────────────────────────────────────
export const generateTemplates = (prompt) =>
  api.post('/templates/generate', { prompt })

export const getTemplates = () =>
  api.get('/templates')

export const saveTemplate = (template) =>
  api.post('/templates/save', template)

// ── Sites ─────────────────────────────────────────────
export const publishSite = (templateId, siteData, siteName) =>
  api.post('/sites/publish', { templateId, siteData, siteName })

export const getMySites = () =>
  api.get('/sites/mine')

export const getSiteBySlug = (slug) =>
  api.get(`/sites/${slug}`)

export default api
