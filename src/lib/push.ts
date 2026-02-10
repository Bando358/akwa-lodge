import admin from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

async function sendPush(type: "admin" | "visitor", title: string, body: string, url?: string) {
  try {
    if (!admin.apps.length) {
      console.warn("[Push] Firebase Admin non initialise, abandon envoi");
      return;
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { type },
      select: { id: true, token: true },
    });

    console.log(`[Push] ${type}: ${subscriptions.length} abonne(s) trouve(s)`);

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

    console.log(`[Push] ${type}: ${response.successCount} succes, ${response.failureCount} echec(s)`);

    // Log les erreurs detaillees
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error) {
        console.error(`[Push] Token ${idx} erreur:`, resp.error.code, resp.error.message);
      }
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
      console.log(`[Push] Suppression de ${invalidTokenIds.length} token(s) invalide(s)`);
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
