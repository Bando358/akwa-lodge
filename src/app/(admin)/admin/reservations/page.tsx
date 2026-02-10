import { CalendarCheck } from "lucide-react";
import { getReservations, getReservationStats } from "@/lib/actions/reservations";
import { getUserRole } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReservationsTable } from "./reservations-table";

export default async function ReservationsPage() {
  const [reservationsResult, statsResult, userRole] = await Promise.all([
    getReservations(),
    getReservationStats(),
    getUserRole(),
  ]);

  const reservations = reservationsResult.success ? reservationsResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          Réservations
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les demandes de réservation
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
              Confirmées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.confirmees || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annulées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.annulees || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats?.terminees || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
          <CardDescription>
            Cliquez sur une réservation pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservations && reservations.length > 0 ? (
            <ReservationsTable reservations={reservations} userRole={userRole ?? undefined} />
          ) : (
            <div className="text-center py-12">
              <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucune réservation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Les demandes de réservation apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
