import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { holdReveal, shouldPlayIntro } from './features/intro/introGate'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root no encontrado')

// Fuera de React (StrictMode duplica inicializadores): se decide una vez.
const releaseReveal = shouldPlayIntro() ? holdReveal() : undefined

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App {...(releaseReveal && { onIntroLift: releaseReveal })} />
    </AppProviders>
  </StrictMode>,
)
