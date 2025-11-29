import type { Activity } from "@/hook/useActivities";
import { useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

interface ActivityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (activity: Omit<Activity, "id">) => Promise<boolean>;
}

export function ActivityCreateModal({
  isOpen,
  onClose,
  onCreate,
}: ActivityCreateModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  //Estado inicial
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString(), //fecha de hoy por default
    photos: [] as string[],
  });

  //Estado local para manejar el archivo
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  //Manejo de archivo local
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      //Validación max 4 fotos
      const totalPhotos = selectedFiles.length + newFiles.length
      if(totalPhotos > 4) {
        alert('Sólo puedes subir un maximo de 4 fotos por actividad')
        e.target.value = ""
        return
      }

      setSelectedFiles((prev) => [...prev, ...newFiles])

      const newPrevius = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPrevius])
    }
  };

  //Quitar foto de la lista
  const handleRemovePhoto = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  //Subida a Firebase Storage
  const uploadImageStorage = async (file: File): Promise<string> => {

    //Referencia
    const storageRef = ref(storage, `activities/${Date.now()}-${file.name}`);

    //Subimos el archivo
    const snapshot = await uploadBytes(storageRef, file);

    //Obtenemos la URL pública
    const dowloadURL = await getDownloadURL(snapshot.ref);

    return dowloadURL;
  };

  //Guardar la foto
  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;

    setIsSaving(true);
    setUploadProgress("Subiendo imagen...");

    try {
      const uploadedUrl = await Promise.all(
        selectedFiles.map((file) => uploadImageStorage(file))
      )
    

      setUploadProgress("Guardando actividad...");

      //Guardar la actividad en la BD
      const success = await onCreate({
        ...formData,
        photos: uploadedUrl, // Pasamos el array de URLs de Firebase
      });

      if (success) {
        //Limpiar el formulario
        setFormData({
          title: "",
          description: "",
          date: new Date().toISOString(),
          photos: [],
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        onClose();
      }
    } catch (error) {
      console.log("Error en el proceso de creación", error);
      alert("Hubo un error al crear la actividad");
    } finally {
      setIsSaving(false);
      setUploadProgress("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] lex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Nueva Actividad</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="create-title"
              placeholder="Ej: clase de musica"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Descripción</Label>
            <Textarea
              id="create-dec"
              placeholder="Detalles de la activiadad"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/*Imagen*/}
          <div className="grid gap-2">
            <Label className={selectedFiles.length >=4 ? "text-destructive": ""}>
              Fotografia ({selectedFiles.length}/4)
              </Label>

            {selectedFiles.length < 4 ? (
              <div className="flex items-center justify-center w-full">
                <Label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                <ImageIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Agregar fotos</span>(Clik aquí)
                </p>
                <p className="text-xs text-muted-foreground">JPG, PNG</p>
                </div>
                <Input
                id="dropzone-file" 
                    type="file" 
                    multiple // <--- permite múltiples archivos
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                />
                </Label>
              </div>
            ): (
              <div className="p-3 text-center text-xs text-destructive border border-destructive/30 rounded-lg bg-destructive/5">
                Has alcanzado el límite de 4 fotos.
              </div>
            )}

           {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden aspect-square border group">
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    {/* Botón para eliminar foto individual */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100 transition-opacity"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.title}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress || "Guardando..."}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Crear Actividad
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
