"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import { InteractiveMap } from "@/components/public/google-map";
import {
  HeroContent,
  HeroItem,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

const contactInfo = [
  {
    icon: Phone,
    title: "Téléphone",
    content: "+225 07 00 04 80 97",
    href: "tel:+2250700048097",
  },
  {
    icon: Mail,
    title: "Email",
    content: "Contact@akwaluxurylodge.com",
    href: "mailto:Contact@akwaluxurylodge.com",
  },
  {
    icon: MapPin,
    title: "Adresse",
    content: "Jacqueville - Sassako-Bégnini\nCôte d'Ivoire",
    href: null,
  },
  {
    icon: Clock,
    title: "Réception",
    content: "Ouverte 24h/24, 7j/7",
    href: null,
  },
];

export function ContactClient() {
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
              <Mail className="mr-2 h-3 w-3" />
              Contact
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Contactez-nous
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Notre équipe est à votre écoute pour répondre à toutes vos questions
              et vous accompagner dans l&apos;organisation de votre séjour.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Contact Section */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Informations de contact */}
            <ScrollReveal variant="fadeRight">
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-2">
                    Nos coordonnées
                  </h2>
                  <p className="text-muted-foreground">
                    N&apos;hésitez pas à nous contacter par téléphone, email ou à
                    nous rendre visite.
                  </p>
                </div>

                <StaggerContainer className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <StaggerItem key={index}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex items-start gap-4">
                            <motion.div
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <item.icon className="h-5 w-5" />
                            </motion.div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              {item.href ? (
                                <a
                                  href={item.href}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {item.content}
                                </a>
                              ) : (
                                <p className="text-muted-foreground whitespace-pre-line">
                                  {item.content}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Carte interactive Google Maps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="overflow-hidden">
                    <InteractiveMap height="aspect-video" />
                  </Card>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Formulaire de contact */}
            <ScrollReveal variant="fadeLeft" delay={0.2} className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="font-serif text-2xl font-bold mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-muted-foreground">
                      Remplissez le formulaire ci-dessous et nous vous
                      répondrons dans les plus brefs délais.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <ContactForm />
                  </motion.div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
