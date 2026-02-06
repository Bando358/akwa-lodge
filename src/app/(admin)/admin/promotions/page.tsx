import { Percent, Tag, Clock, CheckCircle } from "lucide-react";
import { getPromotions, getPromotionsStats } from "@/lib/actions/promotions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PromotionsTable } from "./promotions-table";

export default async function PromotionsPage() {
  const [promotionsResult, statsResult] = await Promise.all([
    getPromotions({ includeRelations: true }),
    getPromotionsStats(),
  ]);

  const promotions = promotionsResult.success ? promotionsResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  // Sérialiser les données pour le client
  const serializedPromotions = promotions?.map((promo) => ({
    ...promo,
    valeur: Number(promo.valeur),
    montantMinimum: promo.montantMinimum ? Number(promo.montantMinimum) : null,
    dateDebut: promo.dateDebut.toISOString(),
    dateFin: promo.dateFin.toISOString(),
    createdAt: promo.createdAt.toISOString(),
    updatedAt: promo.updatedAt.toISOString(),
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
          <Percent className="h-8 w-8 text-primary" />
          Promotions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez vos codes promo et offres spéciales
        </p>
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
              <Tag className="h-4 w-4 text-purple-500" />
              Avec code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.withCode || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des promotions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des promotions</CardTitle>
          <CardDescription>
            Créez et gérez vos offres promotionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromotionsTable promotions={serializedPromotions} />
        </CardContent>
      </Card>
    </div>
  );
}
