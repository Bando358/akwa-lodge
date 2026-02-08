import { Metadata } from "next";
import { RestaurationClient } from "./restauration-client";
import { AnnoncesSection } from "@/components/public/annonces-section";
import { PromoBannerSection } from "@/components/public/promo-banner-section";
import { getPromotionsActives } from "@/lib/actions/promotions";

export const metadata: Metadata = {
  title: "Restauration",
  description:
    "Découvrez notre restaurant gastronomique à Akwa Luxury Lodge. Cuisine ivoirienne et internationale avec vue sur la mer à Jacqueville.",
};

export default async function RestaurationPage() {
  const promosResult = await getPromotionsActives("RESTAURATION");
  const promotions =
    promosResult.success && promosResult.data
      ? promosResult.data.map((p) => ({
          id: p.id,
          nom: p.nom,
          type: p.type,
          valeur: Number(p.valeur),
          codePromo: p.codePromo,
        }))
      : [];

  return (
    <>
      <PromoBannerSection cible="RESTAURATION" />
      <RestaurationClient promotions={promotions} />
      <AnnoncesSection position="RESTAURATION" variant="dialog" />
    </>
  );
}
