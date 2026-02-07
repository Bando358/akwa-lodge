"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PromotionType, PromotionCible } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";

// Schéma de validation pour les promotions
const promotionSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(PromotionType).default("POURCENTAGE"),
  valeur: z.number().positive("La valeur doit être positive"),
  cible: z.nativeEnum(PromotionCible).default("TOUS"),
  chambreId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  codePromo: z.string().optional().nullable(),
  dateDebut: z.date(),
  dateFin: z.date(),
  conditions: z.string().optional().nullable(),
  montantMinimum: z.number().positive().optional().nullable(),
  usageMax: z.number().int().positive().optional().nullable(),
  usageParClient: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
});

type PromotionInput = z.infer<typeof promotionSchema>;

// Récupérer toutes les promotions
export async function getPromotions(options?: {
  isActive?: boolean;
  cible?: PromotionCible;
  type?: PromotionType;
  activeOnly?: boolean;
  includeRelations?: boolean;
}) {
  try {
    const now = new Date();

    const promotions = await prisma.promotion.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.cible && { cible: options.cible }),
        ...(options?.type && { type: options.type }),
        ...(options?.activeOnly && {
          dateDebut: { lte: now },
          dateFin: { gte: now },
          isActive: true,
        }),
      },
      include: options?.includeRelations
        ? {
            chambre: {
              select: { id: true, nom: true, slug: true },
            },
            service: {
              select: { id: true, nom: true, slug: true, type: true },
            },
            _count: {
              select: { annonces: true },
            },
          }
        : {
            _count: {
              select: { annonces: true },
            },
          },
      orderBy: [{ isActive: "desc" }, { dateDebut: "desc" }],
    });

    return { success: true, data: promotions };
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions:", error);
    return { success: false, error: "Erreur lors de la récupération des promotions" };
  }
}

// Récupérer une promotion par ID
export async function getPromotionById(id: string) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        chambre: true,
        service: true,
        annonces: {
          select: {
            id: true,
            titre: true,
            isActive: true,
          },
        },
      },
    });

    if (!promotion) {
      return { success: false, error: "Promotion non trouvée" };
    }

    return { success: true, data: promotion };
  } catch (error) {
    console.error("Erreur lors de la récupération de la promotion:", error);
    return { success: false, error: "Erreur lors de la récupération de la promotion" };
  }
}

// Récupérer les promotions actives pour le site public
export async function getPromotionsActives(cible?: PromotionCible) {
  try {
    const now = new Date();

    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        dateDebut: { lte: now },
        dateFin: { gte: now },
        ...(cible && { cible }),
        // Vérifier que la limite d'utilisation n'est pas atteinte
        OR: [
          { usageMax: null },
          {
            usageMax: {
              gt: prisma.promotion.fields.usageActuel,
            },
          },
        ],
      },
      include: {
        chambre: {
          select: { id: true, nom: true, slug: true },
        },
        service: {
          select: { id: true, nom: true, slug: true },
        },
      },
      orderBy: { valeur: "desc" },
    });

    return { success: true, data: promotions };
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions actives:", error);
    return { success: false, error: "Erreur lors de la récupération des promotions" };
  }
}

// Vérifier un code promo
export async function verifyPromoCode(code: string, cible?: PromotionCible) {
  try {
    const now = new Date();

    const promotion = await prisma.promotion.findFirst({
      where: {
        codePromo: code.toUpperCase(),
        isActive: true,
        dateDebut: { lte: now },
        dateFin: { gte: now },
        ...(cible && {
          OR: [{ cible: "TOUS" }, { cible }],
        }),
      },
      include: {
        chambre: {
          select: { id: true, nom: true },
        },
        service: {
          select: { id: true, nom: true },
        },
      },
    });

    if (!promotion) {
      return { success: false, error: "Code promo invalide ou expiré" };
    }

    // Vérifier la limite d'utilisation
    if (promotion.usageMax && promotion.usageActuel >= promotion.usageMax) {
      return { success: false, error: "Ce code promo a atteint sa limite d'utilisation" };
    }

    return { success: true, data: promotion };
  } catch (error) {
    console.error("Erreur lors de la vérification du code promo:", error);
    return { success: false, error: "Erreur lors de la vérification" };
  }
}

// Créer une promotion
export async function createPromotion(data: PromotionInput) {
  try {
    const validatedData = promotionSchema.parse(data);

    // Vérifier l'unicité du code promo
    if (validatedData.codePromo) {
      const existingCode = await prisma.promotion.findUnique({
        where: { codePromo: validatedData.codePromo.toUpperCase() },
      });

      if (existingCode) {
        return { success: false, error: "Ce code promo existe déjà" };
      }
    }

    const promotion = await prisma.promotion.create({
      data: {
        ...validatedData,
        codePromo: validatedData.codePromo?.toUpperCase() || null,
        chambreId: validatedData.chambreId || null,
        serviceId: validatedData.serviceId || null,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/");

    logActivity({ action: "CREATE", entityType: "Promotion", entityId: promotion.id, description: "Promotion creee : " + validatedData.nom }).catch(() => {});

    return { success: true, data: promotion };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de la promotion:", error);
    return { success: false, error: "Erreur lors de la création de la promotion" };
  }
}

// Mettre à jour une promotion
export async function updatePromotion(id: string, data: Partial<PromotionInput>) {
  try {
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      return { success: false, error: "Promotion non trouvée" };
    }

    // Vérifier l'unicité du code promo si changé
    if (data.codePromo && data.codePromo.toUpperCase() !== existingPromotion.codePromo) {
      const existingCode = await prisma.promotion.findUnique({
        where: { codePromo: data.codePromo.toUpperCase() },
      });

      if (existingCode) {
        return { success: false, error: "Ce code promo existe déjà" };
      }
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...data,
        codePromo: data.codePromo?.toUpperCase() || (data.codePromo === "" ? null : undefined),
        chambreId: data.chambreId === "" ? null : data.chambreId,
        serviceId: data.serviceId === "" ? null : data.serviceId,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath(`/admin/promotions/${id}`);
    revalidatePath("/");

    logActivity({ action: "UPDATE", entityType: "Promotion", entityId: id, description: "Promotion modifiee : " + promotion.nom }).catch(() => {});

    return { success: true, data: promotion };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la promotion:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la promotion" };
  }
}

// Supprimer une promotion
export async function deletePromotion(id: string) {
  try {
    // Vérifier si des annonces sont liées
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: { _count: { select: { annonces: true } } },
    });

    if (!promotion) {
      return { success: false, error: "Promotion non trouvée" };
    }

    if (promotion._count.annonces > 0) {
      return {
        success: false,
        error: `Cette promotion est liée à ${promotion._count.annonces} annonce(s). Supprimez d'abord les annonces.`,
      };
    }

    await prisma.promotion.delete({
      where: { id },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/");

    logActivity({ action: "DELETE", entityType: "Promotion", entityId: id, description: "Promotion supprimee : " + promotion.nom }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la promotion:", error);
    return { success: false, error: "Erreur lors de la suppression de la promotion" };
  }
}

// Activer/Désactiver une promotion
export async function togglePromotionActive(id: string) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      return { success: false, error: "Promotion non trouvée" };
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: { isActive: !promotion.isActive },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/");

    logActivity({ action: "TOGGLE", entityType: "Promotion", entityId: id, description: "Promotion " + (updatedPromotion.isActive ? "activee" : "desactivee") + " : " + updatedPromotion.nom }).catch(() => {});

    return { success: true, data: updatedPromotion };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Incrémenter l'utilisation d'une promotion
export async function usePromotion(id: string) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      return { success: false, error: "Promotion non trouvée" };
    }

    // Vérifier la limite
    if (promotion.usageMax && promotion.usageActuel >= promotion.usageMax) {
      return { success: false, error: "Limite d'utilisation atteinte" };
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: { usageActuel: { increment: 1 } },
    });

    return { success: true, data: updatedPromotion };
  } catch (error) {
    console.error("Erreur lors de l'utilisation de la promotion:", error);
    return { success: false, error: "Erreur" };
  }
}

// Statistiques des promotions
export async function getPromotionsStats() {
  try {
    const now = new Date();

    const [total, actives, expired, withCode] = await Promise.all([
      prisma.promotion.count(),
      prisma.promotion.count({
        where: {
          isActive: true,
          dateDebut: { lte: now },
          dateFin: { gte: now },
        },
      }),
      prisma.promotion.count({
        where: {
          dateFin: { lt: now },
        },
      }),
      prisma.promotion.count({
        where: {
          codePromo: { not: null },
        },
      }),
    ]);

    // Répartition par cible
    const parCible = await prisma.promotion.groupBy({
      by: ["cible"],
      _count: { cible: true },
    });

    return {
      success: true,
      data: {
        total,
        actives,
        expired,
        withCode,
        parCible: parCible.reduce(
          (acc, item) => ({ ...acc, [item.cible]: item._count.cible }),
          {} as Record<string, number>
        ),
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

// Récupérer les chambres et services pour le formulaire
export async function getPromotionTargets() {
  try {
    const [chambres, services] = await Promise.all([
      prisma.chambre.findMany({
        where: { isActive: true },
        select: { id: true, nom: true, slug: true },
        orderBy: { nom: "asc" },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        select: { id: true, nom: true, slug: true, type: true },
        orderBy: { nom: "asc" },
      }),
    ]);

    return { success: true, data: { chambres, services } };
  } catch (error) {
    console.error("Erreur lors de la récupération des cibles:", error);
    return { success: false, error: "Erreur" };
  }
}
