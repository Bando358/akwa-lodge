import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { getUsers, getUserStats } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UtilisateursTable } from "./utilisateurs-table";

export default async function UtilisateursPage() {
  const [usersResult, statsResult] = await Promise.all([
    getUsers(),
    getUserStats(),
  ]);

  const users = usersResult.success ? usersResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Utilisateurs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les utilisateurs administrateurs
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/utilisateurs/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel utilisateur
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
              Administrateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats?.admins || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Éditeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.editors || 0}
            </div>
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
              {stats?.actifs || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les accès à l&apos;interface d&apos;administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <UtilisateursTable users={users} />
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun utilisateur</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer un utilisateur
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/utilisateurs/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un utilisateur
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
