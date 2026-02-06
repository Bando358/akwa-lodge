"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour les contacts
const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  prenom: z.string().optional(),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  sujet: z.enum([
    "INFORMATION",
    "RESERVATION",
    "EVENEMENT",
    "RECLAMATION",
    "PARTENARIAT",
    "AUTRE",
  ]),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
});

type ContactInput = z.infer<typeof contactSchema>;

// Créer un message de contact
export async function createContact(data: ContactInput) {
  try {
    const validatedData = contactSchema.parse(data);

    const contact = await prisma.contact.create({
      data: validatedData,
    });

    revalidatePath("/admin/contacts");

    return { success: true, data: contact };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création du contact:", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

// Récupérer tous les contacts
export async function getContacts(options?: {
  isRead?: boolean;
  isArchived?: boolean;
  limit?: number;
}) {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        ...(options?.isRead !== undefined && { isRead: options.isRead }),
        ...(options?.isArchived !== undefined && {
          isArchived: options.isArchived,
        }),
      },
      orderBy: { createdAt: "desc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: contacts };
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

// Récupérer un contact par ID
export async function getContactById(id: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return { success: false, error: "Contact non trouvé" };
    }

    return { success: true, data: contact };
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

// Marquer un contact comme lu
export async function markContactAsRead(id: string) {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/admin/contacts");

    return { success: true, data: contact };
  } catch (error) {
    console.error("Erreur lors du marquage:", error);
    return { success: false, error: "Erreur lors du marquage" };
  }
}

// Archiver un contact
export async function archiveContact(id: string) {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: { isArchived: true },
    });

    revalidatePath("/admin/contacts");

    return { success: true, data: contact };
  } catch (error) {
    console.error("Erreur lors de l'archivage:", error);
    return { success: false, error: "Erreur lors de l'archivage" };
  }
}

// Supprimer un contact
export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    revalidatePath("/admin/contacts");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Compter les contacts non lus
export async function countUnreadContacts() {
  try {
    const count = await prisma.contact.count({
      where: { isRead: false, isArchived: false },
    });

    return { success: true, data: count };
  } catch (error) {
    console.error("Erreur lors du comptage:", error);
    return { success: false, error: "Erreur lors du comptage" };
  }
}
