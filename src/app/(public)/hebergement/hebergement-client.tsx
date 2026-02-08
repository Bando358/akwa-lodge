"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Users, Maximize, ArrowRight, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeroContent,
  HeroItem,
  AnimatedGrid,
  GridItem,
  AnimatedCard,
  AnimatedSection,
} from "@/components/animations";

interface Chambre {
  id: string;
  nom: string;
  slug: string;
  type?: string;
  descriptionCourte: string;
  prix: number | string;
  capacite: number;
  superficie?: number | null;
  isFeatured?: boolean;
  images?: { url: string }[];
}

interface Promotion {
  id: string;
  nom: string;
  type: string;
  valeur: number;
  cible: string;
  chambreId: string | null;
  codePromo: string | null;
}

interface HebergementClientProps {
  chambres: Chambre[];
  promotions?: Promotion[];
}

// Ordre de priorité des types
const typeOrder: Record<string, number> = {
  "Suite": 1,
  "Villa": 2,
  "Bungalow": 3,
  "Chambre": 4,
};

function getPromoForChambre(chambreId: string, promotions: Promotion[]): Promotion | null {
  // D'abord chercher une promo ciblant cette chambre spécifiquement
  const specific = promotions.find((p) => p.chambreId === chambreId);
  if (specific) return specific;
  // Sinon une promo générale CHAMBRE (sans chambreId spécifique)
  const general = promotions.find((p) => !p.chambreId);
  return general || null;
}

function computeDiscountedPrice(prix: number, promo: Promotion): number | null {
  if (promo.type === "POURCENTAGE") {
    return Math.round(prix * (1 - promo.valeur / 100));
  }
  if (promo.type === "MONTANT_FIXE") {
    const result = prix - promo.valeur;
    return result > 0 ? Math.round(result) : null;
  }
  return null;
}

function formatPromoLabel(promo: Promotion): string {
  if (promo.type === "POURCENTAGE") return `-${promo.valeur}%`;
  if (promo.type === "MONTANT_FIXE") return `-${new Intl.NumberFormat("fr-FR").format(promo.valeur)} FCFA`;
  return promo.nom;
}

export function HebergementClient({ chambres, promotions = [] }: HebergementClientProps) {
  // Grouper les chambres par type
  const chambresByType = useMemo(() => {
    const grouped: Record<string, Chambre[]> = {};

    chambres.forEach((chambre) => {
      const type = chambre.type || "Chambre";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(chambre);
    });

    // Trier les types par ordre de priorité
    const sortedTypes = Object.keys(grouped).sort((a, b) => {
      const orderA = typeOrder[a] ?? 99;
      const orderB = typeOrder[b] ?? 99;
      return orderA - orderB;
    });

    return sortedTypes.map((type) => ({
      type,
      chambres: grouped[type],
    }));
  }, [chambres]);
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
              <BedDouble className="mr-2 h-3 w-3" />
              Hébergement
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Nos chambres d&apos;exception
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Des espaces élégants conçus pour votre confort, alliant luxe moderne
              et charme authentique avec vue sur la mer.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Chambres par Type */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          {chambres && chambres.length > 0 ? (
            <div className="space-y-12 sm:space-y-16">
              {chambresByType.map(({ type, chambres: typeChambres }, typeIndex) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: typeIndex * 0.1 }}
                >
                  {/* En-tête du type */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-4">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                        {type}s
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                      <Badge variant="outline" className="text-muted-foreground">
                        {typeChambres.length} {typeChambres.length > 1 ? "disponibles" : "disponible"}
                      </Badge>
                    </div>
                  </div>

                  {/* Grille des chambres */}
                  <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {typeChambres.map((chambre) => (
                      <GridItem key={chambre.id}>
                        <AnimatedCard>
                          <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 h-full">
                            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                              {chambre.images?.[0] ? (
                                <motion.img
                                  src={chambre.images[0].url}
                                  alt={chambre.nom}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.5 }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <BedDouble className="h-16 w-16 text-primary/30" />
                                </div>
                              )}
                              {/* Badge promo */}
                              {(() => {
                                const promo = getPromoForChambre(chambre.id, promotions);
                                return promo ? (
                                  <motion.div
                                    className="absolute top-4 left-4"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <Badge className="bg-red-500 text-white text-sm font-bold">
                                      <Tag className="mr-1 h-3 w-3" />
                                      {formatPromoLabel(promo)}
                                    </Badge>
                                  </motion.div>
                                ) : null;
                              })()}
                              {chambre.isFeatured && (
                                <motion.div
                                  className="absolute top-4 right-4"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <Badge className="bg-secondary text-secondary-foreground">
                                    <Star className="mr-1 h-3 w-3" />
                                    Vedette
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {chambre.nom}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {chambre.descriptionCourte}
                              </p>

                              {/* Caractéristiques */}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{chambre.capacite} pers.</span>
                                </div>
                                {chambre.superficie && (
                                  <div className="flex items-center gap-1">
                                    <Maximize className="h-4 w-4" />
                                    <span>{chambre.superficie} m²</span>
                                  </div>
                                )}
                              </div>

                              {/* Prix et CTA */}
                              {(() => {
                                const promo = getPromoForChambre(chambre.id, promotions);
                                const prixOriginal = Number(chambre.prix);
                                const prixPromo = promo ? computeDiscountedPrice(prixOriginal, promo) : null;

                                return (
                                  <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                      {prixPromo ? (
                                        <>
                                          <span className="text-sm text-muted-foreground line-through">
                                            {new Intl.NumberFormat("fr-FR").format(prixOriginal)} FCFA
                                          </span>
                                          <div>
                                            <span className="text-2xl font-bold text-red-600">
                                              {new Intl.NumberFormat("fr-FR").format(prixPromo)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                              {" "}FCFA / nuit
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-2xl font-bold text-primary">
                                            {new Intl.NumberFormat("fr-FR").format(prixOriginal)}
                                          </span>
                                          <span className="text-sm text-muted-foreground">
                                            {" "}FCFA / nuit
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <Button asChild size="sm">
                                      <Link href={`/hebergement/${chambre.slug}`}>
                                        Voir
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      </GridItem>
                    ))}
                  </AnimatedGrid>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BedDouble className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-2">
                Aucune chambre disponible
              </h2>
              <p className="text-muted-foreground mb-6">
                Nos chambres seront bientôt disponibles. Contactez-nous pour
                plus d&apos;informations.
              </p>
              <Button asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="font-serif text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Besoin d&apos;aide pour choisir ?
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-6 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Notre équipe est à votre disposition pour vous conseiller et vous
            aider à trouver l&apos;hébergement idéal pour votre séjour.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/reservation">Faire une demande</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
