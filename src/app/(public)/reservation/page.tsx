"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScrollReveal,
  HeroContent,
  HeroItem,
} from "@/components/animations";

const reservationSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  dateArrivee: z.string().min(1, "Date d'arrivée requise"),
  dateDepart: z.string().min(1, "Date de départ requise"),
  nombrePersonnes: z.string().min(1, "Nombre de personnes requis"),
  typeChambre: z.string().min(1, "Type de chambre requis"),
  message: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const avantages = [
  "Confirmation sous 24h",
  "Annulation gratuite 48h avant",
  "Meilleur tarif garanti",
  "Petit-déjeuner inclus",
];

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      dateArrivee: "",
      dateDepart: "",
      nombrePersonnes: "",
      typeChambre: "",
      message: "",
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    // Simuler un envoi
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <>
        <section className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 text-secondary" />
            </motion.div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Demande envoyée !
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mb-6 sm:mb-8">
              Merci pour votre demande de réservation. Notre équipe vous
              contactera sous 24h pour confirmer votre séjour.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Nouvelle demande
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <HeroContent className="container mx-auto px-4 text-center text-white relative z-10">
          <HeroItem>
            <Badge
              variant="outline"
              className="mb-4 border-secondary/50 text-secondary bg-secondary/10"
            >
              <Calendar className="mr-2 h-3 w-3" />
              Réservation
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Réservez votre séjour
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Remplissez le formulaire ci-dessous et notre équipe vous
              contactera pour finaliser votre réservation.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Formulaire */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Avantages */}
            <ScrollReveal variant="fadeRight">
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-2">
                    Pourquoi réserver directement ?
                  </h2>
                  <p className="text-muted-foreground">
                    Bénéficiez de nombreux avantages en réservant sur notre site.
                  </p>
                </div>

                <div className="space-y-4">
                  {avantages.map((avantage, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{avantage}</span>
                    </motion.div>
                  ))}
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">Besoin d&apos;aide ?</h3>
                    <div className="space-y-2 text-sm">
                      <a
                        href="tel:+2250700048097"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        +225 07 00 04 80 97
                      </a>
                      <a
                        href="mailto:Contact@akwaluxurylodge.com"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        Contact@akwaluxurylodge.com
                      </a>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Lun-Dim: 8h00 - 20h00
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* Formulaire */}
            <ScrollReveal variant="fadeLeft" delay={0.2} className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="votre@email.com"
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
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+225 00 00 00 00 00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateArrivee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date d&apos;arrivée *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateDepart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de départ *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nombrePersonnes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de personnes *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 personne</SelectItem>
                                  <SelectItem value="2">2 personnes</SelectItem>
                                  <SelectItem value="3">3 personnes</SelectItem>
                                  <SelectItem value="4">4 personnes</SelectItem>
                                  <SelectItem value="5+">5+ personnes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="typeChambre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de chambre *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="standard">
                                    Chambre Standard
                                  </SelectItem>
                                  <SelectItem value="bungalow">
                                    Bungalow Vue Mer
                                  </SelectItem>
                                  <SelectItem value="suite-ocean">
                                    Suite Océan Premium
                                  </SelectItem>
                                  <SelectItem value="suite-royale">
                                    Suite Royale
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (optionnel)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Demandes particulières, occasions spéciales..."
                                className="resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Calendar className="mr-2 h-5 w-5" />
                            Envoyer la demande
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        En soumettant ce formulaire, vous acceptez nos{" "}
                        <a href="/cgv" className="underline">
                          conditions générales
                        </a>{" "}
                        et notre{" "}
                        <a href="/politique-confidentialite" className="underline">
                          politique de confidentialité
                        </a>
                        .
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
