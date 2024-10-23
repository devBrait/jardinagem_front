import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
interface User {
  email: string
  tipoUsuario: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const apiurl = import.meta.env.VITE_APP_API_URL

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Verificar o cookie ao iniciar
  useEffect(() => {
    const token = document.cookie.split(' ').find(row => row.startsWith('token='))
    if (token) {
      const decoded = jwtDecode(token.split('=')[1]) as { email: string, tipoUsuario: string } // Decodifica o token
      setUser({ email: decoded.email, tipoUsuario: decoded.tipoUsuario }) // Ajuste conforme necessário
    }
  }, [])
  // Método de login
  const login = useCallback((userData: User) => {
    setUser(userData) // Armazena os dados do usuário
  }, [])

  // Método de logout
  const logout = useCallback(async () => {
    try {
      // Chama a rota de logout no servidor
      await fetch(`${apiurl}/logout`, {
        method: 'POST',
        credentials: 'include', // Inclui cookies na requisição
      })
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
