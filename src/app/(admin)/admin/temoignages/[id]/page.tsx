import { notFound } from "next/navigation";
import { getTemoignageById } from "@/lib/actions/temoignages";
import { EditTemoignageForm } from "./edit-form";

interface EditTemoignagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemoignagePage({
  params,
}: EditTemoignagePageProps) {
  const { id } = await params;
  const result = await getTemoignageById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const temoignage = {
    ...result.data,
    dateVisite: result.data.dateVisite
      ? result.data.dateVisite.toISOString().split("T")[0]
      : null,
  };

  return <EditTemoignageForm temoignage={temoignage} />;
}
