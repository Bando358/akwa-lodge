"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PartyPopper,
  Heart,
  Users,
  Calendar,
  MapPin,
  Music,
  Utensils,
  ArrowRight,
  CheckCircle,
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

const typesEvenements = [
  {
    titre: "Mariages",
    description: "Célébrez le plus beau jour de votre vie dans un cadre paradisiaque en bord de mer.",
    icon: Heart,
    capacite: "Jusqu'à 300 personnes",
    image: "/images/events/mariage.jpg",
  },
  {
    titre: "Anniversaires",
    description: "Fêtez vos moments spéciaux avec une organisation sur-mesure.",
    icon: PartyPopper,
    capacite: "De 20 à 150 personnes",
    image: "/images/events/anniversaire.jpg",
  },
  {
    titre: "Réceptions Corporate",
    description: "Organisez vos soirées d'entreprise dans un lieu d'exception.",
    icon: Users,
    capacite: "Jusqu'à 200 personnes",
    image: "/images/events/corporate.jpg",
  },
  {
    titre: "Cocktails & Galas",
    description: "Des soirées élégantes avec vue sur le coucher de soleil.",
    icon: Utensils,
    capacite: "Jusqu'à 250 personnes",
    image: "/images/events/gala.jpg",
  },
];

const services = [
  "Décoration personnalisée",
  "Traiteur sur-mesure",
  "DJ et animation musicale",
  "Photographe/Vidéaste partenaire",
  "Hébergement pour les invités",
  "Coordination le jour J",
  "Service voiturier",
  "Feu d'artifice (sur demande)",
];

const espaces = [
  {
    nom: "Terrasse Océan",
    description: "Vue panoramique sur la mer, idéale pour les cérémonies et cocktails.",
    capacite: "300 personnes",
  },
  {
    nom: "Jardin des Palmiers",
    description: "Un écrin de verdure pour des événements en plein air.",
    capacite: "200 personnes",
  },
  {
    nom: "Salle Akwa",
    description: "Notre grande salle climatisée pour les réceptions.",
    capacite: "250 personnes",
  },
  {
    nom: "Plage Privée",
    description: "Célébrez les pieds dans le sable pour un moment unique.",
    capacite: "150 personnes",
  },
];

export function EvenementsClient() {
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
              <PartyPopper className="mr-2 h-3 w-3" />
              Événements
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Vos événements d&apos;exception
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Mariages, anniversaires ou réceptions privées — créez des souvenirs
              inoubliables dans un cadre de rêve.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Types d'événements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Nos Prestations
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Chaque événement est unique
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Nous personnalisons chaque détail pour faire de votre événement
              un moment parfait.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {typesEvenements.map((event, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card className="h-full hover:shadow-luxury transition-all overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <event.icon className="h-16 w-16 text-primary/30" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        {event.titre}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.description}
                      </p>
                      <Badge variant="outline">
                        <Users className="mr-1 h-3 w-3" />
                        {event.capacite}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Nos Espaces */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <MapPin className="mr-2 h-3 w-3" />
              Nos Espaces
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Des lieux magiques
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {espaces.map((espace, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-lg font-semibold mb-2">
                        {espace.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {espace.description}
                      </p>
                      <Badge className="bg-primary/10 text-primary">
                        {espace.capacite}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services inclus */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal variant="fadeRight">
              <Badge variant="outline" className="mb-4">
                <CheckCircle className="mr-2 h-3 w-3" />
                Services
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Un accompagnement <span className="text-primary">complet</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Notre équipe dédiée vous accompagne dans chaque étape de
                l&apos;organisation pour un événement réussi.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{service}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeLeft" delay={0.2}>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Music className="h-32 w-32 text-primary/20" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Planifions votre événement
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Contactez notre équipe événementielle pour obtenir un devis
              personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="/contact">
                  <Calendar className="mr-2 h-4 w-4" />
                  Demander un devis
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/conferences">
                  Voir les Conférences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
