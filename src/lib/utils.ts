import { auth } from "@/firebase";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateInput = string | number | Date | { seconds: number; nanoseconds?: number } | null | undefined

export const formatDate = (date: DateInput) => {
  if(date === null || date === undefined || date === "") return "-";

  try {
    let dateObj: Date
    
    //Timestamp firebase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if(typeof date === 'object' && 'seconds' in (date as any)) {
      dateObj = new Date((date as {seconds: number}).seconds * 1000)
    }

    //Object Date
    else if(date instanceof Date) {
      dateObj = date
    }
    //String | number
    else {
      dateObj = new Date(date as string | number)
    }

    //Validate
    if(isNaN(dateObj.getTime())) return String(date)

    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj)

  } catch (error) {
    console.log('Error formateando fecha', date, error)
    return String(date)
  }
}

export const getAuthHeaders = async () => {
  const user = auth.currentUser
  
  if(!user) throw new Error('No estas logueado')
  
  const token = await user.getIdToken()

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
    
}