"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, BedDouble, Video } from "lucide-react";
import { toast } from "sonner";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateChambre } from "@/lib/actions/chambres";

const chambreFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "Maximum 300 caractères"),
  videoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  prix: z.coerce.number().positive("Le prix doit être positif"),
  prixWeekend: z.coerce.number().positive().optional().or(z.literal("")),
  capacite: z.coerce.number().int().positive("La capacité doit être positive"),
  superficie: z.coerce.number().int().positive().optional().or(z.literal("")),
  nombreLits: z.coerce.number().int().positive().default(1),
  typeLit: z.string().optional(),
  vue: z.string().optional(),
  equipements: z.string().optional(),
  caracteristiques: z.string().optional(),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ChambreFormValues = z.infer<typeof chambreFormSchema>;

interface ChambreData {
  id: string;
  nom: string;
  slug: string;
  type: string;
  description: string;
  descriptionCourte: string;
  videoUrl?: string;
  prix: number;
  prixWeekend?: number;
  capacite: number;
  superficie?: number;
  nombreLits: number;
  typeLit?: string;
  vue?: string;
  equipements: string[];
  caracteristiques: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  ordre: number;
}

interface EditChambreFormProps {
  chambre: ChambreData;
}

const roomTypes = [
  { value: "Chambre", label: "Chambre" },
  { value: "Suite", label: "Suite" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Villa", label: "Villa" },
];

export function EditChambreForm({ chambre }: EditChambreFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChambreFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(chambreFormSchema) as any,
    defaultValues: {
      nom: chambre.nom,
      type: chambre.type,
      description: chambre.description,
      descriptionCourte: chambre.descriptionCourte,
      videoUrl: chambre.videoUrl || "",
      prix: chambre.prix,
      prixWeekend: chambre.prixWeekend,
      capacite: chambre.capacite,
      superficie: chambre.superficie,
      nombreLits: chambre.nombreLits,
      typeLit: chambre.typeLit || "",
      vue: chambre.vue || "",
      equipements: chambre.equipements.join(", "),
      caracteristiques: chambre.caracteristiques.join(", "),
      images: chambre.images,
      isActive: chambre.isActive,
      isFeatured: chambre.isFeatured,
    },
  });

  async function onSubmit(data: ChambreFormValues) {
    setIsLoading(true);

    try {
      const result = await updateChambre(chambre.id, {
        ...data,
        prix: Number(data.prix),
        prixWeekend: data.prixWeekend ? Number(data.prixWeekend) : undefined,
        capacite: Number(data.capacite),
        superficie: data.superficie ? Number(data.superficie) : undefined,
        nombreLits: Number(data.nombreLits),
        videoUrl: data.videoUrl || undefined,
        equipements: data.equipements
          ? data.equipements.split(",").map((e) => e.trim()).filter(Boolean)
          : [],
        caracteristiques: data.caracteristiques
          ? data.caracteristiques.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        images: data.images,
      });

      if (result.success) {
        toast.success("Chambre mise à jour avec succès");
        router.push("/admin/chambres");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/chambres">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <BedDouble className="h-8 w-8 text-primary" />
            Modifier la chambre
          </h1>
          <p className="mt-1 text-muted-foreground">
            {chambre.nom} - /{chambre.slug}
          </p>
        </div>
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
                    Les informations de base de la chambre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de la chambre *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Suite Océan Premium"
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
                          <FormLabel>Type de chambre *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
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
                            placeholder="Description détaillée de la chambre..."
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

              {/* Caractéristiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                  <CardDescription>
                    Les détails techniques de la chambre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="capacite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité (personnes) *</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Ex: 45"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nombreLits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de lits</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="typeLit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de lit</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: King Size"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="vue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vue</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Vue sur la mer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="equipements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Équipements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Climatisation, TV, WiFi, Minibar... (séparés par des virgules)"
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
                    name="caracteristiques"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caractéristiques spéciales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Terrasse privée, Jacuzzi, Accès direct plage... (séparés par des virgules)"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Séparez chaque caractéristique par une virgule
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Vidéo de présentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Vidéo de présentation
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une vidéo YouTube pour présenter la chambre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la vidéo YouTube</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          La vidéo s&apos;affichera automatiquement quand un visiteur ouvrira la page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos de la chambre</CardTitle>
                  <CardDescription>
                    Ajoutez des photos pour présenter la chambre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={(urls) => field.onChange(urls)}
                            multiple
                            maxFiles={10}
                          />
                        </FormControl>
                        <FormDescription>
                          Vous pouvez ajouter jusqu&apos;à 10 photos
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
                  <CardDescription>Prix de la chambre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix par nuit (FCFA) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Ex: 75000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prixWeekend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix week-end (FCFA)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Ex: 85000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Laissez vide pour utiliser le prix standard
                        </FormDescription>
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
                    Options d&apos;affichage de la chambre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Chambre active</FormLabel>
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
                <CardContent className="pt-6 space-y-3">
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
                    Enregistrer les modifications
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/hebergement/${chambre.slug}`} target="_blank">
                      Voir sur le site
                    </Link>
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
