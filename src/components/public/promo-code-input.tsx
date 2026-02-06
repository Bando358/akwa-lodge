"use client";

import { useState } from "react";
import { Check, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { verifyPromoCode } from "@/lib/actions/promotions";
import { PromotionCible } from "@prisma/client";

type ValidatedPromotion = {
  id: string;
  nom: string;
  type: string;
  valeur: number;
  cible: string;
  conditions: string | null;
};

interface PromoCodeInputProps {
  cible?: PromotionCible;
  onPromoApplied?: (promotion: ValidatedPromotion | null) => void;
  className?: string;
}

export function PromoCodeInput({
  cible,
  onPromoApplied,
  className,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<ValidatedPromotion | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error("Veuillez entrer un code promo");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyPromoCode(code.trim(), cible);

      if (result.success && result.data) {
        const promo: ValidatedPromotion = {
          id: result.data.id,
          nom: result.data.nom,
          type: result.data.type,
          valeur: Number(result.data.valeur),
          cible: result.data.cible,
          conditions: result.data.conditions,
        };
        setAppliedPromo(promo);
        onPromoApplied?.(promo);
        toast.success(`Code promo "${code}" appliqué !`);
      } else {
        toast.error(result.error || "Code promo invalide");
      }
    } catch {
      toast.error("Erreur lors de la vérification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedPromo(null);
    setCode("");
    onPromoApplied?.(null);
    toast.info("Code promo retiré");
  };

  const formatValue = (type: string, valeur: number) => {
    switch (type) {
      case "POURCENTAGE":
        return `-${valeur}%`;
      case "MONTANT_FIXE":
        return `-${valeur.toLocaleString("fr-FR")} FCFA`;
      default:
        return valeur.toString();
    }
  };

  if (appliedPromo) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">{appliedPromo.nom}</p>
              <p className="text-sm text-green-600">
                Réduction: {formatValue(appliedPromo.type, appliedPromo.valeur)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:text-green-800 hover:bg-green-100"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {appliedPromo.conditions && (
          <p className="text-xs text-muted-foreground px-1">
            * {appliedPromo.conditions}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Entrez votre code promo"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="pl-10 uppercase"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleVerify} disabled={isLoading || !code.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </Button>
      </div>
    </div>
  );
}

// Composant pour afficher une promotion active
interface PromotionBadgeProps {
  type: string;
  valeur: number;
  nom?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PromotionBadge({
  type,
  valeur,
  nom,
  size = "md",
  className,
}: PromotionBadgeProps) {
  const formatValue = () => {
    switch (type) {
      case "POURCENTAGE":
        return `-${valeur}%`;
      case "MONTANT_FIXE":
        return `-${valeur.toLocaleString("fr-FR")} FCFA`;
      default:
        return nom || "Promo";
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-2 font-bold",
  };

  return (
    <Badge
      className={cn(
        "bg-red-500 hover:bg-red-600 text-white",
        sizeClasses[size],
        className
      )}
    >
      {formatValue()}
    </Badge>
  );
}

// Composant bannière de promotion
interface PromoBannerProps {
  promotion: {
    nom: string;
    type: string;
    valeur: number;
    codePromo: string | null;
    conditions: string | null;
  };
  onClose?: () => void;
  className?: string;
}

export function PromoBanner({ promotion, onClose, className }: PromoBannerProps) {
  const formatValue = () => {
    switch (promotion.type) {
      case "POURCENTAGE":
        return `-${promotion.valeur}%`;
      case "MONTANT_FIXE":
        return `-${promotion.valeur.toLocaleString("fr-FR")} FCFA`;
      default:
        return promotion.nom;
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="font-medium">{promotion.nom}</span>
          <Badge variant="secondary" className="text-lg font-bold">
            {formatValue()}
          </Badge>
          {promotion.codePromo && (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">avec le code:</span>
              <code className="bg-white/20 px-3 py-1 rounded font-mono font-bold">
                {promotion.codePromo}
              </code>
            </div>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {promotion.conditions && (
          <p className="text-center text-xs opacity-70 mt-1">
            * {promotion.conditions}
          </p>
        )}
      </div>
    </div>
  );
}
