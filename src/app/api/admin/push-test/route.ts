import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import admin from "@/lib/firebase-admin";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // 1. Verifier Firebase Admin
    const firebaseOk = admin.apps.length > 0;

    // 2. Compter les abonnements push
    const adminSubs = await prisma.pushSubscription.findMany({
      where: { type: "admin" },
      select: { id: true, token: true, userId: true, createdAt: true },
    });
    const visitorSubs = await prisma.pushSubscription.count({
      where: { type: "visitor" },
    });

    // 3. Essayer d'envoyer une notification test si Firebase est OK et qu'il y a des tokens admin
    let sendResult = null;
    if (firebaseOk && adminSubs.length > 0) {
      try {
        const tokens = adminSubs.map((s) => s.token);
        const response = await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "Test Push Akwa Lodge",
            body: "Si vous voyez ceci, les notifications fonctionnent !",
          },
          data: { url: "/admin" },
          webpush: {
            fcmOptions: { link: "/admin" },
          },
        });

        sendResult = {
          successCount: response.successCount,
          failureCount: response.failureCount,
          errors: response.responses
            .filter((r) => !r.success)
            .map((r, i) => ({
              tokenIndex: i,
              code: r.error?.code,
              message: r.error?.message,
            })),
        };
      } catch (sendError) {
        sendResult = {
          error: sendError instanceof Error ? sendError.message : String(sendError),
        };
      }
    }

    return NextResponse.json({
      diagnostic: {
        firebaseAdminInitialized: firebaseOk,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "MANQUANT",
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "OK" : "MANQUANT",
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "OK" : "MANQUANT",
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          ? `OK (${process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY.length} chars)`
          : "MANQUANT",
      },
      subscriptions: {
        admin: adminSubs.map((s) => ({
          id: s.id,
          tokenPreview: s.token.substring(0, 20) + "...",
          userId: s.userId,
          createdAt: s.createdAt,
        })),
        adminCount: adminSubs.length,
        visitorCount: visitorSubs,
      },
      testSend: sendResult,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne" },
      { status: 500 }
    );
  }
}
