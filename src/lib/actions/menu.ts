"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

// Schéma de validation pour les catégories de menu
const menuCategorieSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  ordre: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Schéma de validation pour les plats
const platSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  prix: z.number().positive("Le prix doit être positif"),
  image: z.string().optional().nullable(),
  allergenes: z.array(z.string()).default([]),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isActive: z.boolean().default(true),
  ordre: z.number().int().default(0),
  categorieId: z.string().min(1, "La catégorie est requise"),
});

type MenuCategorieInput = z.infer<typeof menuCategorieSchema>;
type PlatInput = z.infer<typeof platSchema>;

// ============================================
// CATÉGORIES DE MENU
// ============================================

// Récupérer toutes les catégories
export async function getMenuCategories(options?: {
  isActive?: boolean;
  includePlats?: boolean;
}) {
  try {
    const categories = await prisma.menuCategorie.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
      },
      include: options?.includePlats
        ? {
            plats: {
              where: { isActive: true },
              orderBy: { ordre: "asc" },
            },
          }
        : undefined,
      orderBy: { ordre: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return { success: false, error: "Erreur lors de la récupération des catégories" };
  }
}

// Récupérer une catégorie par ID
export async function getMenuCategorieById(id: string) {
  try {
    const categorie = await prisma.menuCategorie.findUnique({
      where: { id },
      include: {
        plats: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!categorie) {
      return { success: false, error: "Catégorie non trouvée" };
    }

    return { success: true, data: categorie };
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return { success: false, error: "Erreur lors de la récupération de la catégorie" };
  }
}

// Créer une catégorie
export async function createMenuCategorie(data: MenuCategorieInput) {
  try {
    const validatedData = menuCategorieSchema.parse(data);

    const categorie = await prisma.menuCategorie.create({
      data: validatedData,
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "CREATE", entityType: "MenuCategorie", entityId: categorie.id, description: "Categorie menu creee : " + validatedData.nom }).catch(() => {});

    return { success: true, data: categorie };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de la catégorie:", error);
    return { success: false, error: "Erreur lors de la création de la catégorie" };
  }
}

// Mettre à jour une catégorie
export async function updateMenuCategorie(id: string, data: Partial<MenuCategorieInput>) {
  try {
    const existingCategorie = await prisma.menuCategorie.findUnique({
      where: { id },
    });

    if (!existingCategorie) {
      return { success: false, error: "Catégorie non trouvée" };
    }

    const categorie = await prisma.menuCategorie.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "UPDATE", entityType: "MenuCategorie", entityId: id, description: "Categorie menu modifiee : " + categorie.nom }).catch(() => {});

    return { success: true, data: categorie };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la catégorie" };
  }
}

// Supprimer une catégorie
export async function deleteMenuCategorie(id: string) {
  try {
    await prisma.menuCategorie.delete({
      where: { id },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "DELETE", entityType: "MenuCategorie", entityId: id, description: "Categorie menu supprimee" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    return { success: false, error: "Erreur lors de la suppression de la catégorie" };
  }
}

// Activer/Désactiver une catégorie
export async function toggleMenuCategorieActive(id: string) {
  try {
    const categorie = await prisma.menuCategorie.findUnique({
      where: { id },
    });

    if (!categorie) {
      return { success: false, error: "Catégorie non trouvée" };
    }

    const updatedCategorie = await prisma.menuCategorie.update({
      where: { id },
      data: { isActive: !categorie.isActive },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "TOGGLE", entityType: "MenuCategorie", entityId: id, description: "Categorie menu " + (updatedCategorie.isActive ? "activee" : "desactivee") }).catch(() => {});

    return { success: true, data: updatedCategorie };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// ============================================
// PLATS
// ============================================

// Récupérer tous les plats
export async function getPlats(options?: {
  isActive?: boolean;
  categorieId?: string;
  limit?: number;
}) {
  try {
    const plats = await prisma.plat.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.categorieId && { categorieId: options.categorieId }),
      },
      include: {
        categorie: {
          select: { id: true, nom: true },
        },
      },
      orderBy: { ordre: "asc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: plats };
  } catch (error) {
    console.error("Erreur lors de la récupération des plats:", error);
    return { success: false, error: "Erreur lors de la récupération des plats" };
  }
}

// Récupérer un plat par ID
export async function getPlatById(id: string) {
  try {
    const plat = await prisma.plat.findUnique({
      where: { id },
      include: {
        categorie: true,
      },
    });

    if (!plat) {
      return { success: false, error: "Plat non trouvé" };
    }

    return { success: true, data: plat };
  } catch (error) {
    console.error("Erreur lors de la récupération du plat:", error);
    return { success: false, error: "Erreur lors de la récupération du plat" };
  }
}

// Créer un plat
export async function createPlat(data: PlatInput) {
  try {
    const validatedData = platSchema.parse(data);

    const plat = await prisma.plat.create({
      data: validatedData,
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "CREATE", entityType: "Plat", entityId: plat.id, description: "Plat cree : " + validatedData.nom }).catch(() => {});

    return { success: true, data: plat };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création du plat:", error);
    return { success: false, error: "Erreur lors de la création du plat" };
  }
}

// Mettre à jour un plat
export async function updatePlat(id: string, data: Partial<PlatInput>) {
  try {
    const existingPlat = await prisma.plat.findUnique({
      where: { id },
    });

    if (!existingPlat) {
      return { success: false, error: "Plat non trouvé" };
    }

    const plat = await prisma.plat.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "UPDATE", entityType: "Plat", entityId: id, description: "Plat modifie : " + plat.nom }).catch(() => {});

    return { success: true, data: plat };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plat:", error);
    return { success: false, error: "Erreur lors de la mise à jour du plat" };
  }
}

// Supprimer un plat
export async function deletePlat(id: string) {
  try {
    await prisma.plat.delete({
      where: { id },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "DELETE", entityType: "Plat", entityId: id, description: "Plat supprime" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du plat:", error);
    return { success: false, error: "Erreur lors de la suppression du plat" };
  }
}

// Activer/Désactiver un plat
export async function togglePlatActive(id: string) {
  try {
    const plat = await prisma.plat.findUnique({
      where: { id },
    });

    if (!plat) {
      return { success: false, error: "Plat non trouvé" };
    }

    const updatedPlat = await prisma.plat.update({
      where: { id },
      data: { isActive: !plat.isActive },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/restauration");

    logActivity({ action: "TOGGLE", entityType: "Plat", entityId: id, description: "Plat " + (updatedPlat.isActive ? "active" : "desactive") }).catch(() => {});

    return { success: true, data: updatedPlat };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}
