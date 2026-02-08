"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface NotifCounts {
  reservations: number;
  contacts: number;
  total: number;
}

const POLL_INTERVAL = 15_000; // 15 secondes

// Generer un petit WAV (double bip 880Hz) comme Blob URL
// Utilise Audio element au lieu de AudioContext pour fonctionner en arriere-plan
let beepUrl: string | null = null;

function getBeepUrl(): string {
  if (beepUrl) return beepUrl;

  const sampleRate = 8000;
  const numSamples = Math.floor(sampleRate * 0.4);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };

  // En-tete WAV
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2, true);

  // Generer les echantillons : deux bips courts a 880Hz
  const freq = 880;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    // Premier bip : 0 - 0.12s
    if (t < 0.12) {
      sample = Math.sin(2 * Math.PI * freq * t) * 0.3 * Math.exp(-t * 15);
    }
    // Silence : 0.12 - 0.15s
    // Second bip : 0.15 - 0.27s
    else if (t >= 0.15 && t < 0.27) {
      const t2 = t - 0.15;
      sample = Math.sin(2 * Math.PI * freq * t2) * 0.3 * Math.exp(-t2 * 15);
    }
    const clamped = Math.max(-32768, Math.min(32767, sample * 32767));
    view.setInt16(44 + i * 2, clamped, true);
  }

  beepUrl = URL.createObjectURL(
    new Blob([buffer], { type: "audio/wav" })
  );
  return beepUrl;
}

function playNotificationSound() {
  try {
    // Audio element fonctionne meme quand l'onglet est en arriere-plan
    const audio = new Audio(getBeepUrl());
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback : AudioContext (fonctionne si l'onglet est au premier plan)
      try {
        const ctx = new AudioContext();
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
        // Audio non disponible
      }
    });
  } catch {
    // Audio non disponible
  }
}

export function NotificationSound() {
  const prevCounts = useRef<NotifCounts | null>(null);
  const isFirstLoad = useRef(true);

  const checkNotifications = useCallback(async () => {
    // Plus de guard visibilityState : on poll meme en arriere-plan
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
            { duration: Infinity, closeButton: true }
          );
        }

        if (newContacts > 0) {
          toast.info(
            newContacts === 1
              ? "Nouveau message de contact !"
              : `${newContacts} nouveaux messages !`,
            { duration: Infinity, closeButton: true }
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

    // Polling continu (meme en arriere-plan, throttle a ~1min par le navigateur)
    const interval = setInterval(checkNotifications, POLL_INTERVAL);

    // Check immediat quand l'onglet redevient visible
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
