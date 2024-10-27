import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'
interface User {
  email: string
  tipoUsuario: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
}

const apiurl = import.meta.env.VITE_APP_API_URL

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getTokenFromCookies = () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
      return match ? match[2] : null
    }
    
    const token = getTokenFromCookies()
    if (token) {
      try {
        const decoded = jwtDecode(token) as { id: number, email: string, tipoUsuario: string }
        setUser({ email: decoded.email, tipoUsuario: decoded.tipoUsuario })
      } catch (error) {
        console.error("Erro ao decodificar token:", error)
        setUser(null)
      }
    }
    setLoading(false) // Definindo como falso quando terminar
  }, [])
  
  // Método de login
  const login = useCallback((userData: User) => {
    setUser(userData) // Armazena os dados do usuário
  }, [])

  // Método de logout
  const logout = useCallback(async () => {
    try {
      // Chama a rota de logout no servidor
      await axios.post(`${apiurl}/logout`, {}, { withCredentials: true })
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
