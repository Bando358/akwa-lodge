import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChambreBySlug } from "@/lib/actions/chambres";
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
  const result = await getChambreBySlug(slug);

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

  return <ChambreDetailClient chambre={chambreData} />;
}
