import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

  const MAX_SIZE_FILE = 5 * 1024 * 1024 //5 MB
  const ACCEPTED_TYPE_FILE = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ]

  //Schema zod
  const formSchema = z.object({
    documentType: z.string().min(1, {
      message: "Debes seleccionar un tipo de documento"
    }),
    file: z
    .instanceof(FileList, { message: "Debes adjuntar un archivo."})
    .refine((files) => files?.length > 0, "Debes adjuntar un archivo.")
    .refine(
      (files) => files?.[0]?.size <= MAX_SIZE_FILE,
      `El archivo no puede superar mas de 5MB`
    )
    .refine(
      (files) => ACCEPTED_TYPE_FILE.includes(files?.[0]?.type),
      "Tipo de archivo no valido (sólo PDF, JPG o PNG)."
    )
  })

  type FormValues = z.infer<typeof formSchema>

export function FamilyDocs() {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      documentType: "",
      file: undefined
    }
  })

  const onSubmit = (values: FormValues) => {
    const file = values.file[0]
    console.log("Tipo de documento: ", values.documentType)
    console.log("Archivo adjuntado: " + file)

    alert("Documento listo para Subir!")
    form.reset()
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Subida de Documentación</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dni">DNI (Frente y Dorso)</SelectItem>
                    <SelectItem value="vacunas">Carnét de Vacunación</SelectItem>
                    <SelectItem value="partida">Partida de Nacimiento</SelectItem>
                    <SelectItem value="certificado">Certificado Médico</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              )}
            />

            <FormField 
            control={form.control}
            name="file"
            render={({field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <FormLabel>Adjuntar Archivo</FormLabel>
                <FormControl>
                  <Input
                  type="file"
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  onChange={(e) =>onChange(e.target.files)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  />
                </FormControl>
              </FormItem>
            )}
            
            />
            <Button type="submit" className="w-full">Subir documento</Button>
          </form>
        </Form>
      </CardContent>
      </Card>  
    </div>
  )
}