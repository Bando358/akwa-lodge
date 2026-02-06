import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getTemoignages, getTemoignageStats } from "@/lib/actions/temoignages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemoignagesTable } from "./temoignages-table";

export default async function TemoignagesPage() {
  const [temoignagesResult, statsResult] = await Promise.all([
    getTemoignages(),
    getTemoignageStats(),
  ]);

  const temoignages = temoignagesResult.success ? temoignagesResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Star className="h-8 w-8 text-primary" />
            Témoignages
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les avis et témoignages clients
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/temoignages/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau témoignage
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.approuves || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.enAttente || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Note moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-1">
              {stats?.noteMoyenne?.toFixed(1) || "0.0"}
              <Star className="h-5 w-5 fill-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des témoignages */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des témoignages</CardTitle>
          <CardDescription>
            Approuvez ou modifiez les témoignages clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {temoignages && temoignages.length > 0 ? (
            <TemoignagesTable temoignages={temoignages} />
          ) : (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun témoignage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer votre premier témoignage
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/temoignages/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un témoignage
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
