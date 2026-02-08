import { Metadata } from "next";
import { ActivitesClient } from "./activites-client";
import { AnnoncesSection } from "@/components/public/annonces-section";
import { PromoBannerSection } from "@/components/public/promo-banner-section";
import { getPromotionsActives } from "@/lib/actions/promotions";

export const metadata: Metadata = {
  title: "Activités",
  description:
    "Découvrez nos activités et loisirs à Akwa Luxury Lodge. Plage privée, sports nautiques, piscine et bien plus à Jacqueville.",
};

export default async function ActivitesPage() {
  const promosResult = await getPromotionsActives("ACTIVITE");
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
      <PromoBannerSection cible="ACTIVITE" />
      <ActivitesClient promotions={promotions} />
      <AnnoncesSection position="ACTIVITES" variant="dialog" />
    </>
  );
}
