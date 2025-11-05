import { useState, type ReactNode } from "react"
import { AuthContext, type AuthUser } from "./AuthContext"

export function AuthProvider({ children }:{ children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = (useData:AuthUser) => {
    setUser(useData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}