import { createContext} from "react"

export interface AuthUser {
  name: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

