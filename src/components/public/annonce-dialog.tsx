"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Promotion = {
  id: string;
  nom: string;
  type: string;
  valeur: number;
  codePromo: string | null;
  cible: string;
};

type Annonce = {
  id: string;
  titre: string;
  description: string | null;
  mediaType: "TEXT" | "IMAGE" | "VIDEO";
  mediaUrl: string | null;
  mediaDuration: number | null;
  lien: string | null;
  boutonTexte: string | null;
  couleurFond: string | null;
  couleurTexte: string | null;
  isPinned: boolean;
  promotion: Promotion | null;
};

interface AnnonceDialogProps {
  annonces: Annonce[];
  /** Clé unique pour mémoriser le dismiss par page (ex: "ACCUEIL", "HEBERGEMENT") */
  storageKey: string;
  /** Délai avant l'ouverture automatique (ms) */
  delay?: number;
}

export function AnnonceDialog({
  annonces,
  storageKey,
  delay = 800,
}: AnnonceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-ouverture après un délai (1x par session par page)
  useEffect(() => {
    if (annonces.length === 0) return;

    const key = `annonce-dismissed-${storageKey}`;
    const dismissed = sessionStorage.getItem(key);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [annonces.length, storageKey, delay]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Auto-play vidéo quand l'annonce change
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, currentIndex]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`annonce-dismissed-${storageKey}`, "true");
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + annonces.length) % annonces.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % annonces.length);
  };

  if (annonces.length === 0) return null;

  const annonce = annonces[currentIndex];

  const formatPromoValue = (promo: Promotion) => {
    switch (promo.type) {
      case "POURCENTAGE":
        return `-${promo.valeur}%`;
      case "MONTANT_FIXE":
        return `-${promo.valeur.toLocaleString("fr-FR")} FCFA`;
      default:
        return promo.nom;
    }
  };

  const customStyle = {
    backgroundColor: annonce.couleurFond || undefined,
    color: annonce.couleurTexte || undefined,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Dialog Content */}
          <motion.div
            className="relative z-10 w-full max-w-lg mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Megaphone className="h-5 w-5 text-secondary" />
                <h2 className="text-white font-serif text-xl sm:text-2xl font-bold">
                  {annonces.length > 1
                    ? `Actualités (${currentIndex + 1}/${annonces.length})`
                    : "Actualité"}
                </h2>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Card */}
            <motion.div
              className="relative rounded-xl overflow-hidden bg-card text-card-foreground shadow-2xl"
              style={customStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Media */}
              {annonce.mediaType === "IMAGE" && annonce.mediaUrl && (
                <div className="relative h-56 sm:h-64">
                  <Image
                    src={annonce.mediaUrl}
                    alt={annonce.titre}
                    fill
                    className="object-cover"
                  />
                  {annonce.promotion && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-lg font-bold">
                      {formatPromoValue(annonce.promotion)}
                    </Badge>
                  )}
                </div>
              )}

              {annonce.mediaType === "VIDEO" && annonce.mediaUrl && (
                <div className="relative h-56 sm:h-64">
                  <video
                    ref={videoRef}
                    src={annonce.mediaUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  {annonce.promotion && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-lg font-bold">
                      {formatPromoValue(annonce.promotion)}
                    </Badge>
                  )}
                </div>
              )}

              {/* Text Content */}
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {annonce.titre}
                </h3>

                {annonce.description && (
                  <p className="text-sm sm:text-base opacity-80 leading-relaxed">
                    {annonce.description}
                  </p>
                )}

                {/* Promo badge (text-only annonces) */}
                {annonce.mediaType === "TEXT" && annonce.promotion && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-lg font-bold"
                    >
                      {formatPromoValue(annonce.promotion)}
                    </Badge>
                    {annonce.promotion.codePromo && (
                      <Badge variant="outline" className="font-mono">
                        <Tag className="h-3 w-3 mr-1" />
                        {annonce.promotion.codePromo}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Code promo (image/video annonces) */}
                {annonce.promotion?.codePromo &&
                  annonce.mediaType !== "TEXT" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-70">Code promo:</span>
                      <code className="bg-muted px-3 py-1 rounded font-mono text-sm font-bold">
                        {annonce.promotion.codePromo}
                      </code>
                    </div>
                  )}

                {/* CTA Button */}
                {annonce.lien && (
                  <Button asChild className="w-full">
                    <Link href={annonce.lien} target="_blank">
                      {annonce.boutonTexte || "En savoir plus"}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Navigation (si plusieurs annonces) */}
            {annonces.length > 1 && (
              <motion.div
                className="flex items-center justify-center gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={goToPrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {/* Dots */}
                <div className="flex gap-2">
                  {annonces.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all",
                        index === currentIndex
                          ? "bg-secondary scale-110"
                          : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Fermer button */}
            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
                onClick={handleClose}
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
