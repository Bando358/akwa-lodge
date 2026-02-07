import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const [reservations, contacts] = await Promise.all([
      prisma.reservation.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.contact.count({ where: { isRead: false, isArchived: false } }),
    ]);

    return NextResponse.json({
      reservations,
      contacts,
      total: reservations + contacts,
    });
  } catch (error) {
    console.error("Erreur notifications check:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
