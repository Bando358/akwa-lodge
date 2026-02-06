import { notFound } from "next/navigation";
import { getAnnonceById } from "@/lib/actions/annonces";
import { EditAnnonceForm } from "./edit-form";

interface EditAnnoncePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnoncePage({
  params,
}: EditAnnoncePageProps) {
  const { id } = await params;
  const result = await getAnnonceById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const annonce = {
    ...result.data,
    dateDebut: result.data.dateDebut.toISOString().split("T")[0],
    dateFin: result.data.dateFin.toISOString().split("T")[0],
    promotion: result.data.promotion
      ? {
          ...result.data.promotion,
          valeur: Number(result.data.promotion.valeur),
        }
      : null,
  };

  return <EditAnnonceForm annonce={annonce} />;
}
