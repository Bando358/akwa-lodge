import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChambreBySlug } from "@/lib/actions/chambres";
import { getPromotionsActives } from "@/lib/actions/promotions";
import { ChambreDetailClient } from "./chambre-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getChambreBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Chambre non trouvée",
    };
  }

  return {
    title: result.data.nom,
    description: result.data.descriptionCourte,
  };
}

export default async function ChambreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [result, promosResult] = await Promise.all([
    getChambreBySlug(slug),
    getPromotionsActives("CHAMBRE"),
  ]);

  if (!result.success || !result.data) {
    notFound();
  }

  const chambre = result.data;

  // Convertir les Decimal en number
  const chambreData = {
    id: chambre.id,
    nom: chambre.nom,
    slug: chambre.slug,
    type: chambre.type,
    description: chambre.description,
    descriptionCourte: chambre.descriptionCourte,
    videoUrl: chambre.videoUrl,
    prix: Number(chambre.prix),
    prixWeekend: chambre.prixWeekend ? Number(chambre.prixWeekend) : null,
    capacite: chambre.capacite,
    superficie: chambre.superficie,
    nombreLits: chambre.nombreLits,
    typeLit: chambre.typeLit,
    vue: chambre.vue,
    equipements: chambre.equipements,
    caracteristiques: chambre.caracteristiques,
    images: chambre.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
    })),
  };

  // Trouver la promo applicable à cette chambre
  const allPromos =
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

  // Promo spécifique à cette chambre OU promo générale CHAMBRE
  const promo =
    allPromos.find((p) => p.chambreId === chambre.id) ||
    allPromos.find((p) => !p.chambreId) ||
    null;

  return <ChambreDetailClient chambre={chambreData} promotion={promo} />;
}
