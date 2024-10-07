import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'toastr/build/toastr.css';
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material'
import SignIn from './components/login/SignIn.tsx';
import Cliente from './components/dashboard/Cliente.tsx';
import Fornecedor from './components/dashboard/Fornecedor.tsx';
import SignUp from './components/login/SignUp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
    <Router>
      <Routes>
        {/* Define o caminho da página inicial */}
        <Route path="/" element={<App />} />

        {/* Configura o caminho para a página de login */}
        <Route path="/login" element={<SignIn />} />

        {/* Configura o caminho para a página de login */}
        <Route path="/cadastro" element={<SignUp />} />
        

        <Route path='/dashboard-cliente' element={<Cliente/>}/>
        <Route path='/dashboard-fornecedor' element={<Fornecedor/>}/>
      </Routes>
    </Router>
    </StyledEngineProvider>
  </StrictMode>,
)
