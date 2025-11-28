import type { Activity } from "@/hook/useActivities";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";

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

  //Estado inicial
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString(), //fecha de hoy por default
    photos: [] as string[],
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;

    setIsSaving(true);
    const success = await onCreate(formData);
    setIsSaving(false);

    if (success) {
      //Limpiar el formulario
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString(),
        photos: [] as string[],
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Actividad</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.title}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Crear Actividad
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
