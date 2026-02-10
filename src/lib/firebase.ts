import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;

async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (messaging) return messaging;

  const supported = await isSupported();
  if (!supported) return null;

  messaging = getMessaging(app);
  return messaging;
}

export async function requestNotificationPermission(
  swRegistration?: ServiceWorkerRegistration
): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[Firebase] Permission refusee");
      return null;
    }

    const msg = await getFirebaseMessaging();
    if (!msg) {
      console.warn("[Firebase] Messaging non supporte");
      return null;
    }

    // Utiliser le SW fourni ou en chercher un existant (scope "/" par defaut)
    const registration = swRegistration || await navigator.serviceWorker.getRegistration("/");

    if (!registration) {
      console.error("[Firebase] Aucun service worker trouve");
      return null;
    }

    // Attendre que le SW soit actif
    if (!registration.active) {
      await new Promise<void>((resolve) => {
        const sw = registration.installing || registration.waiting;
        if (!sw) { resolve(); return; }
        sw.addEventListener("statechange", () => {
          if (sw.state === "activated") resolve();
        });
      });
    }

    console.log("[Firebase] SW actif, demande du token...");

    const token = await getToken(msg, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("[Firebase] Token obtenu:", token ? token.substring(0, 20) + "..." : "ECHEC");
    return token;
  } catch (error) {
    console.error("[Firebase] Erreur lors de la demande de permission:", error);
    return null;
  }
}

export async function onForegroundMessage(callback: (payload: unknown) => void) {
  const msg = await getFirebaseMessaging();
  if (!msg) return;

  onMessage(msg, (payload) => {
    callback(payload);
  });
}

export { app };
