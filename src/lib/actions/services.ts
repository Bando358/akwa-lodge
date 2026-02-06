"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ServiceType } from "@prisma/client";

// Schéma de validation pour les services
const serviceSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  descriptionCourte: z.string().max(300, "La description courte ne doit pas dépasser 300 caractères"),
  type: z.nativeEnum(ServiceType),
  icone: z.string().optional().nullable(),
  prix: z.number().positive().optional().nullable(),
  prixDescription: z.string().optional().nullable(),
  horaires: z.string().optional().nullable(),
  capacite: z.number().int().positive().optional().nullable(),
  duree: z.string().optional().nullable(),
  inclus: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  ordre: z.number().int().default(0),
});

type ServiceInput = z.infer<typeof serviceSchema>;

// Fonction pour générer un slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Récupérer tous les services
export async function getServices(options?: {
  isActive?: boolean;
  isFeatured?: boolean;
  type?: ServiceType;
  limit?: number;
}) {
  try {
    const services = await prisma.service.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.isFeatured !== undefined && { isFeatured: options.isFeatured }),
        ...(options?.type && { type: options.type }),
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

    return { success: true, data: services };
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    return { success: false, error: "Erreur lors de la récupération des services" };
  }
}

// Récupérer un service par ID
export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!service) {
      return { success: false, error: "Service non trouvé" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    return { success: false, error: "Erreur lors de la récupération du service" };
  }
}

// Récupérer un service par slug
export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { ordre: "asc" },
        },
      },
    });

    if (!service) {
      return { success: false, error: "Service non trouvé" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    return { success: false, error: "Erreur lors de la récupération du service" };
  }
}

// Créer un service
export async function createService(data: ServiceInput) {
  try {
    const validatedData = serviceSchema.parse(data);

    // Générer le slug si non fourni
    let slug = validatedData.slug || generateSlug(validatedData.nom);

    // Vérifier l'unicité du slug
    const existingService = await prisma.service.findUnique({
      where: { slug },
    });

    if (existingService) {
      slug = `${slug}-${Date.now()}`;
    }

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath("/activites");
    revalidatePath("/restauration");

    return { success: true, data: service };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création du service:", error);
    return { success: false, error: "Erreur lors de la création du service" };
  }
}

// Mettre à jour un service
export async function updateService(id: string, data: Partial<ServiceInput>) {
  try {
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return { success: false, error: "Service non trouvé" };
    }

    // Générer le slug si le nom a changé
    let slug = data.slug;
    if (data.nom && data.nom !== existingService.nom && !data.slug) {
      slug = generateSlug(data.nom);

      // Vérifier l'unicité du slug
      const serviceWithSlug = await prisma.service.findUnique({
        where: { slug },
      });

      if (serviceWithSlug && serviceWithSlug.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    revalidatePath("/activites");
    revalidatePath("/restauration");

    return { success: true, data: service };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service:", error);
    return { success: false, error: "Erreur lors de la mise à jour du service" };
  }
}

// Supprimer un service
export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath("/admin/services");
    revalidatePath("/activites");
    revalidatePath("/restauration");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du service:", error);
    return { success: false, error: "Erreur lors de la suppression du service" };
  }
}

// Activer/Désactiver un service
export async function toggleServiceActive(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return { success: false, error: "Service non trouvé" };
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });

    revalidatePath("/admin/services");
    revalidatePath("/activites");
    revalidatePath("/restauration");

    return { success: true, data: updatedService };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Mettre en vedette un service
export async function toggleServiceFeatured(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return { success: false, error: "Service non trouvé" };
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { isFeatured: !service.isFeatured },
    });

    revalidatePath("/admin/services");
    revalidatePath("/activites");
    revalidatePath("/restauration");
    revalidatePath("/");

    return { success: true, data: updatedService };
  } catch (error) {
    console.error("Erreur lors du changement de vedette:", error);
    return { success: false, error: "Erreur lors du changement de vedette" };
  }
}
