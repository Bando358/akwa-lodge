import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";
import { getEvenements } from "@/lib/actions/evenements";
import { getUserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvenementsTable } from "./evenements-table";

export default async function EvenementsPage() {
  const [result, userRole] = await Promise.all([
    getEvenements(),
    getUserRole(),
  ]);
  const evenementsData = result.success ? result.data : [];

  // Convertir les Decimal en number pour le Client Component
  const evenements = (evenementsData || []).map((evenement) => ({
    ...evenement,
    prix: evenement.prix ? Number(evenement.prix) : null,
  }));

  const now = new Date();
  const upcoming = evenements.filter((e) => new Date(e.dateDebut) >= now);
  const past = evenements.filter((e) => new Date(e.dateDebut) < now);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            Événements
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les événements et conférences de votre établissement
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/evenements/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel événement
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
            <div className="text-2xl font-bold">{evenements?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              À venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {upcoming.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {past.length}
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
              {evenements?.filter((e) => e.isFeatured).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des événements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
          <CardDescription>
            Cliquez sur un événement pour le modifier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evenements && evenements.length > 0 ? (
            <EvenementsTable evenements={evenements} userRole={userRole ?? undefined} />
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun événement</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer votre premier événement
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/evenements/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un événement
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
