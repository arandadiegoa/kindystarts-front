import { useCallback, useEffect, useState } from "react"

export interface Activity {
  id: string
  title: string
  description: string
  date: string
  photos: string[]
}
export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  //Obtener todas las actividades
  const fecthActivities = useCallback(async () => {
    setIsloading(true)
    try {
      const res = await fetch('http://localhost:3000/api/activities')
      if(!res.ok) throw new Error('Error al cargar las actividades')
        const data = await res.json()
      setActivities(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      setError(error.message)
    }finally {
      setIsloading(false)
    }
  }, [])

  //Borrar actividad
  const deleteActivity = async (id: string) => {
    if(!confirm("¿Seguro que desea eliminar la actividad?")) return

    try {
      await fetch(`http://localhost:3000/api/activities/${id}`, { method: 'DELETE' })
      setActivities(prev => prev.filter(act => act.id !== id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log("Error:", error)
      alert("Error al eliminar")
    }
  }

  //Actualizar actividad
  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      await fetch(`http://localhost:3000/api/activities/${id}`, {
        method: 'PATH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      //Actualizacion Optimista
      //actualiza la lista localmente al instante.
      setActivities(prev => prev.map(act =>
         act.id === id ? {...act, ...updates} : act //fusiona dos objetos act + updates
        ))

      return true
    } catch (error) {
      console.log('Error', error)
      alert('Error al actualizar')
      return false
    }
  }

  useEffect(() => {
    fecthActivities()
  }, [fecthActivities])

  return {
    activities,
    isLoading,
    error,
    refetch: fecthActivities,
    deleteActivity,
    updateActivity
  }
}