import type { News } from "@/hook/useNews"
import { useState } from "react"
import { Dialog, DialogHeader } from "../ui/dialog"
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "../ui/label"

interface NewsCreateModalProps {
 isOpen: boolean
 onClose: () => void
 onCreate: (news: Omit<News, "id">) => Promise<boolean>
}

export function NewsCreateModal({ isOpen, onClose, onCreate}: NewsCreateModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  //Initial state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString()
  })

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return

    setIsSaving(true)

    try {
          setUploadProgress("Guardando novedad")

    //Save news
    const success = await onCreate({
      ...formData
    })

    if (success) {
      //Clean form
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString()
      })
      onClose()
    }
  
    } catch (error) {
      console.log("Error en el proceso de creación", error)
      alert("Hubo un error al crear la actividad")
    } finally {
      setIsSaving(false)
    }
}

return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90] lex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Nueva Actividad</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input 
            id="create-title"
            placeholder="Ej: Hoy nos divertimos..."
            value={formData.title}
            onChange={(e) => 
              setFormData({...formData, title: e.target.value})
            }
            />
          </div>

          <div>
            
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}