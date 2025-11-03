import { useState, type ReactNode } from "react"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }:{ children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null)

  const login = (useRole:string) => {
    setRole(useRole)
  }

  const logout = () => {
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}