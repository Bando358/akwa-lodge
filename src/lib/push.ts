import admin from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

async function sendPush(type: "admin" | "visitor", title: string, body: string, url?: string) {
  try {
    if (!admin.apps.length) return;

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { type },
      select: { id: true, token: true },
    });

    if (subscriptions.length === 0) return;

    const tokens = subscriptions.map((s) => s.token);

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: { url: url || "/" },
      webpush: {
        fcmOptions: { link: url || "/" },
      },
    });

    // Supprimer les tokens invalides
    const invalidTokenIds: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error &&
        (resp.error.code === "messaging/registration-token-not-registered" ||
          resp.error.code === "messaging/invalid-registration-token")
      ) {
        invalidTokenIds.push(subscriptions[idx].id);
      }
    });

    if (invalidTokenIds.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { id: { in: invalidTokenIds } },
      });
    }
  } catch (error) {
    console.error(`[Push] Erreur envoi ${type}:`, error);
  }
}

export async function sendPushToAdmins(title: string, body: string, url?: string) {
  return sendPush("admin", title, body, url);
}

export async function sendPushToVisitors(title: string, body: string, url?: string) {
  return sendPush("visitor", title, body, url);
}
