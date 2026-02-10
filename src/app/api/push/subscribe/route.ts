import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, type } = body;

    console.log("[Push Subscribe] Requete recue:", { type, tokenLength: token?.length });

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    if (type !== "admin" && type !== "visitor") {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    let userId: string | null = null;

    if (type === "admin") {
      const session = await auth();
      if (!session?.user?.id) {
        console.warn("[Push Subscribe] Session admin invalide");
        return NextResponse.json({ error: "Non autorise" }, { status: 401 });
      }
      userId = session.user.id;
    }

    await prisma.pushSubscription.upsert({
      where: { token },
      update: {
        type,
        userId,
        userAgent: request.headers.get("user-agent") || null,
      },
      create: {
        token,
        type,
        userId,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    console.log("[Push Subscribe] Token enregistre avec succes pour", type);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Push Subscribe] Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
