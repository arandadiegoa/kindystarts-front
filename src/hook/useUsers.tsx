import { useCallback, useEffect, useState } from "react";

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teaching' | 'family'
  sala: 'azul' | 'roja' | 'verde'
}

export function useUsers(){
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsloading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //Datos
  const fetchUsers = useCallback(async () => {
    setIsloading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3000/api/users')

      if(!response.ok){
        throw new Error('No se pudieron cargar los usuarios..')
      }

      const data = await response.json()
      setUsers(data)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
      setError(error.message || 'Error de conexión')
    } finally {
      setIsloading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {users, isLoading, error, fetchUsers}

}