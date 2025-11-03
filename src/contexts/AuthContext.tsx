import { createContext} from "react"

interface AuthContextType {
  role: string | null,
  login: (role:string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

