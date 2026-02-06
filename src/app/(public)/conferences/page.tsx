"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Presentation,
  Users,
  Wifi,
  Monitor,
  Coffee,
  Mic,
  Projector,
  CheckCircle,
  ArrowRight,
  Phone,
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

const salles = [
  {
    nom: "Salle Jacqueville",
    capacite: "150 personnes",
    superficie: "200 m²",
    configuration: ["Théâtre", "Classe", "U", "Cocktail"],
    equipements: ["Vidéoprojecteur", "Sonorisation", "Climatisation", "WiFi"],
  },
  {
    nom: "Salle Assinie",
    capacite: "80 personnes",
    superficie: "120 m²",
    configuration: ["Théâtre", "Classe", "U", "Réunion"],
    equipements: ["Écran LED", "Micro sans fil", "Climatisation", "WiFi"],
  },
  {
    nom: "Boardroom",
    capacite: "20 personnes",
    superficie: "50 m²",
    configuration: ["Table de conférence"],
    equipements: ["Écran 65\"", "Visioconférence", "Climatisation", "WiFi"],
  },
];

const equipements = [
  { icon: Projector, nom: "Vidéoprojecteur HD" },
  { icon: Monitor, nom: "Écrans LED" },
  { icon: Mic, nom: "Système audio" },
  { icon: Wifi, nom: "WiFi haut débit" },
];

const formules = [
  {
    nom: "Demi-journée",
    description: "Idéale pour les réunions courtes",
    inclus: ["Location salle", "Équipements", "Pause café", "WiFi"],
    prix: "À partir de 150 000 FCFA",
  },
  {
    nom: "Journée complète",
    description: "Pour vos séminaires et formations",
    inclus: ["Location salle", "Équipements", "2 pauses café", "Déjeuner", "WiFi"],
    prix: "À partir de 300 000 FCFA",
  },
  {
    nom: "Résidentiel",
    description: "Séminaire avec hébergement",
    inclus: ["Location salle", "Équipements", "Pauses", "Repas", "Hébergement"],
    prix: "Sur devis",
  },
];

export default function ConferencesPage() {
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
              <Presentation className="mr-2 h-3 w-3" />
              Conférences & Séminaires
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              L&apos;excellence pour vos événements pro
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Des espaces modernes et équipés pour vos réunions, séminaires
              et conférences dans un cadre inspirant.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Salles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Nos Salles
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Des espaces adaptés à vos besoins
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Trois salles de différentes capacités pour tous types d&apos;événements
              professionnels.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {salles.map((salle, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card className="h-full hover:shadow-luxury transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-4">
                        {salle.nom}
                      </h3>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{salle.capacite}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{salle.superficie}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Configurations</p>
                        <div className="flex flex-wrap gap-1">
                          {salle.configuration.map((config, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {config}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Équipements</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {salle.equipements.map((eq, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary" />
                              {eq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Équipements */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Équipements high-tech
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {equipements.map((eq, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-3"
                    whileHover={{ rotate: 10 }}
                  >
                    <eq.icon className="h-8 w-8" />
                  </motion.div>
                  <p className="font-medium">{eq.nom}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Formules */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Coffee className="mr-2 h-3 w-3" />
              Nos Formules
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Des forfaits clé en main
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {formules.map((formule, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card className={`h-full hover:shadow-luxury transition-all ${index === 1 ? 'border-primary' : ''}`}>
                    <CardContent className="p-6">
                      {index === 1 && (
                        <Badge className="mb-4 bg-primary">Populaire</Badge>
                      )}
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        {formule.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {formule.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {formule.inclus.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-lg font-bold text-primary">
                        {formule.prix}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Organisez votre prochain séminaire
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Notre équipe vous accompagne pour faire de votre événement
              professionnel une réussite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="/contact">
                  Demander un devis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="tel:+2250700000000">
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </a>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
