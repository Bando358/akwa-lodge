import { UtensilsCrossed, FolderOpen, Soup } from "lucide-react";
import { getMenuCategories, getPlats } from "@/lib/actions/menu";
import { getUserRole } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoriesTable } from "./categories-table";
import { PlatsTable } from "./plats-table";

export default async function MenuPage() {
  const [categoriesResult, platsResult, userRole] = await Promise.all([
    getMenuCategories({ includePlats: true }),
    getPlats(),
    getUserRole(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const plats = platsResult.success ? platsResult.data : [];

  // Convertir les Decimal en Number pour les plats
  const serializedPlats = plats?.map((plat) => ({
    ...plat,
    prix: Number(plat.prix),
  })) || [];

  const totalCategories = categories?.length || 0;
  const totalPlats = plats?.length || 0;
  const platsActifs = plats?.filter((p) => p.isActive).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          Menu Restaurant
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les catégories et les plats du restaurant
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Catégories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Soup className="h-4 w-4" />
              Plats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPlats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plats actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{platsActifs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets Catégories / Plats */}
      <Tabs defaultValue="plats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plats">Plats ({totalPlats})</TabsTrigger>
          <TabsTrigger value="categories">
            Catégories ({totalCategories})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plats">
          <Card>
            <CardHeader>
              <CardTitle>Liste des plats</CardTitle>
              <CardDescription>
                Gérez les plats du menu restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlatsTable
                plats={serializedPlats}
                categories={categories || []}
                userRole={userRole ?? undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Catégories du menu</CardTitle>
              <CardDescription>
                Organisez vos plats par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesTable categories={categories || []} userRole={userRole ?? undefined} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
