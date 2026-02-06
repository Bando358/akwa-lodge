"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedImage {
  url: string;
  name?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  endpoint?: "chambreImage" | "galerieImage" | "generalImage";
  className?: string;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  endpoint = "chambreImage",
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Images existantes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={image.url}
                  alt={image.name || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                  {index + 1} / {images.length}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Zone d'upload */}
      {canUploadMore && (
        <div className="relative">
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Upload en cours...</span>
              </div>
            </div>
          )}

          <UploadDropzone
            endpoint={endpoint}
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res) {
                const newImages = res.map((file) => ({
                  url: file.url,
                  name: file.name,
                }));
                onImagesChange([...images, ...newImages].slice(0, maxImages));
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              console.error("Erreur upload:", error);
              alert(`Erreur: ${error.message}`);
            }}
            appearance={{
              container: "border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors",
              uploadIcon: "text-primary",
              label: "text-foreground",
              allowedContent: "text-muted-foreground text-sm",
              button: "bg-primary text-primary-foreground hover:bg-primary/90 ut-uploading:bg-primary/70",
            }}
            content={{
              label: "Glissez vos images ici ou cliquez pour sélectionner",
              allowedContent: `Images uniquement (max ${maxImages - images.length} restantes)`,
            }}
          />
        </div>
      )}

      {/* Message si max atteint */}
      {!canUploadMore && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 bg-muted rounded-lg">
          <ImageIcon className="h-4 w-4" />
          <span>Nombre maximum d&apos;images atteint ({maxImages})</span>
        </div>
      )}
    </div>
  );
}
