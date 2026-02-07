"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

// Schéma de validation pour les paramètres
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const settingSchema = z.object({
  key: z.string().min(1, "La clé est requise"),
  value: z.string(),
  type: z.string().default("text"),
  groupe: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SettingInput = z.infer<typeof settingSchema>;

// Paramètres par défaut du site
const defaultSettings = {
  // Informations générales
  site_name: "Akwa Luxury Lodge",
  site_description: "Un havre de paix en bord de mer à Jacqueville, Côte d'Ivoire",
  site_tagline: "Luxe et sérénité au cœur de la nature",

  // Coordonnées
  contact_email: "contact@akwalodge.com",
  contact_phone: "+225 07 00 00 00 00",
  contact_whatsapp: "+225 07 00 00 00 00",
  contact_address: "Jacqueville, Côte d'Ivoire",

  // Horaires
  horaires_reception: "24h/24",
  horaires_checkin: "14:00",
  horaires_checkout: "12:00",
  horaires_restaurant: "07:00 - 22:00",
  horaires_bar: "10:00 - 00:00",
  horaires_piscine: "07:00 - 20:00",

  // Réseaux sociaux
  social_facebook: "",
  social_instagram: "",
  social_twitter: "",
  social_linkedin: "",
  social_youtube: "",
  social_tiktok: "",

  // SEO
  seo_title: "Akwa Luxury Lodge | Hôtel de luxe à Jacqueville",
  seo_description: "Découvrez l'élégance naturelle d'Akwa Luxury Lodge, votre refuge d'exception à Jacqueville. Chambres luxueuses, restaurant gastronomique, piscine infinity.",
  seo_keywords: "hotel jacqueville, hotel luxe cote ivoire, resort abidjan, lodge bord de mer",

  // Devises et paiement
  currency: "FCFA",
  payment_methods: "Espèces, Visa, Mastercard, Orange Money, MTN Money, Wave",

  // Fonctionnalités
  feature_reservation: "true",
  feature_newsletter: "true",
  feature_chat: "false",
};

// Récupérer tous les paramètres
export async function getSettings(groupe?: string) {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: groupe ? { groupe } : undefined,
      orderBy: { key: "asc" },
    });

    // Convertir en objet clé-valeur
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    // Fusionner avec les valeurs par défaut
    const mergedSettings = { ...defaultSettings, ...settingsMap };

    return { success: true, data: mergedSettings };
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return { success: false, error: "Erreur lors de la récupération des paramètres" };
  }
}

// Récupérer un paramètre par clé
export async function getSetting(key: string) {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      // Retourner la valeur par défaut si elle existe
      const defaultValue = defaultSettings[key as keyof typeof defaultSettings];
      return {
        success: true,
        data: defaultValue !== undefined ? String(defaultValue) : null,
      };
    }

    return { success: true, data: setting.value };
  } catch (error) {
    console.error("Erreur lors de la récupération du paramètre:", error);
    return { success: false, error: "Erreur lors de la récupération du paramètre" };
  }
}

// Créer ou mettre à jour un paramètre
export async function setSetting(key: string, value: string, options?: {
  type?: string;
  groupe?: string;
  label?: string;
  description?: string;
}) {
  try {
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: {
        value,
        ...(options?.type && { type: options.type }),
        ...(options?.groupe && { groupe: options.groupe }),
        ...(options?.label && { label: options.label }),
        ...(options?.description && { description: options.description }),
      },
      create: {
        key,
        value,
        type: options?.type || "text",
        groupe: options?.groupe,
        label: options?.label,
        description: options?.description,
      },
    });

    revalidatePath("/admin/parametres");
    revalidatePath("/");

    logActivity({ action: "UPDATE", entityType: "Setting", description: "Parametre modifie : " + key }).catch(() => {});

    return { success: true, data: setting };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paramètre:", error);
    return { success: false, error: "Erreur lors de la mise à jour du paramètre" };
  }
}

// Mettre à jour plusieurs paramètres
export async function setSettings(settings: Record<string, string>) {
  try {
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/parametres");
    revalidatePath("/");

    logActivity({ action: "UPDATE", entityType: "Setting", description: "Parametres modifies (" + Object.keys(settings).length + ")" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return { success: false, error: "Erreur lors de la mise à jour des paramètres" };
  }
}

// Supprimer un paramètre
export async function deleteSetting(key: string) {
  try {
    await prisma.siteSettings.delete({
      where: { key },
    });

    revalidatePath("/admin/parametres");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du paramètre:", error);
    return { success: false, error: "Erreur lors de la suppression du paramètre" };
  }
}

// Récupérer les paramètres par groupe
export async function getSettingsByGroupe(groupe: string) {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { groupe },
      orderBy: { key: "asc" },
    });

    return { success: true, data: settings };
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return { success: false, error: "Erreur lors de la récupération des paramètres" };
  }
}

// Réinitialiser les paramètres par défaut
export async function resetSettings() {
  try {
    const updates = Object.entries(defaultSettings).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/parametres");
    revalidatePath("/");

    logActivity({ action: "UPDATE", entityType: "Setting", description: "Parametres reinitialises" }).catch(() => {});

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error);
    return { success: false, error: "Erreur lors de la réinitialisation" };
  }
}
