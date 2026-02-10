"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { notifyNewNewsletter } from "@/lib/mail";
import { notifyWhatsAppNewNewsletter } from "@/lib/whatsapp";
import { logActivity } from "@/lib/activity-log";
import { sendPushToAdmins } from "@/lib/push";
import { requireAdmin } from "@/lib/auth";

// Schéma de validation pour les abonnés newsletter
const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
  nom: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  source: z.string().optional().nullable(),
});

// Récupérer tous les abonnés
export async function getNewsletterSubscribers(options?: {
  isActive?: boolean;
  limit?: number;
  search?: string;
}) {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.search && {
          OR: [
            { email: { contains: options.search, mode: "insensitive" } },
            { nom: { contains: options.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: subscribers };
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnés:", error);
    return { success: false, error: "Erreur lors de la récupération des abonnés" };
  }
}

// Récupérer un abonné par ID
export async function getNewsletterSubscriberById(id: string) {
  try {
    const subscriber = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return { success: false, error: "Abonné non trouvé" };
    }

    return { success: true, data: subscriber };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'abonné:", error);
    return { success: false, error: "Erreur lors de la récupération de l'abonné" };
  }
}

// S'abonner à la newsletter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function subscribeNewsletter(data: any) {
  try {
    const validatedData = newsletterSchema.parse(data);

    // Vérifier si l'email existe déjà
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return { success: false, error: "Cet email est déjà inscrit à la newsletter" };
      }
      // Réactiver l'abonnement
      const subscriber = await prisma.newsletter.update({
        where: { email: validatedData.email },
        data: { isActive: true },
      });
      return { success: true, data: subscriber };
    }

    const subscriber = await prisma.newsletter.create({
      data: validatedData,
    });

    revalidatePath("/admin/newsletter");

    // Notifications aux admins (en arrière-plan, sans bloquer)
    notifyNewNewsletter({ email: validatedData.email }).catch(() => {});
    notifyWhatsAppNewNewsletter({ email: validatedData.email }).catch(() => {});
    sendPushToAdmins(
      "Nouvel abonne newsletter",
      validatedData.email,
      "/admin/newsletter"
    ).catch(() => {});

    return { success: true, data: subscriber };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de l'inscription:", error);
    return { success: false, error: "Erreur lors de l'inscription" };
  }
}

// Se désabonner de la newsletter
export async function unsubscribeNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return { success: false, error: "Email non trouvé" };
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    revalidatePath("/admin/newsletter");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du désabonnement:", error);
    return { success: false, error: "Erreur lors du désabonnement" };
  }
}

// Supprimer un abonné
export async function deleteNewsletterSubscriber(id: string) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.newsletter.delete({
      where: { id },
    });

    revalidatePath("/admin/newsletter");

    logActivity({ action: "DELETE", entityType: "Newsletter", entityId: id, description: "Abonne newsletter supprime" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Supprimer plusieurs abonnés
export async function deleteNewsletterSubscribers(ids: string[]) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.newsletter.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/newsletter");

    logActivity({ action: "DELETE", entityType: "Newsletter", description: "Abonnes newsletter supprimes (" + ids.length + ")" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Activer/Désactiver un abonné
export async function toggleNewsletterSubscriberActive(id: string) {
  try {
    const subscriber = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return { success: false, error: "Abonné non trouvé" };
    }

    const updatedSubscriber = await prisma.newsletter.update({
      where: { id },
      data: { isActive: !subscriber.isActive },
    });

    revalidatePath("/admin/newsletter");

    logActivity({ action: "TOGGLE", entityType: "Newsletter", entityId: id, description: "Abonne " + (updatedSubscriber.isActive ? "active" : "desactive") + " : " + updatedSubscriber.email }).catch(() => {});

    return { success: true, data: updatedSubscriber };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Statistiques newsletter
export async function getNewsletterStats() {
  try {
    const [total, actifs, inactifs] = await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { isActive: true } }),
      prisma.newsletter.count({ where: { isActive: false } }),
    ]);

    return {
      success: true,
      data: { total, actifs, inactifs },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

// Exporter les emails
export async function exportNewsletterEmails(activeOnly: boolean = true) {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      select: { email: true, nom: true },
      orderBy: { email: "asc" },
    });

    return { success: true, data: subscribers };
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    return { success: false, error: "Erreur lors de l'export" };
  }
}
