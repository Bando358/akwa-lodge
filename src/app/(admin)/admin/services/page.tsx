import Link from "next/link";
import { Plus, UtensilsCrossed } from "lucide-react";
import { getServices } from "@/lib/actions/services";
import { getUserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServicesTable } from "./services-table";

export default async function ServicesPage() {
  const [result, userRole] = await Promise.all([
    getServices(),
    getUserRole(),
  ]);
  const servicesData = result.success ? result.data : [];

  // Convertir les Decimal en number pour le Client Component
  const services = (servicesData || []).map((service) => ({
    ...service,
    prix: service.prix ? Number(service.prix) : null,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            Services
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les services proposés par votre établissement
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau service
          </Link>
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {services?.filter((s) => s.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En vedette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {services?.filter((s) => s.isFeatured).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Restauration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {services?.filter((s) => s.type === "RESTAURATION").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des services */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
          <CardDescription>
            Cliquez sur un service pour le modifier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services && services.length > 0 ? (
            <ServicesTable services={services} userRole={userRole ?? undefined} />
          ) : (
            <div className="text-center py-12">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun service</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer votre premier service
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/services/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un service
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
