"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EvenementType } from "@prisma/client";
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
import { getEvenementById, updateEvenement, deleteEvenement } from "@/lib/actions/evenements";

const evenementFormSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "Maximum 300 caractères"),
  type: z.nativeEnum(EvenementType),
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().optional(),
  heureDebut: z.string().optional(),
  heureFin: z.string().optional(),
  lieu: z.string().optional(),
  capaciteMin: z.coerce.number().int().positive().optional().or(z.literal("")),
  capaciteMax: z.coerce.number().int().positive().optional().or(z.literal("")),
  prix: z.coerce.number().positive().optional().or(z.literal("")),
  prixDescription: z.string().optional(),
  equipements: z.string().optional(),
  inclus: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type EvenementFormValues = z.infer<typeof evenementFormSchema>;

const typeOptions = [
  { value: "EVENEMENT", label: "Événement" },
  { value: "CONFERENCE", label: "Conférence" },
  { value: "MARIAGE", label: "Mariage" },
  { value: "SEMINAIRE", label: "Séminaire" },
  { value: "TEAM_BUILDING", label: "Team Building" },
  { value: "RECEPTION", label: "Réception" },
];

export default function EditEvenementPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<EvenementFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(evenementFormSchema) as any,
    defaultValues: {
      titre: "",
      description: "",
      descriptionCourte: "",
      type: "EVENEMENT",
      dateDebut: "",
      dateFin: "",
      heureDebut: "",
      heureFin: "",
      lieu: "",
      prixDescription: "",
      equipements: "",
      inclus: "",
      isActive: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    async function loadEvenement() {
      try {
        const result = await getEvenementById(params.id as string);
        if (result.success && result.data) {
          const evenement = result.data;
          form.reset({
            titre: evenement.titre,
            description: evenement.description,
            descriptionCourte: evenement.descriptionCourte,
            type: evenement.type,
            dateDebut: new Date(evenement.dateDebut).toISOString().split("T")[0],
            dateFin: evenement.dateFin
              ? new Date(evenement.dateFin).toISOString().split("T")[0]
              : "",
            heureDebut: evenement.heureDebut || "",
            heureFin: evenement.heureFin || "",
            lieu: evenement.lieu || "",
            capaciteMin: evenement.capaciteMin || undefined,
            capaciteMax: evenement.capaciteMax || undefined,
            prix: evenement.prix ? Number(evenement.prix) : undefined,
            prixDescription: evenement.prixDescription || "",
            equipements: evenement.equipements?.join(", ") || "",
            inclus: evenement.inclus?.join(", ") || "",
            isActive: evenement.isActive,
            isFeatured: evenement.isFeatured,
          });
        } else {
          toast.error("Événement non trouvé");
          router.push("/admin/evenements");
        }
      } catch {
        toast.error("Erreur lors du chargement");
        router.push("/admin/evenements");
      } finally {
        setIsLoadingData(false);
      }
    }

    loadEvenement();
  }, [params.id, form, router]);

  async function onSubmit(data: EvenementFormValues) {
    setIsLoading(true);

    try {
      const result = await updateEvenement(params.id as string, {
        ...data,
        dateDebut: new Date(data.dateDebut),
        dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
        prix: data.prix ? Number(data.prix) : undefined,
        capaciteMin: data.capaciteMin ? Number(data.capaciteMin) : undefined,
        capaciteMax: data.capaciteMax ? Number(data.capaciteMax) : undefined,
        equipements: data.equipements
          ? data.equipements.split(",").map((e) => e.trim())
          : [],
        inclus: data.inclus
          ? data.inclus.split(",").map((i) => i.trim())
          : [],
      });

      if (result.success) {
        toast.success("Événement mis à jour avec succès");
        router.push("/admin/evenements");
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
      const result = await deleteEvenement(params.id as string);
      if (result.success) {
        toast.success("Événement supprimé avec succès");
        router.push("/admin/evenements");
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
            <Link href="/admin/evenements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-primary" />
              Modifier l&apos;événement
            </h1>
            <p className="mt-1 text-muted-foreground">
              Modifiez les informations de l&apos;événement
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
                Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est
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
                    Les informations de base de l&apos;événement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="titre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Mariage sur la plage"
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
                          <FormLabel>Type *</FormLabel>
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
                            placeholder="Description détaillée de l'événement..."
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

              {/* Dates et horaires */}
              <Card>
                <CardHeader>
                  <CardTitle>Dates et horaires</CardTitle>
                  <CardDescription>
                    Quand aura lieu l&apos;événement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dateDebut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de début *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de fin</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heureDebut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de début</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heureFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de fin</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="lieu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Salle de conférence principale"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Détails */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails</CardTitle>
                  <CardDescription>
                    Informations complémentaires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="capaciteMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité minimum</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Ex: 10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capaciteMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité maximum</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Ex: 200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="equipements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Équipements disponibles</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Vidéoprojecteur, Sonorisation, WiFi... (séparés par des virgules)"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Séparez chaque équipement par une virgule
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inclus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inclus dans le forfait</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Pause café, Déjeuner, Documentation... (séparés par des virgules)"
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
                  <CardDescription>Prix de l&apos;événement</CardDescription>
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
                            placeholder="Ex: 500000"
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
                    Options d&apos;affichage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Événement actif</FormLabel>
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
