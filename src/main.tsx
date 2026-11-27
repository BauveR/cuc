import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root no encontrado')

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
