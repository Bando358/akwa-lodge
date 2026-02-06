import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/users";
import { EditUserForm } from "./edit-form";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <EditUserForm user={result.data} />;
}
