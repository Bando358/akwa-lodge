"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    // Ne pas afficher si deja repondu ou si permission deja accordee
    const dismissed = localStorage.getItem("push-visitor-dismissed");
    if (dismissed) return;
    if (Notification.permission === "granted" && localStorage.getItem("push-visitor-token")) return;
    if (Notification.permission === "denied") return;

    // Afficher apres 5 secondes
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const registerServiceWorker = useCallback(async () => {
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  }, []);

  const handleAccept = async () => {
    try {
      await registerServiceWorker();

      const { requestNotificationPermission } = await import("@/lib/firebase");
      const token = await requestNotificationPermission();

      if (token) {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, type: "visitor" }),
        });
        localStorage.setItem("push-visitor-token", token);
      }
    } catch (error) {
      console.error("[Push] Erreur inscription visiteur:", error);
    }
    localStorage.setItem("push-visitor-dismissed", "true");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("push-visitor-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:bg-zinc-900/95">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Restez informe(e)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recevez nos offres et promotions exclusives directement.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="default" className="h-8 text-xs" onClick={handleAccept}>
                Accepter
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={handleDismiss}>
                Non merci
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
