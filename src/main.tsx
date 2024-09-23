import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import SignIn from './TelaDeLogin/src/SignIn'; // Ajuste se necessário
import './index.css'
import { StyledEngineProvider } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <SignIn />
    </StyledEngineProvider>
  </StrictMode>,
)
