import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/sedgwick-ave-display'
import '@fontsource-variable/archivo/wdth.css'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
