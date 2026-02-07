/**
 * Notifications WhatsApp via CallMeBot (gratuit, sans compte externe)
 *
 * Configuration par admin :
 * 1. Envoyer "I allow callmebot to send me messages" au +34 623 78 95 80 sur WhatsApp
 * 2. Recevoir la cle API en reponse
 * 3. Renseigner son numero et sa cle API dans son profil admin (Utilisateurs > Modifier)
 *
 * API : https://api.callmebot.com/whatsapp.php?phone=PHONE&text=MESSAGE&apikey=KEY
 */

import { prisma } from "@/lib/prisma";

interface AdminRecipient {
  telephone: string;
  whatsappApiKey: string;
}

async function getAdminRecipients(): Promise<AdminRecipient[]> {
  try {
    const admins = await prisma.user.findMany({
      where: {
        isActive: true,
        role: "ADMIN",
        telephone: { not: null },
        whatsappApiKey: { not: null },
      },
      select: { telephone: true, whatsappApiKey: true },
    });

    return admins.filter(
      (a): a is { telephone: string; whatsappApiKey: string } =>
        !!a.telephone && !!a.whatsappApiKey
    );
  } catch (error) {
    console.error("[WhatsApp] Erreur recuperation des admins:", error);
    return [];
  }
}

async function sendWhatsApp(
  phone: string,
  apiKey: string,
  message: string
): Promise<void> {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${cleanPhone}&text=${encodedMessage}&apikey=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CallMeBot error ${response.status}: ${text}`);
  }
}

export async function notifyWhatsApp(message: string): Promise<void> {
  const recipients = await getAdminRecipients();

  if (recipients.length === 0) {
    console.log("[WhatsApp] Aucun admin configure - notification ignoree");
    return;
  }

  for (const { telephone, whatsappApiKey } of recipients) {
    try {
      await sendWhatsApp(telephone, whatsappApiKey, message);
    } catch (error) {
      console.error(`[WhatsApp] Erreur envoi a ${telephone}:`, error);
    }
  }
}

/**
 * Envoyer un message de test a un numero specifique
 */
export async function sendTestWhatsApp(
  phone: string,
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const message = "Test Akwa Luxury Lodge - Les notifications WhatsApp fonctionnent !";
    await sendWhatsApp(phone, apiKey, message);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// -- Templates de notification -----------------------------------------------

export async function notifyWhatsAppNewReservation(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateArrivee: Date;
  dateDepart: Date;
  nombreAdultes: number;
  message?: string | null;
}) {
  const arrivee = data.dateArrivee.toLocaleDateString("fr-FR");
  const depart = data.dateDepart.toLocaleDateString("fr-FR");

  const msg =
    `Nouvelle reservation\n` +
    `${data.prenom} ${data.nom}\n` +
    `${data.email}\n` +
    `${data.telephone}\n` +
    `${arrivee} - ${depart}\n` +
    `${data.nombreAdultes} adulte(s)` +
    (data.message ? `\n${data.message}` : "");

  await notifyWhatsApp(msg);
}

export async function notifyWhatsAppNewContact(data: {
  nom: string;
  prenom?: string | null;
  email: string;
  sujet: string;
  message: string;
}) {
  const sujetLabels: Record<string, string> = {
    INFORMATION: "Information",
    RESERVATION: "Reservation",
    EVENEMENT: "Evenement",
    RECLAMATION: "Reclamation",
    PARTENARIAT: "Partenariat",
    AUTRE: "Autre",
  };

  const msg =
    `Nouveau message de contact\n` +
    `${data.prenom ? data.prenom + " " : ""}${data.nom}\n` +
    `${data.email}\n` +
    `Sujet : ${sujetLabels[data.sujet] || data.sujet}\n` +
    `${data.message}`;

  await notifyWhatsApp(msg);
}

export async function notifyWhatsAppNewNewsletter(data: { email: string }) {
  const msg = `Nouvel abonne newsletter\n${data.email}`;
  await notifyWhatsApp(msg);
}
