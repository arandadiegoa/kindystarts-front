import type { UserData } from "@/hook/useUsers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  userToEdit: UserData | null //if null ? Create : Edit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => Promise<boolean>
}

const userSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password:z.string().optional(),
  role: z.enum(["admin", "teaching", "family"]),
  parentName: z.string().optional(),
  hall: z.string().optional,
  phone: z.string().optional()
})

export function UserFormModal({ isOpen, onClose, userToEdit, onSave }: UserFormModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!userToEdit //convert strict boolean value
  
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "family", parentName: "", hall: "", phone: ""}
  })

  //isEditing
  useEffect(()=> {
    if(userToEdit) {
      form.reset({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        hall: userToEdit.hall,
        parentName: userToEdit.parentName || "",
        phone: userToEdit.phone || "",
        password: ""
      })
    }else {
      form.reset({
        name: "", email: "", password: "", role: "family", parentName: "", hall: "", phone: ""
      })
    }
  }, [userToEdit, isOpen, form])

  const selectedRole = form.watch("role")

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    //Validate password for creation
    if(!isEditing && (!values.password || values.password.length < 6)) {
      form.setError("password", { message: "Contraseña requerida (min 6 caracteres)" })
      return
    }
    setIsSaving(true)
    
    //Clean empty fields
    const dataToSend = { ...values } //copy values
    if (dataToSend.role !== 'family') delete dataToSend.parentName 
    if (isEditing) delete dataToSend.password //Not send password for edit

    const success = await onSave(dataToSend)
    setIsSaving(false)

    if(success) onClose()
  }

  return (
    <div></div>
  )

}