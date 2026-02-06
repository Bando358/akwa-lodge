"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Star,
  Waves,
  UtensilsCrossed,
  Palmtree,
  Phone,
  Calendar,
  Sparkles,
  Umbrella,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

// Type pour les images de bannière
type BannerImage = {
  id: string;
  url: string;
  alt: string | null;
};

// Type pour les chambres vedettes
type FeaturedRoom = {
  id: string;
  nom: string;
  slug: string;
  type: string;
  descriptionCourte: string;
  prix: number;
  capacite: number;
  superficie: number | null;
  images: string[];
  isFeatured: boolean;
};

// Type pour les images intro
type IntroImage = {
  url: string;
  alt: string;
};

interface HomePageClientProps {
  initialBannerImages: BannerImage[];
  featuredRooms: FeaturedRoom[];
  introImages: IntroImage[];
}

// Composant diaporama pour les cartes de chambres
function RoomImageSlideshow({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Palmtree className="h-16 w-16 text-primary/30" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Image
            src={images[currentIndex]}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
          {images.map((_, index) => (
            <span
              key={index}
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Services phares
const services = [
  {
    icon: UtensilsCrossed,
    title: "Restaurant Gastronomique",
    description:
      "Savourez une cuisine raffinée mêlant saveurs locales et internationales.",
  },
  {
    icon: Waves,
    title: "Piscine Infinity",
    description:
      "Détendez-vous dans notre piscine à débordement avec vue sur la mer.",
  },
  {
    icon: Umbrella,
    title: "Plage Privée",
    description:
      "Profitez de notre plage de sable fin équipée de transats et parasols.",
  },
  {
    icon: Wine,
    title: "Bar Lounge",
    description:
      "Dégustez cocktails et vins fins dans une ambiance décontractée.",
  },
];

// Témoignages
const testimonials = [
  {
    id: "1",
    nom: "Marie-Claire Konan",
    pays: "Côte d'Ivoire",
    texte:
      "Un séjour inoubliable ! Le cadre est magnifique, le personnel aux petits soins. Je recommande vivement.",
    note: 5,
  },
  {
    id: "2",
    nom: "Jean-Pierre Dubois",
    pays: "France",
    texte:
      "Nous avons célébré notre anniversaire de mariage ici. Un moment magique dans un endroit paradisiaque.",
    note: 5,
  },
  {
    id: "3",
    nom: "Amadou Diallo",
    pays: "Sénégal",
    texte:
      "Parfait pour les affaires comme pour le repos. Les salles de conférence sont excellentes.",
    note: 5,
  },
];

// Variants pour les animations hero
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function HomePageClient({
  initialBannerImages,
  featuredRooms,
  introImages,
}: HomePageClientProps) {
  // Les images sont déjà mélangées côté serveur
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [introImageIndex, setIntroImageIndex] = useState(0);

  // Rotation automatique des images hero toutes les 20 secondes
  useEffect(() => {
    if (initialBannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % initialBannerImages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [initialBannerImages.length]);

  // Rotation automatique des images intro toutes les 20 secondes
  useEffect(() => {
    if (introImages.length <= 1) return;

    const interval = setInterval(() => {
      setIntroImageIndex((prev) => (prev + 1) % introImages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [introImages.length]);

  // Image courante
  const currentImage = initialBannerImages[currentImageIndex];

  return (
    <>
      {/* Hero Section avec animation d'entrée */}
      <section className="relative h-[100svh] min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Banner avec transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage?.id || "fallback"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {currentImage ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || "Akwa Luxury Lodge - Vue panoramique"}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            ) : (
              <Image
                src="/images/hero-banner.jpg"
                alt="Akwa Luxury Lodge - Vue panoramique sur la mer"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            )}
            {/* Fallback gradient uniquement si pas d'image */}
            {!currentImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-accent/50" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de slide (si plusieurs images) */}
        {initialBannerImages.length > 1 && (
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {initialBannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white w-6 sm:w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Voir image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Overlay gradient élégant pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Content avec animation */}
        <motion.div
          className="relative z-10 container mx-auto px-4 text-center text-white"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroItemVariants}>
            <Badge
              variant="outline"
              className="mb-6 border-secondary/40 text-secondary bg-black/20 backdrop-blur-sm tracking-wider uppercase text-xs"
            >
              <Sparkles className="mr-2 h-3 w-3" />
              Jacqueville - Sassako-Bégnini
            </Badge>
          </motion.div>

          <motion.h1
            variants={heroItemVariants}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Un havre de paix
            <br />
            <span className="text-secondary">au bord de la mer</span>
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 font-light tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            Découvrez l&apos;élégance naturelle d&apos;Akwa Luxury Lodge. Entre
            mer et cocoteraies, vivez une expérience unique où luxe et
            authenticité se rencontrent.
          </motion.p>

          <motion.div
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 shadow-lg"
            >
              <Link href="/reservation">
                Réserver maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white text-lg px-8 shadow-lg"
            >
              <Link href="/hebergement">Découvrir nos chambres</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator animé */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-3 bg-white/70 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
            <ScrollReveal variant="fadeRight">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Palmtree className="mr-2 h-3 w-3" />
                  Bienvenue
                </Badge>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                  L&apos;excellence hôtelière
                  <br />
                  <span className="text-primary">au cœur de la nature</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Niché au bord de la mer de Jacqueville, Akwa Luxury Lodge vous
                  accueille dans un écrin de verdure où le luxe rencontre
                  l&apos;authenticité africaine. Notre établissement offre une
                  expérience unique alliant confort moderne et traditions
                  locales.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Que vous veniez pour des vacances en famille, une escapade
                  romantique ou un événement professionnel, notre équipe dévouée
                  veillera à faire de votre séjour un moment inoubliable.
                </p>
                <Button asChild>
                  <Link href="/contact">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeLeft" delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  {/* Palmtree toujours visible en fond pendant les transitions */}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Palmtree className="h-24 w-24 text-primary/30" />
                  </div>
                  {introImages.length > 0 && (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={introImageIndex}
                          className="absolute inset-0 z-1"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        >
                          <Image
                            src={introImages[introImageIndex].url}
                            alt={introImages[introImageIndex].alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </motion.div>
                      </AnimatePresence>
                      {introImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                          {introImages.map((_, index) => (
                            <span
                              key={index}
                              className={`block h-2 rounded-full transition-all duration-300 ${
                                index === introImageIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50 w-2"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* Stats overlay avec animation */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-primary z-10 text-primary-foreground rounded-xl p-6 shadow-luxury"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="text-3xl font-bold text-secondary">15+</div>
                  <div className="text-sm text-primary-foreground/80">
                    Années d&apos;excellence
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Nos Services
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Une expérience complète
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Profitez de nos nombreux services et équipements pour un séjour
              parfait
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <StaggerItem key={index}>
                <Card className="group hover:shadow-luxury transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <service.icon className="h-7 w-7" />
                    </motion.div>
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="text-center mt-10" delay={0.4}>
            <Button asChild variant="outline">
              <Link href="/activites">
                Voir tous nos services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Chambres Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-8 sm:mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4">
              Hébergement
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nos chambres d&apos;exception
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Des espaces élégants conçus pour votre confort et votre bien-être
            </p>
          </ScrollReveal>

          {featuredRooms.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredRooms.map((room) => (
                <StaggerItem key={room.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 h-full">
                      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        <RoomImageSlideshow
                          images={room.images}
                          alt={room.nom}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-primary backdrop-blur-sm"
                          >
                            {room.type}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-secondary text-secondary-foreground">
                            <Star className="mr-1 h-3 w-3" />
                            Vedette
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {room.nom}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {room.descriptionCourte}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              {new Intl.NumberFormat("fr-FR").format(room.prix)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {" "}
                              FCFA / nuit
                            </span>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/hebergement/${room.slug}`}>Voir</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <Palmtree className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Découvrez bientôt notre sélection de chambres d&apos;exception
              </p>
            </div>
          )}

          <ScrollReveal className="text-center mt-10" delay={0.3}>
            <Button asChild>
              <Link href="/hebergement">
                Voir toutes nos chambres
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-secondary/50 text-secondary"
            >
              Témoignages
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id} variant="scale">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-white/10 border-white/20 text-primary-foreground h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.note }).map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Star className="h-5 w-5 fill-secondary text-secondary" />
                            </motion.div>
                          ),
                        )}
                      </div>
                      <p className="text-primary-foreground/90 mb-6 italic">
                        &quot;{testimonial.texte}&quot;
                      </p>
                      <div>
                        <div className="font-semibold">{testimonial.nom}</div>
                        <div className="text-sm text-primary-foreground/70">
                          {testimonial.pays}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="scale">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-accent p-6 sm:p-8 md:p-12 lg:p-20 text-center text-white">
              <motion.div
                className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10">
                <motion.h2
                  className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Prêt pour une expérience
                  <br />
                  <span className="text-secondary">inoubliable ?</span>
                </motion.h2>
                <motion.p
                  className="max-w-2xl mx-auto text-base sm:text-lg text-white/90 mb-6 sm:mb-8 md:mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Réservez dès maintenant votre séjour à Akwa Luxury Lodge et
                  laissez-vous envoûter par la magie de Jacqueville.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8"
                  >
                    <Link href="/reservation">
                      <Calendar className="mr-2 h-5 w-5" />
                      Réserver maintenant
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white text-lg px-8"
                  >
                    <Link href="/contact">
                      <Phone className="mr-2 h-5 w-5" />
                      Nous contacter
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
