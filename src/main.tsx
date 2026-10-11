import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/league-spartan'
import '@fontsource-variable/dm-sans'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
