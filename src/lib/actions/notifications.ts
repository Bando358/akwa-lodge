"use server";

/**
 * Tester la notification WhatsApp via CallMeBot
 */
export async function testWhatsAppNotification(phone: string, apiKey: string) {
  if (!phone || !apiKey) {
    return { success: false, error: "Numero de telephone et cle API requis" };
  }

  try {
    const { sendTestWhatsApp } = await import("@/lib/whatsapp");
    const result = await sendTestWhatsApp(phone, apiKey);
    return result;
  } catch (error) {
    console.error("Erreur test WhatsApp:", error);
    const message = error instanceof Error ? error.message : "Erreur lors du test";
    return { success: false, error: message };
  }
}
