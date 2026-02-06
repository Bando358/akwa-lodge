"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Waves,
  Ship,
  Palmtree,
  Sun,
  Bike,
  Volleyball,
  Music,
  Camera,
  Umbrella,
  ArrowRight,
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

const activites = [
  {
    titre: "Plage Privée",
    description: "Détendez-vous sur notre plage de sable fin avec transats, parasols et service de boissons.",
    icon: Umbrella,
    inclus: true,
  },
  {
    titre: "Excursions en Bateau",
    description: "Découvrez la côte et les îles environnantes lors d'une sortie en bateau.",
    icon: Ship,
    inclus: false,
    prix: "25 000 FCFA",
  },
  {
    titre: "Piscine Infinity",
    description: "Notre piscine à débordement offre une vue imprenable sur l'océan.",
    icon: Waves,
    inclus: true,
  },
  {
    titre: "Sports Nautiques",
    description: "Jet-ski, paddle, kayak et plus encore pour les amateurs de sensations.",
    icon: Waves,
    inclus: false,
    prix: "À partir de 15 000 FCFA",
  },
  {
    titre: "Beach Volley",
    description: "Terrain de beach-volley sur la plage pour des moments de convivialité.",
    icon: Volleyball,
    inclus: true,
  },
  {
    titre: "Location de Vélos",
    description: "Explorez les environs de Jacqueville à vélo avec nos VTT.",
    icon: Bike,
    inclus: false,
    prix: "5 000 FCFA/jour",
  },
  {
    titre: "Soirées Animées",
    description: "Musique live et animations le week-end pour des soirées mémorables.",
    icon: Music,
    inclus: true,
  },
  {
    titre: "Promenades Nature",
    description: "Randonnées guidées à travers les cocoteraies et la végétation tropicale.",
    icon: Palmtree,
    inclus: false,
    prix: "10 000 FCFA",
  },
];

const moments = [
  {
    titre: "Lever de Soleil",
    description: "Commencez la journée par un yoga face à la mer au lever du soleil.",
    horaire: "06h00",
  },
  {
    titre: "Matinée Active",
    description: "Sports nautiques, baignade ou beach-volley pour les plus sportifs.",
    horaire: "09h00 - 12h00",
  },
  {
    titre: "Détente",
    description: "Sieste au bord de la piscine ou massage en bord de mer.",
    horaire: "14h00 - 17h00",
  },
  {
    titre: "Coucher de Soleil",
    description: "Cocktails sur la terrasse avec vue sur le coucher de soleil.",
    horaire: "18h00",
  },
];

export default function ActivitesPage() {
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
              <Sun className="mr-2 h-3 w-3" />
              Activités
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Loisirs & Détente
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Entre mer et nature, profitez d&apos;une multitude d&apos;activités
              pour un séjour riche en découvertes et en émotions.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Activités Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Nos Activités
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Des expériences pour tous les goûts
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Que vous cherchiez l&apos;aventure ou la relaxation, nous avons
              l&apos;activité parfaite pour vous.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activites.map((activite, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -8 }}>
                  <Card className="h-full hover:shadow-luxury transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <activite.icon className="h-6 w-6" />
                        </motion.div>
                        {activite.inclus ? (
                          <Badge className="bg-green-100 text-green-700">
                            Inclus
                          </Badge>
                        ) : (
                          <Badge variant="outline">{activite.prix}</Badge>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-semibold mb-2">
                        {activite.titre}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {activite.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Journée Type */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Camera className="mr-2 h-3 w-3" />
              Votre Journée
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Une journée parfaite à Akwa Lodge
            </h2>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            <StaggerContainer className="space-y-6">
              {moments.map((moment, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-6"
                  >
                    <div className="flex-shrink-0 w-20 text-center">
                      <span className="text-2xl font-bold text-primary">
                        {moment.horaire}
                      </span>
                    </div>
                    <div className="flex-1 pb-6 border-b last:border-0">
                      <h3 className="font-serif text-lg font-semibold mb-1">
                        {moment.titre}
                      </h3>
                      <p className="text-muted-foreground">
                        {moment.description}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Prêt à vivre l&apos;aventure ?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Réservez votre séjour et profitez de toutes nos activités.
            </p>
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/reservation">
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
