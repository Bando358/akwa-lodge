"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Percent } from "lucide-react";
import { toast } from "sonner";
import { PromotionType, PromotionCible } from "@prisma/client";
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
import { updatePromotion, getPromotionTargets } from "@/lib/actions/promotions";

const promotionFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  type: z.nativeEnum(PromotionType),
  valeur: z.coerce.number().positive("La valeur doit être positive"),
  cible: z.nativeEnum(PromotionCible),
  chambreId: z.string().optional(),
  serviceId: z.string().optional(),
  codePromo: z.string().optional(),
  dateDebut: z.string().min(1, "Date de début requise"),
  dateFin: z.string().min(1, "Date de fin requise"),
  conditions: z.string().optional(),
  montantMinimum: z.coerce.number().positive().optional().or(z.literal("")),
  usageMax: z.coerce.number().int().positive().optional().or(z.literal("")),
  usageParClient: z.coerce.number().int().positive().default(1),
  isActive: z.boolean(),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

type Promotion = {
  id: string;
  nom: string;
  description: string | null;
  type: PromotionType;
  valeur: number;
  cible: PromotionCible;
  chambreId: string | null;
  serviceId: string | null;
  codePromo: string | null;
  dateDebut: string;
  dateFin: string;
  conditions: string | null;
  montantMinimum: number | null;
  usageMax: number | null;
  usageActuel: number;
  usageParClient: number | null;
  isActive: boolean;
};

type Chambre = { id: string; nom: string; slug: string };
type Service = { id: string; nom: string; slug: string; type: string };

interface EditPromotionFormProps {
  promotion: Promotion;
}

export function EditPromotionForm({ promotion }: EditPromotionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function loadTargets() {
      const result = await getPromotionTargets();
      if (result.success && result.data) {
        setChambres(result.data.chambres);
        setServices(result.data.services);
      }
    }
    loadTargets();
  }, []);

  const form = useForm<PromotionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(promotionFormSchema) as any,
    defaultValues: {
      nom: promotion.nom,
      description: promotion.description || "",
      type: promotion.type,
      valeur: promotion.valeur,
      cible: promotion.cible,
      chambreId: promotion.chambreId || "",
      serviceId: promotion.serviceId || "",
      codePromo: promotion.codePromo || "",
      dateDebut: promotion.dateDebut,
      dateFin: promotion.dateFin,
      conditions: promotion.conditions || "",
      montantMinimum: promotion.montantMinimum || "",
      usageMax: promotion.usageMax || "",
      usageParClient: promotion.usageParClient || 1,
      isActive: promotion.isActive,
    },
  });

  const watchType = form.watch("type");
  const watchCible = form.watch("cible");

  async function onSubmit(data: PromotionFormValues) {
    setIsLoading(true);

    try {
      const result = await updatePromotion(promotion.id, {
        ...data,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        chambreId: data.chambreId || null,
        serviceId: data.serviceId || null,
        codePromo: data.codePromo || null,
        conditions: data.conditions || null,
        montantMinimum: data.montantMinimum ? Number(data.montantMinimum) : null,
        usageMax: data.usageMax ? Number(data.usageMax) : null,
      });

      if (result.success) {
        toast.success("Promotion mise à jour");
        router.push("/admin/promotions");
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
          <Link href="/admin/promotions">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Percent className="h-8 w-8 text-primary" />
            Modifier la promotion
          </h1>
          <p className="mt-1 text-muted-foreground">{promotion.nom}</p>
        </div>
      </div>

      {/* Stats d'utilisation */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Utilisations</p>
              <p className="text-2xl font-bold">
                {promotion.usageActuel}
                {promotion.usageMax && (
                  <span className="text-muted-foreground">/{promotion.usageMax}</span>
                )}
              </p>
            </div>
            {promotion.codePromo && (
              <div>
                <p className="text-sm text-muted-foreground">Code promo</p>
                <code className="text-xl font-mono font-bold">{promotion.codePromo}</code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détails de la promotion</CardTitle>
                  <CardDescription>
                    Informations de base sur la promotion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la promotion *</FormLabel>
                        <FormControl>
                          <Input placeholder="Offre été 2024" {...field} />
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
                            placeholder="Détails de l'offre..."
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
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de réduction *</FormLabel>
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
                              <SelectItem value="POURCENTAGE">Pourcentage (%)</SelectItem>
                              <SelectItem value="MONTANT_FIXE">Montant fixe (FCFA)</SelectItem>
                              <SelectItem value="OFFRE_SPECIALE">Offre spéciale</SelectItem>
                              <SelectItem value="PACK">Pack / Forfait</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valeur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Valeur {watchType === "POURCENTAGE" ? "(%)" : "(FCFA)"} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={watchType === "POURCENTAGE" ? 100 : undefined}
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
                    name="codePromo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code promo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ETE2024"
                            className="uppercase"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormDescription>
                          Optionnel. Les clients pourront utiliser ce code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cible de la promotion</CardTitle>
                  <CardDescription>
                    À quels services s&apos;applique cette promotion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie *</FormLabel>
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
                            <SelectItem value="TOUS">Tous les services</SelectItem>
                            <SelectItem value="CHAMBRE">Chambres</SelectItem>
                            <SelectItem value="RESTAURATION">Restauration</SelectItem>
                            <SelectItem value="PISCINE">Piscine</SelectItem>
                            <SelectItem value="ACTIVITE">Activités</SelectItem>
                            <SelectItem value="BIEN_ETRE">Bien-être</SelectItem>
                            <SelectItem value="EVENEMENT">Événements</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchCible === "CHAMBRE" && chambres.length > 0 && (
                    <FormField
                      control={form.control}
                      name="chambreId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chambre spécifique</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "_all_" ? "" : value)}
                            value={field.value || "_all_"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Toutes les chambres" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="_all_">Toutes les chambres</SelectItem>
                              {chambres.map((chambre) => (
                                <SelectItem key={chambre.id} value={chambre.id}>
                                  {chambre.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {(watchCible === "ACTIVITE" || watchCible === "BIEN_ETRE" || watchCible === "RESTAURATION") && services.length > 0 && (
                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service spécifique</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "_all_" ? "" : value)}
                            value={field.value || "_all_"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tous les services" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="_all_">Tous les services</SelectItem>
                              {services
                                .filter((s) =>
                                  watchCible === "ACTIVITE" ? s.type === "ACTIVITE" :
                                  watchCible === "BIEN_ETRE" ? s.type === "BIEN_ETRE" :
                                  watchCible === "RESTAURATION" ? s.type === "RESTAURATION" : true
                                )
                                .map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.nom}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Période et conditions</CardTitle>
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
                          <FormLabel>Date de fin *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conditions d'utilisation de la promotion..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="montantMinimum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant minimum d&apos;achat (FCFA)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Limites d&apos;utilisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="usageMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre max d&apos;utilisations</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormDescription>
                          Laissez vide pour illimité
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usageParClient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utilisations par client</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Promotion utilisable
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
