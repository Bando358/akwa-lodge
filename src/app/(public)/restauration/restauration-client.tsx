"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Clock,
  Wine,
  Coffee,
  ChefHat,
  Sparkles,
  Phone,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeroContent,
  HeroItem,
} from "@/components/animations";

interface Promotion {
  id: string;
  nom: string;
  type: string;
  valeur: number;
  codePromo: string | null;
}

function parsePrix(prix: string): number {
  return parseInt(prix.replace(/\s/g, ""), 10);
}

function computeDiscountedPrice(prix: number, promo: Promotion): number | null {
  if (promo.type === "POURCENTAGE") return Math.round(prix * (1 - promo.valeur / 100));
  if (promo.type === "MONTANT_FIXE") {
    const r = prix - promo.valeur;
    return r > 0 ? Math.round(r) : null;
  }
  return null;
}

function formatPrice(prix: number): string {
  return new Intl.NumberFormat("fr-FR").format(prix);
}

function formatPromoLabel(promo: Promotion): string {
  if (promo.type === "POURCENTAGE") return `-${promo.valeur}%`;
  if (promo.type === "MONTANT_FIXE") return `-${formatPrice(promo.valeur)} FCFA`;
  return promo.nom;
}

const menuCategories = [
  {
    title: "Petit-déjeuner",
    description: "Buffet continental et spécialités africaines",
    horaires: "07h00 - 10h30",
    icon: Coffee,
  },
  {
    title: "Déjeuner",
    description: "Cuisine fusion locale et internationale",
    horaires: "12h00 - 15h00",
    icon: UtensilsCrossed,
  },
  {
    title: "Dîner",
    description: "Gastronomie raffinée et saveurs du terroir",
    horaires: "19h00 - 22h30",
    icon: ChefHat,
  },
  {
    title: "Bar & Lounge",
    description: "Cocktails signature et vins sélectionnés",
    horaires: "11h00 - 00h00",
    icon: Wine,
  },
];

const specialites = [
  {
    nom: "Poisson braisé de la côte",
    description: "Poisson frais du jour grillé aux épices locales, accompagné d'attiéké et sauce claire",
    prix: "15 000",
  },
  {
    nom: "Poulet Kedjenou",
    description: "Poulet mijoté à l'étouffée avec légumes et épices traditionnelles",
    prix: "12 000",
  },
  {
    nom: "Langouste grillée",
    description: "Langouste fraîche grillée au beurre d'ail, riz parfumé et légumes de saison",
    prix: "35 000",
  },
  {
    nom: "Salade Akwa",
    description: "Salade fraîche avec avocat, crevettes, mangue et vinaigrette passion",
    prix: "8 000",
  },
];

export function RestaurationClient({ promotions = [] }: { promotions?: Promotion[] }) {
  const promo = promotions.length > 0 ? promotions[0] : null;
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
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
              <UtensilsCrossed className="mr-2 h-3 w-3" />
              Restauration
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Une expérience culinaire unique
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Savourez les saveurs de la Côte d&apos;Ivoire et du monde dans un cadre
              exceptionnel avec vue sur la mer.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal variant="fadeRight">
              <div>
                <Badge variant="outline" className="mb-4">
                  <ChefHat className="mr-2 h-3 w-3" />
                  Notre Restaurant
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Le Restaurant <span className="text-primary">L&apos;Océan</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Notre chef et son équipe vous proposent une cuisine créative
                  inspirée des traditions ivoiriennes et des influences internationales.
                  Chaque plat est préparé avec des ingrédients frais et locaux.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Profitez de notre terrasse avec vue panoramique sur la mer
                  pour un moment de pure détente gastronomique.
                </p>
                <Button asChild>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" />
                    Réserver une table
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeLeft" delay={0.2}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHat className="h-24 w-24 text-primary/30" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Nos Services
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Horaires & Services
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Du petit-déjeuner au dîner, notre équipe vous accueille avec le sourire
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuCategories.map((category, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card className="h-full hover:shadow-luxury transition-all">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <category.icon className="h-7 w-7" />
                      </motion.div>
                      <h3 className="font-serif text-lg font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <Clock className="h-4 w-4" />
                        <span>{category.horaires}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Spécialités */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-2 h-3 w-3" />
              Nos Spécialités
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              À la carte
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Découvrez quelques-unes de nos spécialités signature
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {specialites.map((plat, index) => {
              const prixNum = parsePrix(plat.prix);
              const discounted = promo ? computeDiscountedPrice(prixNum, promo) : null;
              return (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="hover:shadow-md transition-all relative overflow-hidden">
                      {promo && (
                        <div className="absolute top-0 right-0">
                          <Badge className="bg-red-500 text-white rounded-none rounded-bl-lg text-xs font-bold px-2 py-1">
                            <Tag className="h-3 w-3 mr-1" />
                            {formatPromoLabel(promo)}
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-lg font-semibold">
                            {plat.nom}
                          </h3>
                          <div className="text-right ml-4 whitespace-nowrap">
                            {discounted ? (
                              <>
                                <span className="text-muted-foreground line-through text-sm">
                                  {plat.prix} FCFA
                                </span>
                                <span className="block text-red-600 font-bold">
                                  {formatPrice(discounted)} FCFA
                                </span>
                              </>
                            ) : (
                              <span className="text-primary font-bold">
                                {plat.prix} FCFA
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Réservez votre table
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Pour les groupes ou occasions spéciales, nous vous recommandons
              de réserver à l&apos;avance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="/contact">
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="tel:+2250700000000">
                  <Phone className="mr-2 h-4 w-4" />
                  +225 07 00 00 00 00
                </a>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
