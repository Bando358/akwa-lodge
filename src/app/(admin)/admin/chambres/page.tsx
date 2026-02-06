import Link from "next/link";
import { Plus, BedDouble } from "lucide-react";
import { getChambres } from "@/lib/actions/chambres";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChambresTable } from "./chambres-table";

export default async function ChambresPage() {
  const result = await getChambres();
  const chambresData = result.success ? result.data : [];

  // Convertir les Decimal en number pour le Client Component
  const chambres = (chambresData || []).map((chambre) => ({
    ...chambre,
    prix: Number(chambre.prix),
    prixWeekend: chambre.prixWeekend ? Number(chambre.prixWeekend) : null,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <BedDouble className="h-8 w-8 text-primary" />
            Chambres
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les chambres et hébergements de votre établissement
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/chambres/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle chambre
          </Link>
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chambres?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {chambres?.filter((c: { isActive: boolean }) => c.isActive).length || 0}
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
              {chambres?.filter((c: { isFeatured: boolean }) => c.isFeatured).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des chambres */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des chambres</CardTitle>
          <CardDescription>
            Cliquez sur une chambre pour la modifier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chambres && chambres.length > 0 ? (
            <ChambresTable chambres={chambres} />
          ) : (
            <div className="text-center py-12">
              <BedDouble className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucune chambre</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer votre première chambre
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/chambres/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une chambre
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
