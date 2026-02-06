import { notFound } from "next/navigation";
import { getChambreById } from "@/lib/actions/chambres";
import { EditChambreForm } from "./edit-chambre-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChambrePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getChambreById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const chambre = result.data;

  // Préparer les données pour le formulaire
  const chambreData = {
    id: chambre.id,
    nom: chambre.nom,
    slug: chambre.slug,
    type: chambre.type,
    description: chambre.description,
    descriptionCourte: chambre.descriptionCourte,
    videoUrl: chambre.videoUrl || "",
    prix: Number(chambre.prix),
    prixWeekend: chambre.prixWeekend ? Number(chambre.prixWeekend) : undefined,
    capacite: chambre.capacite,
    superficie: chambre.superficie || undefined,
    nombreLits: chambre.nombreLits,
    typeLit: chambre.typeLit || "",
    vue: chambre.vue || "",
    equipements: chambre.equipements,
    caracteristiques: chambre.caracteristiques,
    images: chambre.images.map((img) => img.url),
    isActive: chambre.isActive,
    isFeatured: chambre.isFeatured,
    ordre: chambre.ordre,
  };

  return <EditChambreForm chambre={chambreData} />;
}
