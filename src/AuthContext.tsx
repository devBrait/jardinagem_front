import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface User {
  email: string
  senha: string
  tipoUsuario: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Método de login
  const login = useCallback((userData: User) => {
    setUser(userData) 
  }, [])

  // Método de logout
  const logout = useCallback(() => {
    setUser(null)
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
