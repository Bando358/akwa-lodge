import { Metadata } from "next";
import { EvenementsClient } from "./evenements-client";
import { AnnoncesSection } from "@/components/public/annonces-section";
import { PromoBannerSection } from "@/components/public/promo-banner-section";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Organisez vos événements à Akwa Luxury Lodge. Mariages, anniversaires, réceptions corporate dans un cadre paradisiaque à Jacqueville.",
};

export default function EvenementsPage() {
  return (
    <>
      <PromoBannerSection cible="EVENEMENT" />
      <EvenementsClient />
      <AnnoncesSection position="EVENEMENTS" variant="dialog" />
    </>
  );
}
