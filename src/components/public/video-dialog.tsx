"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoDialogProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  backgroundImages?: string[];
}

export function VideoDialog({ videoUrl, isOpen, onClose, title, backgroundImages }: VideoDialogProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Détecter si c'est une URL YouTube
  const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  // Extraire l'ID YouTube
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay bloqué, l'utilisateur devra cliquer
      });
    }
  }, [isOpen]);

  // Diaporama arrière-plan toutes les 20 secondes
  useEffect(() => {
    if (!isOpen || !backgroundImages || backgroundImages.length <= 1) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [isOpen, backgroundImages]);

  // Reset bg index quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen) setBgIndex(0);
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop avec images en arrière-plan */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {backgroundImages && backgroundImages.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bgIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  >
                    <Image
                      src={backgroundImages[bgIndex]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Overlay sombre pour la lisibilité */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              </>
            ) : (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            )}
          </motion.div>

          {/* Dialog Content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {title && (
                <motion.h2
                  className="text-white font-serif text-xl sm:text-2xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h2>
              )}
              <div className="flex items-center gap-2 ml-auto">
                {!isYouTube && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Video Container */}
            <motion.div
              className="relative rounded-xl overflow-hidden bg-black shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isYouTube && youtubeId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0`}
                    title={title || "Vidéo de présentation"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full aspect-video object-cover"
                  controls
                  muted={isMuted}
                  playsInline
                  autoPlay
                />
              )}
            </motion.div>

            {/* Skip Button */}
            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
                onClick={onClose}
              >
                Passer la vidéo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
