"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

// Schéma de validation pour les chambres
const chambreSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  type: z.string().default("Chambre"), // Type: Suite, Bungalow, Chambre, Villa
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "La description courte ne doit pas dépasser 300 caractères"),
  videoUrl: z.string().url().optional().nullable(), // URL de la vidéo YouTube
  prix: z.number().positive("Le prix doit être positif"),
  prixWeekend: z.number().positive().optional().nullable(),
  capacite: z.number().int().positive("La capacité doit être positive"),
  superficie: z.number().int().positive().optional().nullable(),
  nombreLits: z.number().int().positive().default(1),
  typeLit: z.string().optional().nullable(),
  vue: z.string().optional().nullable(),
  etage: z.number().int().optional().nullable(),
  equipements: z.array(z.string()).default([]),
  caracteristiques: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]), // URLs des images
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  ordre: z.number().int().default(0),
});

type ChambreInput = z.infer<typeof chambreSchema>;

// Fonction pour générer un slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Récupérer toutes les chambres
export async function getChambres(options?: {
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
}) {
  try {
    const chambres = await prisma.chambre.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.isFeatured !== undefined && { isFeatured: options.isFeatured }),
      },
      include: {
        images: {
          orderBy: { ordre: "asc" },
          take: 5,
        },
      },
      orderBy: { ordre: "asc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: chambres };
  } catch (error) {
    console.error("Erreur lors de la récupération des chambres:", error);
    return { success: false, error: "Erreur lors de la récupération des chambres" };
  }
}

// Récupérer une chambre par ID
export async function getChambreById(id: string) {
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!chambre) {
      return { success: false, error: "Chambre non trouvée" };
    }

    return { success: true, data: chambre };
  } catch (error) {
    console.error("Erreur lors de la récupération de la chambre:", error);
    return { success: false, error: "Erreur lors de la récupération de la chambre" };
  }
}

// Récupérer une chambre par slug
export async function getChambreBySlug(slug: string) {
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!chambre) {
      return { success: false, error: "Chambre non trouvée" };
    }

    return { success: true, data: chambre };
  } catch (error) {
    console.error("Erreur lors de la récupération de la chambre:", error);
    return { success: false, error: "Erreur lors de la récupération de la chambre" };
  }
}

// Créer une chambre
export async function createChambre(data: ChambreInput) {
  try {
    const validatedData = chambreSchema.parse(data);

    // Extraire les images pour les créer séparément
    const { images, ...chambreData } = validatedData;

    // Générer le slug si non fourni
    let slug = chambreData.slug || generateSlug(chambreData.nom);

    // Vérifier l'unicité du slug
    const existingChambre = await prisma.chambre.findUnique({
      where: { slug },
    });

    if (existingChambre) {
      slug = `${slug}-${Date.now()}`;
    }

    // Créer la chambre avec ses images
    const chambre = await prisma.chambre.create({
      data: {
        ...chambreData,
        slug,
        images: {
          create: images.map((url, index) => ({
            url,
            ordre: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/admin/chambres");
    revalidatePath("/hebergement");
    logActivity({ action: "CREATE", entityType: "Chambre", entityId: chambre.id, description: "Chambre creee : " + validatedData.nom }).catch(() => {});

    return { success: true, data: chambre };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de la chambre:", error);
    return { success: false, error: "Erreur lors de la création de la chambre" };
  }
}

// Mettre à jour une chambre
export async function updateChambre(id: string, data: Partial<ChambreInput>) {
  try {
    const existingChambre = await prisma.chambre.findUnique({
      where: { id },
    });

    if (!existingChambre) {
      return { success: false, error: "Chambre non trouvée" };
    }

    // Extraire les images pour les gérer séparément
    const { images, ...chambreData } = data;

    // Générer le slug si le nom a changé
    let slug = chambreData.slug;
    if (chambreData.nom && chambreData.nom !== existingChambre.nom && !chambreData.slug) {
      slug = generateSlug(chambreData.nom);

      // Vérifier l'unicité du slug
      const chambreWithSlug = await prisma.chambre.findUnique({
        where: { slug },
      });

      if (chambreWithSlug && chambreWithSlug.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Mettre à jour la chambre
    const chambre = await prisma.chambre.update({
      where: { id },
      data: {
        ...chambreData,
        ...(slug && { slug }),
        // Mettre à jour les images si elles sont fournies
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url, index) => ({
              url,
              ordre: index,
            })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/admin/chambres");
    revalidatePath(`/admin/chambres/${id}`);
    revalidatePath("/hebergement");
    revalidatePath(`/hebergement/${chambre.slug}`);
    logActivity({ action: "UPDATE", entityType: "Chambre", entityId: id, description: "Chambre modifiee : " + chambre.nom }).catch(() => {});

    return { success: true, data: chambre };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la chambre:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la chambre" };
  }
}

// Supprimer une chambre
export async function deleteChambre(id: string) {
  try {
    await prisma.chambre.delete({
      where: { id },
    });

    revalidatePath("/admin/chambres");
    revalidatePath("/hebergement");
    logActivity({ action: "DELETE", entityType: "Chambre", entityId: id, description: "Chambre supprimee" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la chambre:", error);
    return { success: false, error: "Erreur lors de la suppression de la chambre" };
  }
}

// Activer/Désactiver une chambre
export async function toggleChambreActive(id: string) {
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id },
    });

    if (!chambre) {
      return { success: false, error: "Chambre non trouvée" };
    }

    const updatedChambre = await prisma.chambre.update({
      where: { id },
      data: { isActive: !chambre.isActive },
    });

    revalidatePath("/admin/chambres");
    revalidatePath("/hebergement");
    logActivity({ action: "TOGGLE", entityType: "Chambre", entityId: id, description: "Chambre " + (updatedChambre.isActive ? "activee" : "desactivee") + " : " + updatedChambre.nom }).catch(() => {});

    return { success: true, data: updatedChambre };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Mettre en vedette une chambre
export async function toggleChambreFeatured(id: string) {
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id },
    });

    if (!chambre) {
      return { success: false, error: "Chambre non trouvée" };
    }

    const updatedChambre = await prisma.chambre.update({
      where: { id },
      data: { isFeatured: !chambre.isFeatured },
    });

    revalidatePath("/admin/chambres");
    revalidatePath("/hebergement");
    revalidatePath("/");
    logActivity({ action: "TOGGLE", entityType: "Chambre", entityId: id, description: "Chambre " + (updatedChambre.isFeatured ? "mise en vedette" : "retiree de la vedette") + " : " + updatedChambre.nom }).catch(() => {});

    return { success: true, data: updatedChambre };
  } catch (error) {
    console.error("Erreur lors du changement de vedette:", error);
    return { success: false, error: "Erreur lors du changement de vedette" };
  }
}

// Réorganiser l'ordre des chambres
export async function reorderChambres(orderedIds: string[]) {
  try {
    const updates = orderedIds.map((id, index) =>
      prisma.chambre.update({
        where: { id },
        data: { ordre: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/chambres");
    revalidatePath("/hebergement");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réorganisation:", error);
    return { success: false, error: "Erreur lors de la réorganisation" };
  }
}
