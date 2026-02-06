import { notFound } from "next/navigation";
import { getPromotionById } from "@/lib/actions/promotions";
import { EditPromotionForm } from "./edit-form";

interface EditPromotionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPromotionPage({
  params,
}: EditPromotionPageProps) {
  const { id } = await params;
  const result = await getPromotionById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const promotion = {
    ...result.data,
    valeur: Number(result.data.valeur),
    montantMinimum: result.data.montantMinimum ? Number(result.data.montantMinimum) : null,
    dateDebut: result.data.dateDebut.toISOString().split("T")[0],
    dateFin: result.data.dateFin.toISOString().split("T")[0],
  };

  return <EditPromotionForm promotion={promotion} />;
}
