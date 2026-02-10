"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, Tag } from "lucide-react";
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

interface AnnonceCardProps {
  annonce: Annonce;
  variant?: "card" | "banner" | "popup";
  onClose?: () => void;
  className?: string;
}

export function AnnonceCard({
  annonce,
  variant = "card",
  onClose,
  className,
}: AnnonceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Style personnalisé
  const customStyle = {
    backgroundColor: annonce.couleurFond || undefined,
    color: annonce.couleurTexte || undefined,
  };

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

  // Auto-play vidéo
  useEffect(() => {
    if (annonce.mediaType === "VIDEO" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [annonce.mediaType]);

  const content = (
    <>
      {/* Media */}
      {annonce.mediaType === "IMAGE" && annonce.mediaUrl && (
        <div className={cn(
          "relative overflow-hidden",
          variant === "card" ? "h-48" : "h-32"
        )}>
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
        <div className={cn(
          "relative overflow-hidden",
          variant === "card" ? "h-48" : "h-32"
        )}>
          <video
            ref={videoRef}
            src={annonce.mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {annonce.promotion && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-lg font-bold">
              {formatPromoValue(annonce.promotion)}
            </Badge>
          )}
        </div>
      )}

      {/* Contenu texte */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold">{annonce.titre}</h3>
          {variant === "popup" && onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {annonce.description && (
          <p className="text-sm opacity-80 line-clamp-3">{annonce.description}</p>
        )}

        {/* Promo badge si pas d'image */}
        {annonce.mediaType === "TEXT" && annonce.promotion && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg font-bold">
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

        {/* Code promo visible */}
        {annonce.promotion?.codePromo && annonce.mediaType !== "TEXT" && (
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">Code:</span>
            <code className="bg-background/20 px-2 py-1 rounded font-mono text-sm font-bold">
              {annonce.promotion.codePromo}
            </code>
          </div>
        )}

        {/* Bouton CTA */}
        {annonce.lien && (
          <Button
            asChild
            variant={variant === "popup" ? "default" : "secondary"}
            className="w-full"
          >
            <Link href={annonce.lien} target="_blank">
              {annonce.boutonTexte || "En savoir plus"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </>
  );

  if (variant === "popup") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden w-[calc(100%-2rem)] sm:w-full max-w-md mx-4 sm:mx-0",
          className
        )}
        style={customStyle}
      >
        {content}
      </motion.div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-primary text-primary-foreground",
          className
        )}
        style={customStyle}
      >
        <div className="container mx-auto px-3 py-1.5 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {annonce.mediaType === "IMAGE" && annonce.mediaUrl && (
                <div className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={annonce.mediaUrl}
                    alt={annonce.titre}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-bold text-xs sm:text-base truncate min-w-0 flex-1">{annonce.titre}</p>
              {annonce.promotion && (
                <Badge variant="secondary" className="text-xs sm:text-lg font-bold shrink-0">
                  {formatPromoValue(annonce.promotion)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {annonce.promotion?.codePromo && (
                <code className="bg-background/20 px-2 py-1 rounded font-mono text-xs sm:text-sm hidden sm:block">
                  {annonce.promotion.codePromo}
                </code>
              )}
              {annonce.lien && (
                <Button variant="secondary" size="sm" asChild className="h-7 text-[10px] px-2 sm:h-9 sm:text-sm sm:px-3">
                  <Link href={annonce.lien} target="_blank">
                    {annonce.boutonTexte || "Voir"}
                  </Link>
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8" onClick={onClose}>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card par défaut
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow",
        className
      )}
      style={customStyle}
    >
      {content}
    </motion.div>
  );
}

// Composant Carousel pour plusieurs annonces
interface AnnoncesCarouselProps {
  annonces: Annonce[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function AnnoncesCarousel({
  annonces,
  autoPlay = true,
  interval = 5000,
  className,
}: AnnoncesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || annonces.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % annonces.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, annonces.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + annonces.length) % annonces.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % annonces.length);
  };

  if (annonces.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        <AnnonceCard
          key={annonces[currentIndex].id}
          annonce={annonces[currentIndex]}
          variant="card"
        />
      </AnimatePresence>

      {annonces.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Indicateurs */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {annonces.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-primary" : "bg-primary/30"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Popup d'annonce
interface AnnoncePopupProps {
  annonce: Annonce | null;
  onClose: () => void;
}

export function AnnoncePopup({ annonce, onClose }: AnnoncePopupProps) {
  if (!annonce) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <AnnonceCard annonce={annonce} variant="popup" onClose={onClose} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
