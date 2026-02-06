"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Star } from "lucide-react";
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
import { updateTemoignage } from "@/lib/actions/temoignages";

const temoignageFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  pays: z.string().optional(),
  photo: z.string().url().optional().or(z.literal("")),
  note: z.coerce.number().int().min(1).max(5).default(5),
  texte: z.string().min(10, "Le témoignage doit faire au moins 10 caractères"),
  dateVisite: z.string().optional(),
  isApproved: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type TemoignageFormValues = z.infer<typeof temoignageFormSchema>;

type Temoignage = {
  id: string;
  nom: string;
  pays: string | null;
  photo: string | null;
  note: number;
  texte: string;
  dateVisite: string | null;
  isApproved: boolean;
  isActive: boolean;
};

interface EditTemoignageFormProps {
  temoignage: Temoignage;
}

export function EditTemoignageForm({ temoignage }: EditTemoignageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TemoignageFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(temoignageFormSchema) as any,
    defaultValues: {
      nom: temoignage.nom,
      pays: temoignage.pays || "",
      photo: temoignage.photo || "",
      note: temoignage.note,
      texte: temoignage.texte,
      dateVisite: temoignage.dateVisite || "",
      isApproved: temoignage.isApproved,
      isActive: temoignage.isActive,
    },
  });

  async function onSubmit(data: TemoignageFormValues) {
    setIsLoading(true);

    try {
      const result = await updateTemoignage(temoignage.id, {
        ...data,
        dateVisite: data.dateVisite ? new Date(data.dateVisite) : undefined,
        photo: data.photo || undefined,
        pays: data.pays || undefined,
      });

      if (result.success) {
        toast.success("Témoignage mis à jour avec succès");
        router.push("/admin/temoignages");
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

  const watchNote = form.watch("note");

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/temoignages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Star className="h-8 w-8 text-primary" />
            Modifier le témoignage
          </h1>
          <p className="mt-1 text-muted-foreground">
            Témoignage de {temoignage.nom}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations client</CardTitle>
                  <CardDescription>
                    Les informations sur le client
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder="France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          URL de la photo du client (optionnel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateVisite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de visite</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Témoignage</CardTitle>
                  <CardDescription>
                    Le contenu du témoignage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note *</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-8 w-8 cursor-pointer transition-colors ${
                                    value <= watchNote
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300 hover:text-yellow-400"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-lg font-medium">
                              {watchNote}/5
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="texte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Témoignage *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Un séjour inoubliable..."
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
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statut</CardTitle>
                  <CardDescription>
                    Options de publication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isApproved"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Approuvé</FormLabel>
                          <FormDescription>
                            Témoignage vérifié
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
                          <FormLabel>Actif</FormLabel>
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
