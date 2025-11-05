import { CardLinks } from "@/components/CardLinks";
import { linksAdmData } from "@/data/serviceData";
import { useAuth } from "@/hook/useAuth";

export function DashboardAdm(){

  const {user} = useAuth()
  const subtitle = `¡Bienvenida, ${user?.name}! selecciona una tarea para continuar.`

  return (
    <CardLinks 
    title="Panel de Administrador"
    subtitle={subtitle}
    links={linksAdmData}
    />
  )
}