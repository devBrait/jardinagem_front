import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

// Defina a interface para os dados do usuário
interface User {
  email: string
}

// Defina a interface para o contexto
interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

// Crie o contexto fora do componente para evitar recriação em cada render
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provedor de contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Memorizando as funções para evitar redefinição em cada render
  const login = useCallback((userData: User) => {
    setUser(userData) // Salve os dados do usuário
  }, [])

  const logout = useCallback(() => {
    setUser(null) // Limpa os dados do usuário
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
