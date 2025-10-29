import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function Home(){


  return (
    // Centramos el carrusel en la página para este ejemplo
    <div className="flex h-screen w-full items-center justify-center bg-background p-10">
      
      {/* 2. Este es el contenedor principal del carrusel */}
      {/* - w-full: hace que ocupe todo el ancho de su contenedor padre
        - max-w-sm: limita el ancho máximo a "small" (puedes cambiarlo)
      */}
      <Carousel className="w-full max-w-sm">
        
        {/* 3. Aquí va el contenido (las diapositivas) */}
        <CarouselContent>
          
          {/* 4. Cada diapositiva es un CarouselItem */}
          {/* Usamos Array.from para crear 5 diapositivas de ejemplo */}
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                {/* Usamos un componente Card de shadcn para el estilo */}
                <Card>
                  {/* Damos una altura fija para que se vea bien */}
                  <CardContent className="flex h-[200px] items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}

        </CarouselContent>
        
        {/* 5. (Opcional) Agrega los botones de navegación */}
        <CarouselPrevious />
        <CarouselNext />

      </Carousel>
    </div>
  )
}