"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, ChevronRight } from "lucide-react";

interface Promotion {
  id: string;
  nom: string;
  description: string | null;
  type: string;
  valeur: number;
  codePromo: string | null;
  conditions: string | null;
}

interface PromoBannerClientProps {
  promotions: Promotion[];
}

function formatPromoValue(promo: Promotion): string {
  if (promo.type === "POURCENTAGE") return `-${promo.valeur}%`;
  if (promo.type === "MONTANT_FIXE")
    return `-${new Intl.NumberFormat("fr-FR").format(promo.valeur)} FCFA`;
  return promo.nom;
}

export function PromoBannerClient({ promotions }: PromoBannerClientProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (dismissed || promotions.length === 0) return null;

  const promo = promotions[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-500 text-white overflow-hidden"
      >
        <div className="container mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Tag className="h-4 w-4 shrink-0" />
              <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  {formatPromoValue(promo)}
                </span>
                <span className="text-sm truncate">{promo.nom}</span>
                {promo.codePromo && (
                  <code className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono font-bold hidden sm:inline">
                    {promo.codePromo}
                  </code>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {promotions.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentIndex((i) => (i + 1) % promotions.length)
                  }
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Promo suivante"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
