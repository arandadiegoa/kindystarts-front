import type { Activity } from "@/hook/useActivities";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2, Save, X } from "lucide-react";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface ActivityEditModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Activity>) => Promise<boolean>;
}

export function ActivityEditModal({
  activity,
  isOpen,
  onClose,
  onSave,
}: ActivityEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  //Estado del formulario
  const [formData, setFormData] = useState<Partial<Activity>>({});

  //Url fotos existentes
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  //Actualizar el formulario cada vez que cambia
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
      });
      setExistingPhotos(Array.isArray(activity.photos) ?activity.photos : []); //validar que sea un array
      //Resetear lo nuevo
      setNewFiles([]);
      setNewPreviews([]);
    } 
  }, [activity]);

  //Archivos nuevos
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);

      //Validar todas las fotos, nuevas, viejas
      const totalCount =
        existingPhotos.length + newFiles.length + selected.length;

      if (totalCount > 4) {
        alert(
          `Límite exedido. Tienes ${existingPhotos.length} guardadas y ${newFiles.length} nuevas.`
        );
        e.target.value = "";
        return;
      }

      //Guardar los archivos reales
      setNewFiles((prev) => [...prev, ...selected]);

      //Generar Previews
      const urls = selected.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...urls]);

    }
  };

  //Borrar fotos ya subidas
  const removeExistingPhotos = (urlToRemove: string) => {
    setExistingPhotos((prev) => prev.filter((url) => url !== urlToRemove));
  };

  //Borrar foto nueva
  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  //Subida a Firebase
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `activities/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  //Guardar cambios

  const handleSaveClick = async () => {
    if (!activity) return;

    setIsSaving(true);
    setUploadProgress("Procesando imagenes");

    try {
      let newPhotoUrls: string[] = [];

      if (newFiles.length > 0) {
        setUploadProgress(`Subiendo ${newFiles.length} fotos nuevas`);
        newPhotoUrls = await Promise.all(
          newFiles.map((file) => uploadImageToStorage(file))
        )
        console.log("URLS generadas", newPhotoUrls)
      }

      //Combinar las fotos anteriores + nuevas
      const finalPhotos = [...existingPhotos, ...newPhotoUrls];

      setUploadProgress("Actualizando base de datos");

      //Ejecutar la funcion
      const success = await onSave(activity.id, {
        ...formData,
        photos: finalPhotos,
      });
      setIsSaving(false);

      if (success) {
        setExistingPhotos([])
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
      setUploadProgress("");
    }
  };

  //Calcular el final de fotos
  const currentTotalPhotos = existingPhotos.length + newFiles.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Editar Actividad</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la actividad y gestiona las fotografías.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/*SECCION FOTOS*/}
          <div className="grid gap-2">
            <Label
              className={currentTotalPhotos >= 4 ? "text-destructive" : ""}
            >
              Fotografías ({currentTotalPhotos} /4)
            </Label>

            {currentTotalPhotos < 4 && (
              <div className="flex items-center justify-center w-full mb-2">
                <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-semibold">
                      Agregar más fotos
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}

            {/*Grilla Mixta */}
            <div className="grid grid-cols-3 gap-2">
              {existingPhotos.map((url, i) => (
                <div
                  key={`old-${i}`}
                  className="relative rounded-md overflow-hidden aspect-square border group"
                >
                  <img
                    src={url}
                    alt="Guardada"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-1 w-full text-center">
                    Guardada
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 opacity-80 hover:opacity-100"
                    onClick={() => removeExistingPhotos(url)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {newPreviews.map((url, i) => (
                <div
                  key={`new${i}`}
                  className="relative rounded-md overflow-hidden aspect-square border border-blue-400 group"
                >
                  <img
                    src={url}
                    alt="Nueva"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 bg-blue-600/80 text-white text-[10px] px-1 w-full text-center">
                    Nueva
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 opacity-80 hover:opacity-100"
                    onClick={() => removeNewFile(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadProgress || "Guardando..."}
              </>
            ) : (
              <>
              <Save className="mr-2 h-4 w-4" />
              Guardar
              </>
            )}
            
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
