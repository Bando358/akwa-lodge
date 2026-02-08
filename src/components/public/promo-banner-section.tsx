import { getPromotionsActives } from "@/lib/actions/promotions";
import { PromotionCible } from "@prisma/client";
import { PromoBannerClient } from "./promo-banner-client";

interface PromoBannerSectionProps {
  cible: PromotionCible;
}

export async function PromoBannerSection({ cible }: PromoBannerSectionProps) {
  const result = await getPromotionsActives(cible);

  if (!result.success || !result.data || result.data.length === 0) {
    return null;
  }

  const promotions = result.data.map((p) => ({
    id: p.id,
    nom: p.nom,
    description: (p as Record<string, unknown>).description as string | null,
    type: p.type,
    valeur: Number(p.valeur),
    codePromo: p.codePromo,
    conditions: (p as Record<string, unknown>).conditions as string | null,
  }));

  return <PromoBannerClient promotions={promotions} />;
}
