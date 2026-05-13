import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Generator from './pages/Generator'
import PreviewPage from './pages/PreviewPage'
import Editor from './pages/Editor'
import AuthModal from './components/AuthModal'

function AppInner() {
  const { user } = useAuth()
  const [screen, setScreen] = useState('landing')
  const [initPrompt, setInitPrompt] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  const goGenerate = (prompt) => {
    setInitPrompt(prompt)
    setScreen('generator')
  }

  const goPreview = (template) => {
    setSelectedTemplate(template)
    setScreen('preview')
  }

  const goEditor = () => setScreen('editor')

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {screen === 'landing' && (
        <Landing onGo={goGenerate} onAuthClick={() => setShowAuth(true)} user={user} />
      )}
      {screen === 'generator' && (
        <Generator
          initialPrompt={initPrompt}
          onPreview={goPreview}
          onBack={() => setScreen('landing')}
          user={user}
          onAuthClick={() => setShowAuth(true)}
        />
      )}
      {screen === 'preview' && (
        <PreviewPage
          template={selectedTemplate}
          onBack={() => setScreen('generator')}
          onUse={goEditor}
        />
      )}
      {screen === 'editor' && (
        <Editor
          template={selectedTemplate}
          onBack={() => setScreen('preview')}
          user={user}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
