"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  Users,
  Maximize,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoDialog } from "@/components/public/video-dialog";

interface ChambreImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface Chambre {
  id: string;
  nom: string;
  slug: string;
  type: string;
  description: string;
  descriptionCourte: string;
  videoUrl?: string | null;
  prix: number;
  prixWeekend?: number | null;
  capacite: number;
  superficie?: number | null;
  nombreLits: number;
  typeLit?: string | null;
  vue?: string | null;
  equipements: string[];
  caracteristiques: string[];
  images: ChambreImage[];
}

interface ChambreDetailClientProps {
  chambre: Chambre;
}

export function ChambreDetailClient({ chambre }: ChambreDetailClientProps) {
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hasSeenVideo, setHasSeenVideo] = useState(false);

  // Afficher le dialog vidéo au chargement si une vidéo existe
  useEffect(() => {
    if (chambre.videoUrl && !hasSeenVideo) {
      // Petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        setShowVideoDialog(true);
        setHasSeenVideo(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [chambre.videoUrl, hasSeenVideo]);

  const handleCloseVideoDialog = () => {
    setShowVideoDialog(false);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % chambre.images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? chambre.images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  // Navigation clavier pour le lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <>
      {/* Video Dialog */}
      {chambre.videoUrl && (
        <VideoDialog
          videoUrl={chambre.videoUrl}
          isOpen={showVideoDialog}
          onClose={handleCloseVideoDialog}
          title={`Découvrez nos ${chambre.type}s`}
        />
      )}

      {/* Header / Hero */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/hebergement"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux hébergements
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-secondary text-secondary-foreground">
                {chambre.type}
              </Badge>
              {chambre.vue && (
                <Badge variant="outline" className="text-white border-white/30">
                  <Eye className="mr-1 h-3 w-3" />
                  {chambre.vue}
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {chambre.nom}
            </h1>

            <p className="text-white/90 text-lg max-w-2xl mb-6">
              {chambre.descriptionCourte}
            </p>

            {/* Caractéristiques rapides */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{chambre.capacite} personnes</span>
              </div>
              {chambre.superficie && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5" />
                  <span>{chambre.superficie} m²</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                <span>
                  {chambre.nombreLits} lit{chambre.nombreLits > 1 ? "s" : ""}
                  {chambre.typeLit && ` (${chambre.typeLit})`}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Galerie Photos
            </h2>
            {chambre.videoUrl && (
              <Button
                variant="outline"
                onClick={() => setShowVideoDialog(true)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Voir la vidéo
              </Button>
            )}
          </div>

          {chambre.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {chambre.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || chambre.nom}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="bg-white/90 rounded-full p-3">
                        <Maximize className="h-5 w-5 text-primary" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-xl">
              <BedDouble className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Aucune photo disponible pour le moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Description et Équipements */}
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6">
                Description
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="whitespace-pre-line">{chambre.description}</p>
              </div>
            </motion.div>

            {/* Équipements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6">
                Équipements
              </h2>
              {chambre.equipements.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chambre.equipements.map((equipement, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3 text-muted-foreground"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span>{equipement}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  Informations sur les équipements à venir
                </p>
              )}

              {/* Caractéristiques */}
              {chambre.caracteristiques.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-serif text-xl font-bold text-primary mb-4">
                    Caractéristiques
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {chambre.caracteristiques.map((caract, index) => (
                      <Badge key={index} variant="secondary">
                        {caract}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prix et CTA */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-primary rounded-2xl p-6 sm:p-8 lg:p-10 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                  Réservez cette chambre
                </h2>
                <p className="text-white/80">
                  Profitez d&apos;un séjour inoubliable dans notre {chambre.type.toLowerCase()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold">
                    {new Intl.NumberFormat("fr-FR").format(chambre.prix)}
                    <span className="text-lg font-normal text-white/80"> FCFA</span>
                  </div>
                  <div className="text-white/60 text-sm">par nuit</div>
                  {chambre.prixWeekend && (
                    <div className="text-white/80 text-sm mt-1">
                      Week-end: {new Intl.NumberFormat("fr-FR").format(chambre.prixWeekend)} FCFA
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href={`/reservation?chambre=${chambre.slug}`}>
                    Réserver maintenant
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white/80 text-sm">
              {selectedImageIndex + 1} / {chambre.images.length}
            </div>

            {/* Navigation Buttons */}
            {chambre.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <Image
                src={chambre.images[selectedImageIndex].url}
                alt={chambre.images[selectedImageIndex].alt || chambre.nom}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Thumbnails */}
            {chambre.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2">
                {chambre.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all ${
                      index === selectedImageIndex
                        ? "ring-2 ring-secondary scale-110"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
