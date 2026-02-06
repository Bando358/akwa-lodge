"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { MediaType, AnnonceCible, AnnoncePosition } from "@prisma/client";

// Schéma de validation pour les annonces
const annonceSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  mediaType: z.nativeEnum(MediaType).default("TEXT"),
  mediaUrl: z.string().url().optional().nullable().or(z.literal("")),
  mediaDuration: z.number().int().min(1).max(10).optional().nullable(),
  lien: z.string().url().optional().nullable().or(z.literal("")),
  boutonTexte: z.string().optional().nullable(),
  cibleType: z.nativeEnum(AnnonceCible).default("GENERAL"),
  dateDebut: z.date(),
  dateFin: z.date(),
  position: z.nativeEnum(AnnoncePosition).default("ACCUEIL"),
  couleurFond: z.string().optional().nullable(),
  couleurTexte: z.string().optional().nullable(),
  ordre: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  promotionId: z.string().optional().nullable(),
});

type AnnonceInput = z.infer<typeof annonceSchema>;

// Récupérer toutes les annonces
export async function getAnnonces(options?: {
  isActive?: boolean;
  position?: AnnoncePosition;
  cibleType?: AnnonceCible;
  includePromotion?: boolean;
  activeOnly?: boolean; // Filtrer par date
}) {
  try {
    const now = new Date();

    const annonces = await prisma.annonce.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.position && { position: options.position }),
        ...(options?.cibleType && { cibleType: options.cibleType }),
        ...(options?.activeOnly && {
          dateDebut: { lte: now },
          dateFin: { gte: now },
          isActive: true,
        }),
      },
      include: options?.includePromotion
        ? {
            promotion: {
              select: {
                id: true,
                nom: true,
                type: true,
                valeur: true,
                codePromo: true,
              },
            },
          }
        : undefined,
      orderBy: [
        { isPinned: "desc" },
        { ordre: "asc" },
        { dateDebut: "desc" },
      ],
    });

    return { success: true, data: annonces };
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    return { success: false, error: "Erreur lors de la récupération des annonces" };
  }
}

// Récupérer une annonce par ID
export async function getAnnonceById(id: string) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id },
      include: {
        promotion: true,
      },
    });

    if (!annonce) {
      return { success: false, error: "Annonce non trouvée" };
    }

    return { success: true, data: annonce };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'annonce:", error);
    return { success: false, error: "Erreur lors de la récupération de l'annonce" };
  }
}

// Récupérer les annonces actives pour le site public
export async function getAnnoncesActives(position?: AnnoncePosition) {
  try {
    const now = new Date();

    const annonces = await prisma.annonce.findMany({
      where: {
        isActive: true,
        dateDebut: { lte: now },
        dateFin: { gte: now },
        ...(position && { position }),
      },
      include: {
        promotion: {
          select: {
            id: true,
            nom: true,
            type: true,
            valeur: true,
            codePromo: true,
            cible: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { ordre: "asc" },
      ],
    });

    return { success: true, data: annonces };
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces actives:", error);
    return { success: false, error: "Erreur lors de la récupération des annonces" };
  }
}

// Créer une annonce
export async function createAnnonce(data: AnnonceInput) {
  try {
    const validatedData = annonceSchema.parse(data);

    // Vérifier la durée vidéo si c'est une vidéo
    if (validatedData.mediaType === "VIDEO") {
      if (!validatedData.mediaDuration || validatedData.mediaDuration < 3 || validatedData.mediaDuration > 5) {
        return { success: false, error: "La durée de la vidéo doit être entre 3 et 5 secondes" };
      }
    }

    const annonce = await prisma.annonce.create({
      data: {
        ...validatedData,
        mediaUrl: validatedData.mediaUrl || null,
        lien: validatedData.lien || null,
        promotionId: validatedData.promotionId || null,
      },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/");

    return { success: true, data: annonce };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de l'annonce:", error);
    return { success: false, error: "Erreur lors de la création de l'annonce" };
  }
}

// Mettre à jour une annonce
export async function updateAnnonce(id: string, data: Partial<AnnonceInput>) {
  try {
    const existingAnnonce = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!existingAnnonce) {
      return { success: false, error: "Annonce non trouvée" };
    }

    // Vérifier la durée vidéo si c'est une vidéo
    if (data.mediaType === "VIDEO" || (existingAnnonce.mediaType === "VIDEO" && data.mediaType === undefined)) {
      const duration = data.mediaDuration ?? existingAnnonce.mediaDuration;
      if (!duration || duration < 3 || duration > 5) {
        return { success: false, error: "La durée de la vidéo doit être entre 3 et 5 secondes" };
      }
    }

    const annonce = await prisma.annonce.update({
      where: { id },
      data: {
        ...data,
        mediaUrl: data.mediaUrl === "" ? null : data.mediaUrl,
        lien: data.lien === "" ? null : data.lien,
        promotionId: data.promotionId === "" ? null : data.promotionId,
      },
    });

    revalidatePath("/admin/annonces");
    revalidatePath(`/admin/annonces/${id}`);
    revalidatePath("/");

    return { success: true, data: annonce };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'annonce:", error);
    return { success: false, error: "Erreur lors de la mise à jour de l'annonce" };
  }
}

// Supprimer une annonce
export async function deleteAnnonce(id: string) {
  try {
    await prisma.annonce.delete({
      where: { id },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    return { success: false, error: "Erreur lors de la suppression de l'annonce" };
  }
}

// Activer/Désactiver une annonce
export async function toggleAnnonceActive(id: string) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!annonce) {
      return { success: false, error: "Annonce non trouvée" };
    }

    const updatedAnnonce = await prisma.annonce.update({
      where: { id },
      data: { isActive: !annonce.isActive },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/");

    return { success: true, data: updatedAnnonce };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Épingler/Désépingler une annonce
export async function toggleAnnoncePinned(id: string) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!annonce) {
      return { success: false, error: "Annonce non trouvée" };
    }

    const updatedAnnonce = await prisma.annonce.update({
      where: { id },
      data: { isPinned: !annonce.isPinned },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/");

    return { success: true, data: updatedAnnonce };
  } catch (error) {
    console.error("Erreur lors de l'épinglage:", error);
    return { success: false, error: "Erreur lors de l'épinglage" };
  }
}

// Statistiques des annonces
export async function getAnnoncesStats() {
  try {
    const now = new Date();

    const [total, actives, expiredCount, videosCount, imagesCount] = await Promise.all([
      prisma.annonce.count(),
      prisma.annonce.count({
        where: {
          isActive: true,
          dateDebut: { lte: now },
          dateFin: { gte: now },
        },
      }),
      prisma.annonce.count({
        where: {
          dateFin: { lt: now },
        },
      }),
      prisma.annonce.count({
        where: { mediaType: "VIDEO" },
      }),
      prisma.annonce.count({
        where: { mediaType: "IMAGE" },
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        actives,
        expired: expiredCount,
        videos: videosCount,
        images: imagesCount,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

// Dupliquer une annonce
export async function duplicateAnnonce(id: string) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!annonce) {
      return { success: false, error: "Annonce non trouvée" };
    }

    const { id: _, createdAt, updatedAt, ...annonceData } = annonce;

    const newAnnonce = await prisma.annonce.create({
      data: {
        ...annonceData,
        titre: `${annonceData.titre} (copie)`,
        isActive: false,
      },
    });

    revalidatePath("/admin/annonces");

    return { success: true, data: newAnnonce };
  } catch (error) {
    console.error("Erreur lors de la duplication:", error);
    return { success: false, error: "Erreur lors de la duplication" };
  }
}
