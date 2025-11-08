import { GoBackButton } from "@/components/GoBackButton";
import { familyPhotosCarousel } from "@/data/serviceData";

export function FamilyPhotos() {
  return (
    <div className="flex flex-col gap-6 m-4">
      <GoBackButton />
      <h1 className="text-xl md:text-3xl font-bold">Fotos del día</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {familyPhotosCarousel.map((src, i) => (
          <img
            key={i}
            src={src.imgSrc}
            alt={`Foto de ${src.imgSrc} ${i + 1}`}
            className="cursor-pointer rounded-md w-full aspect-square object-cover 
                  transition-opacity hover:opacity-80"
          />
        ))}
      </div>
    </div>
  );
}
