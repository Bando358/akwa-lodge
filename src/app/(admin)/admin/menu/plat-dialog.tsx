"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUpload } from "@/components/admin/image-upload";
import { createPlat, updatePlat } from "@/lib/actions/menu";

const platSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  prix: z.number().positive("Le prix doit être positif"),
  image: z.string().optional(),
  allergenes: z.array(z.string()).default([]),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isActive: z.boolean().default(true),
  ordre: z.number().int().min(0).default(0),
  categorieId: z.string().min(1, "La catégorie est requise"),
});

type PlatFormValues = z.infer<typeof platSchema>;

type Categorie = {
  id: string;
  nom: string;
};

type Plat = {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  image: string | null;
  allergenes: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isActive: boolean;
  ordre: number;
  categorieId: string;
};

interface PlatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plat?: Plat;
  categories: Categorie[];
}

export function PlatDialog({
  open,
  onOpenChange,
  plat,
  categories,
}: PlatDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!plat;

  const form = useForm<PlatFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(platSchema) as any,
    defaultValues: {
      nom: "",
      description: "",
      prix: 0,
      image: "",
      allergenes: [],
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      isActive: true,
      ordre: 0,
      categorieId: categories[0]?.id || "",
    },
  });

  useEffect(() => {
    if (plat) {
      form.reset({
        nom: plat.nom,
        description: plat.description || "",
        prix: plat.prix,
        image: plat.image || "",
        allergenes: plat.allergenes,
        isVegetarian: plat.isVegetarian,
        isVegan: plat.isVegan,
        isSpicy: plat.isSpicy,
        isActive: plat.isActive,
        ordre: plat.ordre,
        categorieId: plat.categorieId,
      });
    } else {
      form.reset({
        nom: "",
        description: "",
        prix: 0,
        image: "",
        allergenes: [],
        isVegetarian: false,
        isVegan: false,
        isSpicy: false,
        isActive: true,
        ordre: 0,
        categorieId: categories[0]?.id || "",
      });
    }
  }, [plat, form, categories]);

  async function onSubmit(data: PlatFormValues) {
    setIsLoading(true);

    try {
      const submitData = {
        ...data,
        description: data.description || null,
        image: data.image || null,
      };

      const result = isEditing
        ? await updatePlat(plat.id, submitData)
        : await createPlat(submitData);

      if (result.success) {
        toast.success(isEditing ? "Plat mis à jour" : "Plat créé");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le plat" : "Nouveau plat"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du plat"
              : "Ajoutez un nouveau plat au menu"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du plat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categorieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du plat..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (FCFA) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ordre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image du plat</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Ajouter une photo du plat"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Options du plat</FormLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isVegetarian"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">Végétarien</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVegan"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">Vegan</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isSpicy"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">Épicé</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">Actif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
