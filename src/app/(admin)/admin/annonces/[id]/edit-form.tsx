"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Megaphone, Image, Video, FileText } from "lucide-react";
import { toast } from "sonner";
// Types correspondant au schema Prisma
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateAnnonce } from "@/lib/actions/annonces";
import { getPromotions } from "@/lib/actions/promotions";

const annonceFormSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  mediaType: z.enum(["TEXT", "IMAGE", "VIDEO"]),
  mediaUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  mediaDuration: z.number().int().min(3).max(5),
  lien: z.string().url("URL invalide").optional().or(z.literal("")),
  boutonTexte: z.string().optional(),
  cibleType: z.enum(["GENERAL", "HEBERGEMENT", "RESTAURATION", "ACTIVITES", "EVENEMENTS", "PROMOTIONS"]),
  dateDebut: z.string().min(1, "Date de début requise"),
  dateFin: z.string().min(1, "Date de fin requise"),
  position: z.enum(["ACCUEIL", "HEBERGEMENT", "RESTAURATION", "ACTIVITES", "EVENEMENTS", "TOUTES_PAGES", "POPUP", "BANNIERE"]),
  couleurFond: z.string().optional(),
  couleurTexte: z.string().optional(),
  ordre: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  promotionId: z.string().optional(),
});

type AnnonceFormValues = z.infer<typeof annonceFormSchema>;

type Annonce = {
  id: string;
  titre: string;
  description: string | null;
  mediaType: "TEXT" | "IMAGE" | "VIDEO";
  mediaUrl: string | null;
  mediaDuration: number | null;
  lien: string | null;
  boutonTexte: string | null;
  cibleType: "GENERAL" | "HEBERGEMENT" | "RESTAURATION" | "ACTIVITES" | "EVENEMENTS" | "PROMOTIONS";
  dateDebut: string;
  dateFin: string;
  position: "ACCUEIL" | "HEBERGEMENT" | "RESTAURATION" | "ACTIVITES" | "EVENEMENTS" | "TOUTES_PAGES" | "POPUP" | "BANNIERE";
  couleurFond: string | null;
  couleurTexte: string | null;
  ordre: number;
  isActive: boolean;
  isPinned: boolean;
  promotionId: string | null;
};

type Promotion = {
  id: string;
  nom: string;
};

interface EditAnnonceFormProps {
  annonce: Annonce;
}

export function EditAnnonceForm({ annonce }: EditAnnonceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    async function loadPromotions() {
      const result = await getPromotions({ isActive: true });
      if (result.success && result.data) {
        setPromotions(result.data.map((p) => ({ id: p.id, nom: p.nom })));
      }
    }
    loadPromotions();
  }, []);

  const form = useForm<AnnonceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(annonceFormSchema) as any,
    defaultValues: {
      titre: annonce.titre,
      description: annonce.description || "",
      mediaType: annonce.mediaType,
      mediaUrl: annonce.mediaUrl || "",
      mediaDuration: annonce.mediaDuration || 3,
      lien: annonce.lien || "",
      boutonTexte: annonce.boutonTexte || "",
      cibleType: annonce.cibleType,
      dateDebut: annonce.dateDebut,
      dateFin: annonce.dateFin,
      position: annonce.position,
      couleurFond: annonce.couleurFond || "",
      couleurTexte: annonce.couleurTexte || "",
      ordre: annonce.ordre,
      isActive: annonce.isActive,
      isPinned: annonce.isPinned,
      promotionId: annonce.promotionId || "",
    },
  });

  const watchMediaType = form.watch("mediaType");

  async function onSubmit(data: AnnonceFormValues) {
    setIsLoading(true);

    try {
      const result = await updateAnnonce(annonce.id, {
        ...data,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        mediaUrl: data.mediaUrl || null,
        lien: data.lien || null,
        boutonTexte: data.boutonTexte || null,
        couleurFond: data.couleurFond || null,
        couleurTexte: data.couleurTexte || null,
        promotionId: data.promotionId || null,
        mediaDuration: data.mediaType === "VIDEO" ? data.mediaDuration : null,
      });

      if (result.success) {
        toast.success("Annonce mise à jour");
        router.push("/admin/annonces");
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
          <Link href="/admin/annonces">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            Modifier l&apos;annonce
          </h1>
          <p className="mt-1 text-muted-foreground">{annonce.titre}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu</CardTitle>
                  <CardDescription>
                    Le contenu de votre annonce
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Offre spéciale été..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Détails de l'annonce..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mediaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de média</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="TEXT" id="text" />
                              <label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
                                <FileText className="h-4 w-4" />
                                Texte
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="IMAGE" id="image" />
                              <label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
                                <Image className="h-4 w-4" />
                                Image
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="VIDEO" id="video" />
                              <label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                                <Video className="h-4 w-4" />
                                Vidéo
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(watchMediaType === "IMAGE" || watchMediaType === "VIDEO") && (
                    <FormField
                      control={form.control}
                      name="mediaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            URL du média {watchMediaType === "IMAGE" ? "(image)" : "(vidéo)"} *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchMediaType === "VIDEO" && (
                    <FormField
                      control={form.control}
                      name="mediaDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée de la vidéo (secondes) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={3}
                              max={5}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Entre 3 et 5 secondes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lien et action</CardTitle>
                  <CardDescription>
                    Ajoutez un lien vers une page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="lien"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL du lien</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="boutonTexte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texte du bouton</FormLabel>
                        <FormControl>
                          <Input placeholder="En savoir plus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="promotionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotion liée</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "_none_" ? "" : value)}
                          value={field.value || "_none_"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Aucune promotion" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="_none_">Aucune</SelectItem>
                            {promotions.map((promo) => (
                              <SelectItem key={promo.id} value={promo.id}>
                                {promo.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Période d&apos;affichage</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <FormLabel>Date de fin *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Affichage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACCUEIL">Page d&apos;accueil</SelectItem>
                            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
                            <SelectItem value="RESTAURATION">Restauration</SelectItem>
                            <SelectItem value="ACTIVITES">Activités</SelectItem>
                            <SelectItem value="EVENEMENTS">Événements</SelectItem>
                            <SelectItem value="TOUTES_PAGES">Toutes les pages</SelectItem>
                            <SelectItem value="POPUP">Popup</SelectItem>
                            <SelectItem value="BANNIERE">Bannière</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cibleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GENERAL">Général</SelectItem>
                            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
                            <SelectItem value="RESTAURATION">Restauration</SelectItem>
                            <SelectItem value="ACTIVITES">Activités</SelectItem>
                            <SelectItem value="EVENEMENTS">Événements</SelectItem>
                            <SelectItem value="PROMOTIONS">Promotions</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPinned"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Épingler</FormLabel>
                          <FormDescription>
                            Afficher en priorité
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Visible sur le site
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
                    Enregistrer les modifications
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
