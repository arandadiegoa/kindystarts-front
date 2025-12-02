import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hook/useContactForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

//Schema
const formSchema = z.object({
  name: z.string()
    .min(6, {message: "Debe tener al menos 4 caracteres"
  }),
  email: z.email({
    message: "Por favor, ingresa un email válido",
  }),
   phone: z
     .string()
     .min(10, { message: "Debe tener al menos 10 caracteres" })
     .regex(/^[0-9]+$/, { message: "El teléfono solo debe contener números"
    }),
    message: z.string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres"})
    .max(500, { message: "Tu mensaje no puede superar los 500 caracteres"})
});

export function Contact(){

  const { sendMessage, isSending } = useContactForm()
  const [success, setSuccess] = useState(false)

    //Validacion con Zod
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
    });
  
    type ContactFormValues = z.infer<typeof formSchema>;
  
    const onSubmit = async (values: ContactFormValues) => {
      const sent = await sendMessage(values)
      if(sent){
        setSuccess(true)
        form.reset()
        setTimeout(() => setSuccess(false), 5000)
      }
    }
  return (
     <div className="flex items-center justify-center min-h-screen mt-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Contacto</CardTitle>
          <CardDescription className="text-center">
            Ingresá tu consulta y te responderamos a la brevedad.
          </CardDescription>
        </CardHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-green-600 animate-in fade-in">
              <CheckCircle className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold">¡Mensaje Enviado!</h3>
              <p className="text-muted-foreground mt-2">Gracias por escribirnos.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSuccess(false)}>
              Enviar otro mensaje
              </Button>
          </div>
        ): (
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="juan perez"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="351 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name= "message"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                      placeholder="Escribí tu consulta aquí..."
                      className="resize-none"
                      rows={5}
                      {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
             />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSending}>
                Enviar Mensaje
              </Button>
            </CardFooter>
          </form>
        </Form>
        )}
      </Card>
    </div>
  )
}