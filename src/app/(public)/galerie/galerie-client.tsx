"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  UtensilsCrossed,
  Waves,
  PartyPopper,
  Palmtree,
  ImageIcon,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ScrollReveal,
  HeroContent,
  HeroItem,
} from "@/components/animations";

// Type pour une image
type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  titre: string | null;
  categorie: string | null;
};

// Définition des catégories avec leurs icônes
const categoryIcons: Record<string, LucideIcon> = {
  chambres: BedDouble,
  hebergement: BedDouble,
  restaurant: UtensilsCrossed,
  restauration: UtensilsCrossed,
  piscine: Waves,
  plage: Waves,
  evenements: PartyPopper,
  evenement: PartyPopper,
  nature: Palmtree,
  exterieur: Palmtree,
  jardin: Palmtree,
};

interface GalerieClientProps {
  images: GalleryImage[];
  categories: string[];
}

export function GalerieClient({ images, categories }: GalerieClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filtrer les images par catégorie
  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.categorie === activeCategory);

  // Ouvrir la lightbox
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Fermer la lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Image suivante
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  // Image précédente
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  }, [filteredImages.length]);

  // Gestion des touches clavier pour la lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Empêcher le scroll quand la lightbox est ouverte
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  // Obtenir l'icône pour une catégorie
  const getCategoryIcon = (category: string): LucideIcon => {
    const lowerCategory = category.toLowerCase();
    return categoryIcons[lowerCategory] || Camera;
  };

  // Créer la liste des catégories avec "Tout" en premier
  const allCategories = [
    { id: "all", label: "Tout", icon: Camera },
    ...categories.map((cat) => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: getCategoryIcon(cat),
    })),
  ];

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
              <Camera className="mr-2 h-3 w-3" />
              Galerie
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Découvrez notre univers
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              Explorez Akwa Luxury Lodge à travers nos photos et laissez-vous
              séduire par la beauté de notre établissement.
            </p>
          </HeroItem>
        </HeroContent>
      </section>

      {/* Filtres */}
      {categories.length > 0 && (
        <section className="py-8 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grille d'images */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {images.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-muted"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || image.titre || "Image galerie"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        {(image.titre || image.alt) && (
                          <p className="text-sm font-medium line-clamp-2">
                            {image.titre || image.alt}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Galerie en préparation</h3>
              <p className="text-muted-foreground mb-6">
                Notre collection de photos sera bientôt disponible.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          )}

          {images.length > 0 && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Aucune image dans cette catégorie
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Bouton fermer */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Bouton précédent */}
            {filteredImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Bouton suivant */}
            {filteredImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[currentImageIndex]?.url || ""}
                alt={
                  filteredImages[currentImageIndex]?.alt ||
                  filteredImages[currentImageIndex]?.titre ||
                  "Image"
                }
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />

              {/* Informations sur l'image */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                {(filteredImages[currentImageIndex]?.titre ||
                  filteredImages[currentImageIndex]?.alt) && (
                  <p className="text-lg font-medium mb-1">
                    {filteredImages[currentImageIndex]?.titre ||
                      filteredImages[currentImageIndex]?.alt}
                  </p>
                )}
                <p className="text-sm text-white/70">
                  {currentImageIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Envie de vivre l&apos;expérience ?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Réservez votre séjour et créez vos propres souvenirs à Akwa Luxury
              Lodge.
            </p>
            <Button asChild>
              <Link href="/reservation">Réserver maintenant</Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
