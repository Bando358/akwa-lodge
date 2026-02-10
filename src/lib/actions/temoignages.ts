"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { requireAdmin } from "@/lib/auth";

// Schéma de validation pour les témoignages
const temoignageSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  pays: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  note: z.number().int().min(1).max(5).default(5),
  texte: z.string().min(10, "Le témoignage doit faire au moins 10 caractères"),
  dateVisite: z.coerce.date().optional().nullable(),
  isApproved: z.boolean().default(false),
  isActive: z.boolean().default(true),
  ordre: z.number().int().default(0),
});

type TemoignageInput = z.infer<typeof temoignageSchema>;

// Récupérer tous les témoignages
export async function getTemoignages(options?: {
  isApproved?: boolean;
  isActive?: boolean;
  limit?: number;
}) {
  try {
    const temoignages = await prisma.temoignage.findMany({
      where: {
        ...(options?.isApproved !== undefined && { isApproved: options.isApproved }),
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
      },
      orderBy: { ordre: "asc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: temoignages };
  } catch (error) {
    console.error("Erreur lors de la récupération des témoignages:", error);
    return { success: false, error: "Erreur lors de la récupération des témoignages" };
  }
}

// Récupérer un témoignage par ID
export async function getTemoignageById(id: string) {
  try {
    const temoignage = await prisma.temoignage.findUnique({
      where: { id },
    });

    if (!temoignage) {
      return { success: false, error: "Témoignage non trouvé" };
    }

    return { success: true, data: temoignage };
  } catch (error) {
    console.error("Erreur lors de la récupération du témoignage:", error);
    return { success: false, error: "Erreur lors de la récupération du témoignage" };
  }
}

// Créer un témoignage
export async function createTemoignage(data: TemoignageInput) {
  try {
    const validatedData = temoignageSchema.parse(data);

    const temoignage = await prisma.temoignage.create({
      data: validatedData,
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/");
    logActivity({ action: "CREATE", entityType: "Temoignage", entityId: temoignage.id, description: "Temoignage cree par " + validatedData.nom }).catch(() => {});

    return { success: true, data: temoignage };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création du témoignage:", error);
    return { success: false, error: "Erreur lors de la création du témoignage" };
  }
}

// Mettre à jour un témoignage
export async function updateTemoignage(id: string, data: Partial<TemoignageInput>) {
  try {
    const existingTemoignage = await prisma.temoignage.findUnique({
      where: { id },
    });

    if (!existingTemoignage) {
      return { success: false, error: "Témoignage non trouvé" };
    }

    const temoignage = await prisma.temoignage.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/temoignages");
    revalidatePath(`/admin/temoignages/${id}`);
    revalidatePath("/");
    logActivity({ action: "UPDATE", entityType: "Temoignage", entityId: id, description: "Temoignage modifie" }).catch(() => {});

    return { success: true, data: temoignage };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du témoignage:", error);
    return { success: false, error: "Erreur lors de la mise à jour du témoignage" };
  }
}

// Supprimer un témoignage
export async function deleteTemoignage(id: string) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.temoignage.delete({
      where: { id },
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/");
    logActivity({ action: "DELETE", entityType: "Temoignage", entityId: id, description: "Temoignage supprime" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du témoignage:", error);
    return { success: false, error: "Erreur lors de la suppression du témoignage" };
  }
}

// Approuver un témoignage
export async function approveTemoignage(id: string) {
  try {
    const temoignage = await prisma.temoignage.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/");
    logActivity({ action: "UPDATE", entityType: "Temoignage", entityId: id, description: "Temoignage approuve" }).catch(() => {});

    return { success: true, data: temoignage };
  } catch (error) {
    console.error("Erreur lors de l'approbation du témoignage:", error);
    return { success: false, error: "Erreur lors de l'approbation du témoignage" };
  }
}

// Rejeter un témoignage
export async function rejectTemoignage(id: string) {
  try {
    const temoignage = await prisma.temoignage.update({
      where: { id },
      data: { isApproved: false },
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/");
    logActivity({ action: "UPDATE", entityType: "Temoignage", entityId: id, description: "Temoignage rejete" }).catch(() => {});

    return { success: true, data: temoignage };
  } catch (error) {
    console.error("Erreur lors du rejet du témoignage:", error);
    return { success: false, error: "Erreur lors du rejet du témoignage" };
  }
}

// Activer/Désactiver un témoignage
export async function toggleTemoignageActive(id: string) {
  try {
    const temoignage = await prisma.temoignage.findUnique({
      where: { id },
    });

    if (!temoignage) {
      return { success: false, error: "Témoignage non trouvé" };
    }

    const updatedTemoignage = await prisma.temoignage.update({
      where: { id },
      data: { isActive: !temoignage.isActive },
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/");
    logActivity({ action: "TOGGLE", entityType: "Temoignage", entityId: id, description: "Temoignage " + (updatedTemoignage.isActive ? "active" : "desactive") }).catch(() => {});

    return { success: true, data: updatedTemoignage };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Statistiques des témoignages
export async function getTemoignageStats() {
  try {
    const [total, approuves, enAttente, noteMoyenne] = await Promise.all([
      prisma.temoignage.count(),
      prisma.temoignage.count({ where: { isApproved: true } }),
      prisma.temoignage.count({ where: { isApproved: false } }),
      prisma.temoignage.aggregate({
        where: { isApproved: true },
        _avg: { note: true },
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        approuves,
        enAttente,
        noteMoyenne: noteMoyenne._avg.note || 0,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}
