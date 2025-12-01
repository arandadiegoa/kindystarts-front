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