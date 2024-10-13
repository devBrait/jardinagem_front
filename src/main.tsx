import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'toastr/build/toastr.css'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material'
import SignIn from './components/login/SignIn.tsx'
import SignUp from './components/login/SignUp.tsx'
import Cliente from './components/dashboard/Cliente.tsx'
import Fornecedor from './components/dashboard/Fornecedor.tsx'
import { AuthProvider } from './AuthContext.tsx'
import Erro from './components/error/Erro.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/dashboard-cliente" element={<Cliente />} />
            <Route path="/dashboard-fornecedor" element={<Fornecedor />} />
            <Route path="*" element={<Erro />} /> {/* Captura todas as rotas não reconhecidas */}
          </Routes>
        </Router>
      </StyledEngineProvider>
    </StrictMode>
  </AuthProvider>
)
