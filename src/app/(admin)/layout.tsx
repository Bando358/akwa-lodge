import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Si pas connecté, rediriger vers login
  if (!session?.user) {
    redirect("/admin/login");
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
