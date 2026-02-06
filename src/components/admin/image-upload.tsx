"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Upload,
  X,
  Loader2,
  ImagePlus,
  Film,
  FileImage,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  acceptVideo?: boolean;
  showPreview?: boolean;
  previewClassName?: string;
  maxImageSize?: number; // en MB
  maxVideoSize?: number; // en MB
  endpoint?: "chambreImage" | "galerieImage" | "generalImage";
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  disabled = false,
  className,
  acceptVideo = false,
  showPreview = true,
  previewClassName,
  maxImageSize = 10,
  maxVideoSize = 50,
  endpoint = "generalImage",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Normaliser la valeur en tableau
  const files = Array.isArray(value) ? value : value ? [value] : [];

  // Hook Uploadthing
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res) {
        const urls = res.map((file) => file.ufsUrl || file.url);

        if (multiple) {
          onChange([...files, ...urls]);
        } else {
          onChange(urls[0]);
        }

        toast.success(
          `${res.length} fichier${res.length > 1 ? "s" : ""} upload${res.length > 1 ? "s" : ""} avec succs`
        );
      }
      setIsUploading(false);
      setUploadProgress(100);
    },
    onUploadError: (error) => {
      setError(error.message);
      toast.error(`Erreur: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await startUpload(filesToUpload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'upload";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [startUpload]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      setError(null);

      // Limiter le nombre de fichiers
      const filesToUpload = acceptedFiles.slice(
        0,
        multiple ? maxFiles - files.length : 1
      );

      if (filesToUpload.length === 0) {
        toast.error("Nombre maximum de fichiers atteint");
        return;
      }

      // Vrifier les tailles
      const validFiles = filesToUpload.filter((file) => {
        const isVideo = file.type.startsWith("video/");
        const maxSize = (isVideo ? maxVideoSize : maxImageSize) * 1024 * 1024;

        if (file.size > maxSize) {
          toast.error(
            `${file.name} est trop volumineux (max ${isVideo ? maxVideoSize : maxImageSize}MB)`
          );
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        await uploadFiles(validFiles);
      }
    },
    [disabled, files.length, maxFiles, multiple, maxImageSize, maxVideoSize, uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptVideo
      ? {
          "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
          "video/*": [".mp4", ".webm", ".mov", ".avi"],
        }
      : {
          "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
        },
    maxFiles: multiple ? maxFiles - files.length : 1,
    disabled: disabled || isUploading || (multiple && files.length >= maxFiles),
    multiple,
  });

  const removeFile = (urlToRemove: string) => {
    // Note: Uploadthing ne supporte pas la suppression ct client
    // Les fichiers restent sur Uploadthing mais sont retirs de l'interface
    if (multiple) {
      onChange(files.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de drop */}
      {(multiple ? files.length < maxFiles : files.length === 0) && (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "pointer-events-none"
          )}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                {acceptVideo ? (
                  <div className="flex gap-1">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <Film className="h-6 w-6 text-muted-foreground" />
                  </div>
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="text-center">
                <p className="font-medium">
                  {isDragActive
                    ? "Dposez les fichiers ici"
                    : "Glissez-dposez ou cliquez pour slectionner"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {acceptVideo
                    ? `Images (max ${maxImageSize}MB) ou Vidos (max ${maxVideoSize}MB)`
                    : `PNG, JPG, GIF, WebP, SVG (max ${maxImageSize}MB)`}
                </p>
                {multiple && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {maxFiles} fichiers ({files.length}/{maxFiles})
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
              >
                <Upload className="mr-2 h-4 w-4" />
                Slectionner
              </Button>
            </>
          )}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Prvisualisation des fichiers */}
      {showPreview && files.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1",
            previewClassName
          )}
        >
          {files.map((url, index) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border bg-muted aspect-video"
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              ) : (
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}

              {/* Overlay avec bouton supprimer */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(url)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Badge type fichier */}
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {isVideo(url) ? (
                    <>
                      <Film className="h-3 w-3" />
                      Vido
                    </>
                  ) : (
                    <>
                      <FileImage className="h-3 w-3" />
                      Image
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant simplifi pour upload unique avec aperu
interface SingleImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  acceptVideo?: boolean;
  endpoint?: "chambreImage" | "galerieImage" | "generalImage";
}

export function SingleImageUpload({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Ajouter une image",
  acceptVideo = false,
  endpoint = "generalImage",
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].ufsUrl || res[0].url);
        toast.success("Fichier upload avec succs");
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      await startUpload([file]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'upload";
      toast.error(errorMessage);
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  };

  if (value) {
    return (
      <div className={cn("relative group rounded-lg overflow-hidden border", className)}>
        <div className="aspect-video relative">
          {isVideo(value) ? (
            <video
              src={value}
              className="w-full h-full object-cover"
              controls
              muted
            />
          ) : (
            <Image
              src={value}
              alt="Image uploade"
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <label className="cursor-pointer">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              asChild
              disabled={disabled}
            >
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Remplacer
              </span>
            </Button>
            <input
              type="file"
              className="hidden"
              accept={acceptVideo ? "image/*,video/*" : "image/*"}
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isUploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : (
        <>
          {acceptVideo ? (
            <div className="flex gap-2">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        </>
      )}
      <input
        type="file"
        className="hidden"
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </label>
  );
}

export default ImageUpload;
