import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  console.log("[Firebase Admin] projectId:", projectId ? "OK" : "MANQUANT");
  console.log("[Firebase Admin] clientEmail:", clientEmail ? "OK" : "MANQUANT");
  console.log("[Firebase Admin] privateKey:", privateKey ? `OK (${privateKey.length} chars)` : "MANQUANT");

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("[Firebase Admin] Initialise avec succes");
    } catch (error) {
      console.error("[Firebase Admin] ERREUR initialisation:", error);
    }
  } else {
    console.warn("[Firebase Admin] Variables manquantes, push desactive");
  }
}

export default admin;
