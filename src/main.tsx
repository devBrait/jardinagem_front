import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material'
import SignIn from './components/login/SignIn.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
    <Router>
      <Routes>
        {/* Define o caminho da página inicial */}
        <Route path="/" element={<App />} />

        {/* Configura o caminho para a página de login */}
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </Router>
    </StyledEngineProvider>
  </StrictMode>,
)
