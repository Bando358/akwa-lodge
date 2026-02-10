"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EvenementType } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { requireAdmin } from "@/lib/auth";

// Schéma de validation pour les événements
const evenementSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  slug: z.string().optional(),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "La description courte ne doit pas dépasser 300 caractères"),
  type: z.nativeEnum(EvenementType),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date().optional().nullable(),
  heureDebut: z.string().optional().nullable(),
  heureFin: z.string().optional().nullable(),
  lieu: z.string().optional().nullable(),
  capaciteMin: z.number().int().positive().optional().nullable(),
  capaciteMax: z.number().int().positive().optional().nullable(),
  prix: z.number().positive().optional().nullable(),
  prixDescription: z.string().optional().nullable(),
  equipements: z.array(z.string()).default([]),
  inclus: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type EvenementInput = z.infer<typeof evenementSchema>;

// Fonction pour générer un slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Récupérer tous les événements
export async function getEvenements(options?: {
  isActive?: boolean;
  isFeatured?: boolean;
  type?: EvenementType;
  upcoming?: boolean;
  limit?: number;
}) {
  try {
    const evenements = await prisma.evenement.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.isFeatured !== undefined && { isFeatured: options.isFeatured }),
        ...(options?.type && { type: options.type }),
        ...(options?.upcoming && { dateDebut: { gte: new Date() } }),
      },
      include: {
        images: {
          orderBy: { ordre: "asc" },
          take: 5,
        },
      },
      orderBy: { dateDebut: "asc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: evenements };
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return { success: false, error: "Erreur lors de la récupération des événements" };
  }
}

// Récupérer un événement par ID
export async function getEvenementById(id: string) {
  try {
    const evenement = await prisma.evenement.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!evenement) {
      return { success: false, error: "Événement non trouvé" };
    }

    return { success: true, data: evenement };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return { success: false, error: "Erreur lors de la récupération de l'événement" };
  }
}

// Récupérer un événement par slug
export async function getEvenementBySlug(slug: string) {
  try {
    const evenement = await prisma.evenement.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!evenement) {
      return { success: false, error: "Événement non trouvé" };
    }

    return { success: true, data: evenement };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return { success: false, error: "Erreur lors de la récupération de l'événement" };
  }
}

// Créer un événement
export async function createEvenement(data: EvenementInput) {
  try {
    const validatedData = evenementSchema.parse(data);

    // Générer le slug si non fourni
    let slug = validatedData.slug || generateSlug(validatedData.titre);

    // Vérifier l'unicité du slug
    const existingEvenement = await prisma.evenement.findUnique({
      where: { slug },
    });

    if (existingEvenement) {
      slug = `${slug}-${Date.now()}`;
    }

    const evenement = await prisma.evenement.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    revalidatePath("/conferences");
    logActivity({ action: "CREATE", entityType: "Evenement", entityId: evenement.id, description: "Evenement cree : " + validatedData.titre }).catch(() => {});

    return { success: true, data: evenement };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de l'événement:", error);
    return { success: false, error: "Erreur lors de la création de l'événement" };
  }
}

// Mettre à jour un événement
export async function updateEvenement(id: string, data: Partial<EvenementInput>) {
  try {
    const existingEvenement = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!existingEvenement) {
      return { success: false, error: "Événement non trouvé" };
    }

    // Générer le slug si le titre a changé
    let slug = data.slug;
    if (data.titre && data.titre !== existingEvenement.titre && !data.slug) {
      slug = generateSlug(data.titre);

      // Vérifier l'unicité du slug
      const evenementWithSlug = await prisma.evenement.findUnique({
        where: { slug },
      });

      if (evenementWithSlug && evenementWithSlug.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const evenement = await prisma.evenement.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });

    revalidatePath("/admin/evenements");
    revalidatePath(`/admin/evenements/${id}`);
    revalidatePath("/evenements");
    revalidatePath("/conferences");
    logActivity({ action: "UPDATE", entityType: "Evenement", entityId: id, description: "Evenement modifie : " + evenement.titre }).catch(() => {});

    return { success: true, data: evenement };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return { success: false, error: "Erreur lors de la mise à jour de l'événement" };
  }
}

// Supprimer un événement
export async function deleteEvenement(id: string) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.evenement.delete({
      where: { id },
    });

    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    revalidatePath("/conferences");
    logActivity({ action: "DELETE", entityType: "Evenement", entityId: id, description: "Evenement supprime" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return { success: false, error: "Erreur lors de la suppression de l'événement" };
  }
}

// Activer/Désactiver un événement
export async function toggleEvenementActive(id: string) {
  try {
    const evenement = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!evenement) {
      return { success: false, error: "Événement non trouvé" };
    }

    const updatedEvenement = await prisma.evenement.update({
      where: { id },
      data: { isActive: !evenement.isActive },
    });

    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    revalidatePath("/conferences");
    logActivity({ action: "TOGGLE", entityType: "Evenement", entityId: id, description: "Evenement " + (updatedEvenement.isActive ? "active" : "desactive") + " : " + updatedEvenement.titre }).catch(() => {});

    return { success: true, data: updatedEvenement };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Mettre en vedette un événement
export async function toggleEvenementFeatured(id: string) {
  try {
    const evenement = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!evenement) {
      return { success: false, error: "Événement non trouvé" };
    }

    const updatedEvenement = await prisma.evenement.update({
      where: { id },
      data: { isFeatured: !evenement.isFeatured },
    });

    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    revalidatePath("/conferences");
    revalidatePath("/");
    logActivity({ action: "TOGGLE", entityType: "Evenement", entityId: id, description: "Evenement " + (updatedEvenement.isFeatured ? "mis en vedette" : "retire de la vedette") + " : " + updatedEvenement.titre }).catch(() => {});

    return { success: true, data: updatedEvenement };
  } catch (error) {
    console.error("Erreur lors du changement de vedette:", error);
    return { success: false, error: "Erreur lors du changement de vedette" };
  }
}
