import { Metadata } from "next";
import { getChambres } from "@/lib/actions/chambres";
import { getPromotionsActives } from "@/lib/actions/promotions";
import { HebergementClient } from "./hebergement-client";
import { AnnoncesSection } from "@/components/public/annonces-section";

export const metadata: Metadata = {
  title: "Hébergement",
  description:
    "Découvrez nos chambres et suites de luxe à Akwa Luxury Lodge. Des espaces élégants avec vue sur la mer pour un séjour inoubliable à Jacqueville.",
};

export default async function HebergementPage() {
  const [result, promosResult] = await Promise.all([
    getChambres({ isActive: true }),
    getPromotionsActives("CHAMBRE"),
  ]);

  const chambresData = result.success ? result.data : [];

  // Convertir les Decimal en number pour le Client Component
  const chambres = (chambresData || []).map((chambre) => ({
    ...chambre,
    type: chambre.type || "Chambre",
    prix: Number(chambre.prix),
    prixWeekend: chambre.prixWeekend ? Number(chambre.prixWeekend) : null,
  }));

  // Sérialiser les promotions pour le Client Component
  const promotions =
    promosResult.success && promosResult.data
      ? promosResult.data.map((p) => ({
          id: p.id,
          nom: p.nom,
          type: p.type,
          valeur: Number(p.valeur),
          cible: p.cible,
          chambreId: p.chambreId,
          codePromo: p.codePromo,
        }))
      : [];

  return (
    <>
      <HebergementClient chambres={chambres} promotions={promotions} />
      <AnnoncesSection position="HEBERGEMENT" variant="dialog" />
    </>
  );
}
