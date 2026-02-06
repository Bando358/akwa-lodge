import { Metadata } from "next";
import { getChambres } from "@/lib/actions/chambres";
import { HebergementClient } from "./hebergement-client";

export const metadata: Metadata = {
  title: "Hébergement",
  description:
    "Découvrez nos chambres et suites de luxe à Akwa Luxury Lodge. Des espaces élégants avec vue sur la mer pour un séjour inoubliable à Jacqueville.",
};

export default async function HebergementPage() {
  const result = await getChambres({ isActive: true });
  const chambresData = result.success ? result.data : [];

  // Convertir les Decimal en number pour le Client Component
  const chambres = (chambresData || []).map((chambre) => ({
    ...chambre,
    type: chambre.type || "Chambre",
    prix: Number(chambre.prix),
    prixWeekend: chambre.prixWeekend ? Number(chambre.prixWeekend) : null,
  }));

  return <HebergementClient chambres={chambres} />;
}
