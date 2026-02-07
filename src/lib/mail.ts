import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = process.env.EMAIL_FROM || "noreply@akwaluxurylodge.com";

function isMailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

async function getAdminEmails(): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { email: true },
  });
  return admins.map((a) => a.email);
}

export async function notifyAdmins(subject: string, html: string) {
  if (!isMailConfigured()) {
    console.log("[Mail] SMTP non configuré — notification ignorée:", subject);
    return;
  }

  try {
    const adminEmails = await getAdminEmails();
    if (adminEmails.length === 0) return;

    await transporter.sendMail({
      from: `"Akwa Luxury Lodge" <${FROM}>`,
      to: adminEmails.join(", "),
      subject,
      html,
    });
  } catch (error) {
    console.error("[Mail] Erreur d'envoi de notification:", error);
  }
}

// ── Templates de notification ──────────────────────────────────

export async function notifyNewReservation(data: {
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

  await notifyAdmins(
    `Nouvelle réservation de ${data.prenom} ${data.nom}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1a3c34;">Nouvelle demande de réservation</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Nom</td><td style="padding: 8px;">${data.prenom} ${data.nom}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${data.email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Téléphone</td><td style="padding: 8px;">${data.telephone}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Arrivée</td><td style="padding: 8px;">${arrivee}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Départ</td><td style="padding: 8px;">${depart}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Personnes</td><td style="padding: 8px;">${data.nombreAdultes}</td></tr>
        ${data.message ? `<tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${data.message}</td></tr>` : ""}
      </table>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/admin/reservations" style="background: #1a3c34; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Voir dans l'admin
        </a>
      </p>
    </div>
    `
  );
}

export async function notifyNewContact(data: {
  nom: string;
  prenom?: string | null;
  email: string;
  sujet: string;
  message: string;
}) {
  const sujetLabels: Record<string, string> = {
    INFORMATION: "Information",
    RESERVATION: "Réservation",
    EVENEMENT: "Événement",
    RECLAMATION: "Réclamation",
    PARTENARIAT: "Partenariat",
    AUTRE: "Autre",
  };

  await notifyAdmins(
    `Nouveau message de contact — ${sujetLabels[data.sujet] || data.sujet}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1a3c34;">Nouveau message de contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Nom</td><td style="padding: 8px;">${data.prenom ? data.prenom + " " : ""}${data.nom}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${data.email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Sujet</td><td style="padding: 8px;">${sujetLabels[data.sujet] || data.sujet}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${data.message}</td></tr>
      </table>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/admin/contacts" style="background: #1a3c34; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Voir dans l'admin
        </a>
      </p>
    </div>
    `
  );
}

export async function notifyNewNewsletter(data: {
  email: string;
}) {
  await notifyAdmins(
    `Nouvel abonné newsletter : ${data.email}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1a3c34;">Nouvel abonné à la newsletter</h2>
      <p style="font-size: 16px;">L'adresse <strong>${data.email}</strong> vient de s'inscrire à la newsletter.</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/admin/newsletter" style="background: #1a3c34; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Voir les abonnés
        </a>
      </p>
    </div>
    `
  );
}
