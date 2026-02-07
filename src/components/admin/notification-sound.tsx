"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface NotifCounts {
  reservations: number;
  contacts: number;
  total: number;
}

const POLL_INTERVAL = 15_000; // 15 secondes

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    // Double bip court et agreable (La5 = 880Hz)
    [0, 0.15].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + delay + 0.15
      );
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.15);
    });
  } catch {
    // Web Audio API non disponible
  }
}

export function NotificationSound() {
  const prevCounts = useRef<NotifCounts | null>(null);
  const isFirstLoad = useRef(true);

  const checkNotifications = useCallback(async () => {
    // Ne pas poller si l'onglet est masque
    if (document.visibilityState !== "visible") return;

    try {
      const res = await fetch("/api/admin/notifications/check");
      if (!res.ok) return;

      const data: NotifCounts = await res.json();

      // Premier chargement : set baseline sans son
      if (isFirstLoad.current) {
        prevCounts.current = data;
        isFirstLoad.current = false;
        return;
      }

      const prev = prevCounts.current;
      if (!prev) {
        prevCounts.current = data;
        return;
      }

      // Detecter les nouveaux elements
      const newReservations = data.reservations - prev.reservations;
      const newContacts = data.contacts - prev.contacts;

      if (newReservations > 0 || newContacts > 0) {
        playNotificationSound();

        if (newReservations > 0) {
          toast.info(
            newReservations === 1
              ? "Nouvelle reservation recue !"
              : `${newReservations} nouvelles reservations !`,
            { duration: 6000 }
          );
        }

        if (newContacts > 0) {
          toast.info(
            newContacts === 1
              ? "Nouveau message de contact !"
              : `${newContacts} nouveaux messages !`,
            { duration: 6000 }
          );
        }
      }

      prevCounts.current = data;
    } catch {
      // Silencieux en cas d'erreur reseau
    }
  }, []);

  useEffect(() => {
    // Check initial
    checkNotifications();

    // Polling
    const interval = setInterval(checkNotifications, POLL_INTERVAL);

    // Reprendre le polling quand l'onglet redevient visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkNotifications();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkNotifications]);

  // Composant invisible (pas de rendu)
  return null;
}
