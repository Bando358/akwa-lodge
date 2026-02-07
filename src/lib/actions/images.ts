"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

// Validation personnalisée pour les URLs (accepte les URLs complètes et les chemins relatifs)
const urlOrPathSchema = z.string().refine(
  (val) => {
    // Accepte les URLs complètes (http:// ou https://)
    if (val.startsWith("http://") || val.startsWith("https://")) {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }
    // Accepte les chemins relatifs commençant par /uploads/
    if (val.startsWith("/uploads/")) {
      return true;
    }
    return false;
  },
  { message: "URL ou chemin invalide" }
);

// Schéma de validation pour les images
const imageSchema = z.object({
  url: urlOrPathSchema,
  alt: z.string().optional().nullable(),
  titre: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categorie: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  size: z.number().int().positive().optional().nullable(),
  format: z.string().optional().nullable(),
  ordre: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  chambreId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  evenementId: z.string().optional().nullable(),
});

type ImageInput = z.infer<typeof imageSchema>;

// Récupérer toutes les images
export async function getImages(options?: {
  categorie?: string;
  chambreId?: string;
  serviceId?: string;
  evenementId?: string;
  isFeatured?: boolean;
  limit?: number;
}) {
  try {
    const images = await prisma.image.findMany({
      where: {
        ...(options?.categorie && { categorie: options.categorie }),
        ...(options?.chambreId && { chambreId: options.chambreId }),
        ...(options?.serviceId && { serviceId: options.serviceId }),
        ...(options?.evenementId && { evenementId: options.evenementId }),
        ...(options?.isFeatured !== undefined && { isFeatured: options.isFeatured }),
      },
      include: {
        chambre: {
          select: { id: true, nom: true },
        },
        service: {
          select: { id: true, nom: true },
        },
        evenement: {
          select: { id: true, titre: true },
        },
      },
      orderBy: { ordre: "asc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: images };
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    return { success: false, error: "Erreur lors de la récupération des images" };
  }
}

// Récupérer une image par ID
export async function getImageById(id: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        chambre: true,
        service: true,
        evenement: true,
      },
    });

    if (!image) {
      return { success: false, error: "Image non trouvée" };
    }

    return { success: true, data: image };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error);
    return { success: false, error: "Erreur lors de la récupération de l'image" };
  }
}

// Créer une image
export async function createImage(data: ImageInput) {
  try {
    const validatedData = imageSchema.parse(data);

    const image = await prisma.image.create({
      data: validatedData,
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/"); // Revalidate homepage for banner images
    if (data.chambreId) {
      revalidatePath("/admin/chambres");
      revalidatePath("/hebergement");
    }
    if (data.serviceId) {
      revalidatePath("/admin/services");
    }
    if (data.evenementId) {
      revalidatePath("/admin/evenements");
    }
    logActivity({ action: "CREATE", entityType: "Image", entityId: image.id, description: "Image ajoutee" }).catch(() => {});

    return { success: true, data: image };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de l'image:", error);
    return { success: false, error: "Erreur lors de la création de l'image" };
  }
}

// Créer plusieurs images
export async function createImages(images: ImageInput[]) {
  try {
    const validatedImages = images.map((img) => imageSchema.parse(img));

    const createdImages = await prisma.image.createMany({
      data: validatedImages,
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/"); // Revalidate homepage for banner images
    logActivity({ action: "CREATE", entityType: "Image", description: "Lot d'images ajoutees (" + images.length + ")" }).catch(() => {});

    return { success: true, data: createdImages };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création des images:", error);
    return { success: false, error: "Erreur lors de la création des images" };
  }
}

// Mettre à jour une image
export async function updateImage(id: string, data: Partial<ImageInput>) {
  try {
    const existingImage = await prisma.image.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return { success: false, error: "Image non trouvée" };
    }

    const image = await prisma.image.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/"); // Revalidate homepage for banner images
    logActivity({ action: "UPDATE", entityType: "Image", entityId: id, description: "Image modifiee" }).catch(() => {});

    return { success: true, data: image };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error);
    return { success: false, error: "Erreur lors de la mise à jour de l'image" };
  }
}

// Supprimer une image
export async function deleteImage(id: string) {
  try {
    await prisma.image.delete({
      where: { id },
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/"); // Revalidate homepage
    logActivity({ action: "DELETE", entityType: "Image", entityId: id, description: "Image supprimee" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return { success: false, error: "Erreur lors de la suppression de l'image" };
  }
}

// Supprimer plusieurs images
export async function deleteImages(ids: string[]) {
  try {
    await prisma.image.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/"); // Revalidate homepage
    logActivity({ action: "DELETE", entityType: "Image", description: "Lot d'images supprimees (" + ids.length + ")" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression des images:", error);
    return { success: false, error: "Erreur lors de la suppression des images" };
  }
}

// Mettre en vedette une image
export async function toggleImageFeatured(id: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return { success: false, error: "Image non trouvée" };
    }

    const updatedImage = await prisma.image.update({
      where: { id },
      data: { isFeatured: !image.isFeatured },
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/");
    logActivity({ action: "TOGGLE", entityType: "Image", entityId: id, description: "Image " + (updatedImage.isFeatured ? "mise en vedette" : "retiree de la vedette") }).catch(() => {});

    return { success: true, data: updatedImage };
  } catch (error) {
    console.error("Erreur lors du changement de vedette:", error);
    return { success: false, error: "Erreur lors du changement de vedette" };
  }
}

// Réorganiser les images
export async function reorderImages(orderedIds: string[]) {
  try {
    const updates = orderedIds.map((id, index) =>
      prisma.image.update({
        where: { id },
        data: { ordre: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réorganisation:", error);
    return { success: false, error: "Erreur lors de la réorganisation" };
  }
}

// Récupérer les catégories d'images
export async function getImageCategories() {
  try {
    const categories = await prisma.image.findMany({
      where: {
        categorie: { not: null },
      },
      select: {
        categorie: true,
      },
      distinct: ["categorie"],
    });

    return {
      success: true,
      data: categories.map((c) => c.categorie).filter(Boolean) as string[],
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return { success: false, error: "Erreur lors de la récupération des catégories" };
  }
}

// Vérifier si une URL est valide (Uploadthing ou chemin local valide)
function isValidImageUrl(url: string): boolean {
  // URLs Uploadthing valides
  const uploadthingPatterns = [
    /^https:\/\/utfs\.io\//,
    /^https:\/\/.*\.ufs\.sh\//,
    /^https:\/\/.*\.uploadthing\.com\//,
    /^https:\/\/uploadthing\.com\//,
    /^https:\/\/uploadthing-prod\.s3\.us-west-2\.amazonaws\.com\//,
  ];

  // Vérifier si l'URL correspond à un pattern Uploadthing
  for (const pattern of uploadthingPatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // Les chemins locaux (/uploads/) ne sont plus valides en production
  // mais on les garde pour le développement local
  if (url.startsWith("/uploads/") && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

// Nettoyer les images avec des URLs invalides
export async function cleanupInvalidImages() {
  try {
    const allImages = await prisma.image.findMany({
      select: {
        id: true,
        url: true,
        categorie: true,
      },
    });

    const invalidImages = allImages.filter((img) => !isValidImageUrl(img.url));

    if (invalidImages.length === 0) {
      return {
        success: true,
        message: "Aucune image invalide trouvée",
        deletedCount: 0,
        invalidImages: []
      };
    }

    // Supprimer les images invalides
    await prisma.image.deleteMany({
      where: {
        id: { in: invalidImages.map((img) => img.id) },
      },
    });

    revalidatePath("/admin/galerie");
    revalidatePath("/galerie");
    revalidatePath("/");
    logActivity({ action: "DELETE", entityType: "Image", description: invalidImages.length + " image(s) invalide(s) nettoyee(s)" }).catch(() => {});

    return {
      success: true,
      message: `${invalidImages.length} image(s) invalide(s) supprimée(s)`,
      deletedCount: invalidImages.length,
      invalidImages: invalidImages.map((img) => ({ id: img.id, url: img.url, categorie: img.categorie }))
    };
  } catch (error) {
    console.error("Erreur lors du nettoyage des images:", error);
    return { success: false, error: "Erreur lors du nettoyage des images" };
  }
}

// Vérifier les images invalides sans les supprimer
export async function checkInvalidImages() {
  try {
    const allImages = await prisma.image.findMany({
      select: {
        id: true,
        url: true,
        categorie: true,
        titre: true,
      },
    });

    const invalidImages = allImages.filter((img) => !isValidImageUrl(img.url));
    const validImages = allImages.filter((img) => isValidImageUrl(img.url));

    return {
      success: true,
      data: {
        total: allImages.length,
        valid: validImages.length,
        invalid: invalidImages.length,
        invalidImages: invalidImages.map((img) => ({
          id: img.id,
          url: img.url,
          categorie: img.categorie,
          titre: img.titre
        }))
      }
    };
  } catch (error) {
    console.error("Erreur lors de la vérification des images:", error);
    return { success: false, error: "Erreur lors de la vérification des images" };
  }
}
