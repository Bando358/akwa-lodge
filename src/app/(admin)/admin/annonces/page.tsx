import { Megaphone, Image, Video, FileText, Clock, CheckCircle } from "lucide-react";
import { getAnnonces, getAnnoncesStats } from "@/lib/actions/annonces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnoncesTable } from "./annonces-table";

export default async function AnnoncesPage() {
  const [annoncesResult, statsResult] = await Promise.all([
    getAnnonces({ includePromotion: true }),
    getAnnoncesStats(),
  ]);

  const annonces = annoncesResult.success ? annoncesResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  // Sérialiser les données pour le client
  const serializedAnnonces = annonces?.map((annonce) => {
    // Type assertion pour accéder à la relation promotion
    const annonceWithPromotion = annonce as typeof annonce & {
      promotion?: { id: string; nom: string; type: string; valeur: number | bigint; codePromo: string | null } | null;
    };
    return {
      ...annonce,
      dateDebut: annonce.dateDebut.toISOString(),
      dateFin: annonce.dateFin.toISOString(),
      createdAt: annonce.createdAt.toISOString(),
      updatedAt: annonce.updatedAt.toISOString(),
      promotion: annonceWithPromotion.promotion
        ? {
            ...annonceWithPromotion.promotion,
            valeur: Number(annonceWithPromotion.promotion.valeur),
          }
        : null,
    };
  }) || [];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" />
          Annonces
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez vos annonces, événements et promotions
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.actives || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              Expirées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats?.expired || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Image className="h-4 w-4 text-blue-500" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.images || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-500" />
              Vidéos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.videos || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des annonces */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des annonces</CardTitle>
          <CardDescription>
            Créez et gérez vos annonces interactives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnoncesTable annonces={serializedAnnonces} />
        </CardContent>
      </Card>
    </div>
  );
}
