"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PushNotificationToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true);
      setIsEnabled(Notification.permission === "granted" && localStorage.getItem("push-admin-token") !== null);
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    return registration;
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const registration = await registerServiceWorker();

      const { requestNotificationPermission } = await import("@/lib/firebase");
      const token = await requestNotificationPermission(registration);

      if (!token) {
        toast.error("Permission refusee ou erreur lors de l'obtention du token");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, type: "admin" }),
      });

      if (!response.ok) throw new Error("Erreur inscription");

      localStorage.setItem("push-admin-token", token);
      setIsEnabled(true);
      toast.success("Notifications push activees");
    } catch (error) {
      console.error("[Push] Erreur activation:", error);
      toast.error("Erreur lors de l'activation des notifications");
    }
    setIsLoading(false);
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("push-admin-token");
      if (token) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
      localStorage.removeItem("push-admin-token");
      setIsEnabled(false);
      toast.success("Notifications push desactivees");
    } catch (error) {
      console.error("[Push] Erreur desactivation:", error);
      toast.error("Erreur lors de la desactivation");
    }
    setIsLoading(false);
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-muted-foreground">
        <BellOff className="h-5 w-5" />
        <div>
          <p className="font-medium">Notifications push non supportees</p>
          <p className="text-sm">Votre navigateur ne supporte pas les notifications push.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {isEnabled ? <Bell className="h-5 w-5 text-green-600" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
        <div>
          <p className="font-medium">Notifications push</p>
          <p className="text-sm text-muted-foreground">
            {isEnabled
              ? "Vous recevrez des notifications meme quand l'onglet est ferme."
              : "Activez pour recevoir des alertes (reservations, contacts, etc.)."}
          </p>
        </div>
      </div>
      <Button
        variant={isEnabled ? "outline" : "default"}
        size="sm"
        onClick={isEnabled ? handleDisable : handleEnable}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEnabled ? (
          "Desactiver"
        ) : (
          "Activer"
        )}
      </Button>
    </div>
  );
}
