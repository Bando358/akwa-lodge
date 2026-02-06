"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ReservationStatut } from "@prisma/client";

// Schéma de validation pour les réservations
const reservationSchema = z.object({
  civilite: z.string().optional().nullable(),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  pays: z.string().optional().nullable(),
  ville: z.string().optional().nullable(),
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  nombreAdultes: z.number().int().positive().default(1),
  nombreEnfants: z.number().int().min(0).default(0),
  chambreId: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  demandesSpeciales: z.array(z.string()).default([]),
  statut: z.nativeEnum(ReservationStatut).default("EN_ATTENTE"),
  source: z.string().optional().nullable(),
  notesInternes: z.string().optional().nullable(),
});

type ReservationInput = z.infer<typeof reservationSchema>;

// Récupérer toutes les réservations
export async function getReservations(options?: {
  statut?: ReservationStatut;
  dateDebut?: Date;
  dateFin?: Date;
  limit?: number;
}) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        ...(options?.statut && { statut: options.statut }),
        ...(options?.dateDebut && { dateArrivee: { gte: options.dateDebut } }),
        ...(options?.dateFin && { dateArrivee: { lte: options.dateFin } }),
      },
      include: {
        chambre: {
          select: {
            id: true,
            nom: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...(options?.limit && { take: options.limit }),
    });

    return { success: true, data: reservations };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return { success: false, error: "Erreur lors de la récupération des réservations" };
  }
}

// Récupérer une réservation par ID
export async function getReservationById(id: string) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        chambre: true,
      },
    });

    if (!reservation) {
      return { success: false, error: "Réservation non trouvée" };
    }

    return { success: true, data: reservation };
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error);
    return { success: false, error: "Erreur lors de la récupération de la réservation" };
  }
}

// Créer une réservation
export async function createReservation(data: ReservationInput) {
  try {
    const validatedData = reservationSchema.parse(data);

    const reservation = await prisma.reservation.create({
      data: validatedData,
    });

    revalidatePath("/admin/reservations");
    revalidatePath("/admin");

    return { success: true, data: reservation };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de la réservation:", error);
    return { success: false, error: "Erreur lors de la création de la réservation" };
  }
}

// Mettre à jour une réservation
export async function updateReservation(id: string, data: Partial<ReservationInput>) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return { success: false, error: "Réservation non trouvée" };
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/reservations");
    revalidatePath(`/admin/reservations/${id}`);
    revalidatePath("/admin");

    return { success: true, data: reservation };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la réservation" };
  }
}

// Changer le statut d'une réservation
export async function updateReservationStatut(id: string, statut: ReservationStatut) {
  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { statut },
    });

    revalidatePath("/admin/reservations");
    revalidatePath(`/admin/reservations/${id}`);
    revalidatePath("/admin");

    return { success: true, data: reservation };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Supprimer une réservation
export async function deleteReservation(id: string) {
  try {
    await prisma.reservation.delete({
      where: { id },
    });

    revalidatePath("/admin/reservations");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    return { success: false, error: "Erreur lors de la suppression de la réservation" };
  }
}

// Statistiques des réservations
export async function getReservationStats() {
  try {
    const [total, enAttente, confirmees, annulees, terminees] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.reservation.count({ where: { statut: "CONFIRMEE" } }),
      prisma.reservation.count({ where: { statut: "ANNULEE" } }),
      prisma.reservation.count({ where: { statut: "TERMINEE" } }),
    ]);

    return {
      success: true,
      data: { total, enAttente, confirmees, annulees, terminees },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

// Réservations récentes
export async function getRecentReservations(limit: number = 5) {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        chambre: {
          select: {
            nom: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, data: reservations };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations récentes:", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}
