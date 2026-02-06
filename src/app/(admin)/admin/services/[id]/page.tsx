"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, UtensilsCrossed, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ServiceType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getServiceById, updateService, deleteService } from "@/lib/actions/services";

const serviceFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "Maximum 300 caractères"),
  type: z.nativeEnum(ServiceType),
  icone: z.string().optional(),
  prix: z.coerce.number().positive().optional().or(z.literal("")),
  prixDescription: z.string().optional(),
  horaires: z.string().optional(),
  capacite: z.coerce.number().int().positive().optional().or(z.literal("")),
  duree: z.string().optional(),
  inclus: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const typeOptions = [
  { value: "RESTAURATION", label: "Restauration" },
  { value: "ACTIVITE", label: "Activité" },
  { value: "BIEN_ETRE", label: "Bien-être" },
  { value: "PISCINE", label: "Piscine" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "AUTRE", label: "Autre" },
];

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<ServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(serviceFormSchema) as any,
    defaultValues: {
      nom: "",
      description: "",
      descriptionCourte: "",
      type: "ACTIVITE",
      icone: "",
      prixDescription: "",
      horaires: "",
      duree: "",
      inclus: "",
      isActive: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    async function loadService() {
      try {
        const result = await getServiceById(params.id as string);
        if (result.success && result.data) {
          const service = result.data;
          form.reset({
            nom: service.nom,
            description: service.description,
            descriptionCourte: service.descriptionCourte,
            type: service.type,
            icone: service.icone || "",
            prix: service.prix ? Number(service.prix) : undefined,
            prixDescription: service.prixDescription || "",
            horaires: service.horaires || "",
            capacite: service.capacite || undefined,
            duree: service.duree || "",
            inclus: service.inclus?.join(", ") || "",
            isActive: service.isActive,
            isFeatured: service.isFeatured,
          });
        } else {
          toast.error("Service non trouvé");
          router.push("/admin/services");
        }
      } catch {
        toast.error("Erreur lors du chargement");
        router.push("/admin/services");
      } finally {
        setIsLoadingData(false);
      }
    }

    loadService();
  }, [params.id, form, router]);

  async function onSubmit(data: ServiceFormValues) {
    setIsLoading(true);

    try {
      const result = await updateService(params.id as string, {
        ...data,
        prix: data.prix ? Number(data.prix) : undefined,
        capacite: data.capacite ? Number(data.capacite) : undefined,
        inclus: data.inclus
          ? data.inclus.split(",").map((i) => i.trim())
          : [],
      });

      if (result.success) {
        toast.success("Service mis à jour avec succès");
        router.push("/admin/services");
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteService(params.id as string);
      if (result.success) {
        toast.success("Service supprimé avec succès");
        router.push("/admin/services");
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              Modifier le service
            </h1>
            <p className="mt-1 text-muted-foreground">
              Modifiez les informations du service
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce service ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>
                    Les informations de base du service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du service *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Restaurant L'Océan"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de service *</FormLabel>
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
                              {typeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
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
                    name="descriptionCourte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description courte *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Une brève description pour les aperçus..."
                            className="resize-none"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/300 caractères
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description complète *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description détaillée du service..."
                            className="resize-none"
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Détails du service */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails</CardTitle>
                  <CardDescription>
                    Informations complémentaires sur le service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="horaires"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horaires</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 07:00 - 22:00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 1h30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Ex: 50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="icone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icône</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: utensils"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nom de l&apos;icône Lucide
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="inclus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inclus dans le service</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Équipement fourni, boissons, etc. (séparés par des virgules)"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Séparez chaque élément par une virgule
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Tarification */}
              <Card>
                <CardHeader>
                  <CardTitle>Tarification</CardTitle>
                  <CardDescription>Prix du service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (FCFA)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Ex: 15000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prixDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description du prix</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: par personne"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Visibilité */}
              <Card>
                <CardHeader>
                  <CardTitle>Visibilité</CardTitle>
                  <CardDescription>
                    Options d&apos;affichage du service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Service actif</FormLabel>
                          <FormDescription>
                            Visible sur le site public
                          </FormDescription>
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
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mettre en vedette</FormLabel>
                          <FormDescription>
                            Afficher sur la page d&apos;accueil
                          </FormDescription>
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
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Enregistrer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
