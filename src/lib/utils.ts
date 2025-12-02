import { auth } from "@/firebase";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string | undefined) => {
  if(!dateString) return "-";

  try {
    const date = new Date(dateString)
    if(isNaN(date.getTime())) return dateString

    return new Intl.DateTimeFormat('es-Ar', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    console.log('Error', error)
    return dateString
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