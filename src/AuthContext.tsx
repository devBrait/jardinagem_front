import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface User {
  email: string
  tipoUsuario: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Método de login
  const login = useCallback((userData: User, token: string) => {
    setUser(userData)
    setToken(token);// Armazena o token
    localStorage.setItem('token', token)
  }, [])

  // Método de logout
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)// Limpa o token
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
