import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  BedDouble,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Statistiques temporaires (à remplacer par des données réelles)
const stats = [
  {
    title: "Chambres",
    value: "12",
    description: "8 actives",
    icon: BedDouble,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Réservations",
    value: "24",
    description: "Ce mois",
    icon: CalendarCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Messages",
    value: "8",
    description: "Non lus",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Visiteurs",
    value: "1,234",
    description: "+12% ce mois",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

// Réservations récentes temporaires
const recentReservations = [
  {
    id: "1",
    client: "Jean Dupont",
    chambre: "Suite Océan",
    dateArrivee: "15 Jan 2026",
    statut: "CONFIRMEE",
  },
  {
    id: "2",
    client: "Marie Koné",
    chambre: "Chambre Premium",
    dateArrivee: "18 Jan 2026",
    statut: "EN_ATTENTE",
  },
  {
    id: "3",
    client: "Pierre Martin",
    chambre: "Bungalow Vue Mer",
    dateArrivee: "20 Jan 2026",
    statut: "CONFIRMEE",
  },
  {
    id: "4",
    client: "Aminata Diallo",
    chambre: "Suite Royale",
    dateArrivee: "22 Jan 2026",
    statut: "EN_ATTENTE",
  },
];

// Messages récents temporaires
const recentMessages = [
  {
    id: "1",
    nom: "Sophie Traoré",
    sujet: "Demande de réservation",
    date: "Il y a 2h",
    isRead: false,
  },
  {
    id: "2",
    nom: "Michel Kouadio",
    sujet: "Question sur les activités",
    date: "Il y a 5h",
    isRead: false,
  },
  {
    id: "3",
    nom: "Claire Mensah",
    sujet: "Anniversaire de mariage",
    date: "Hier",
    isRead: true,
  },
];

function StatutBadge({ statut }: { statut: string }) {
  if (statut === "CONFIRMEE") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle className="mr-1 h-3 w-3" />
        Confirmée
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
      <Clock className="mr-1 h-3 w-3" />
      En attente
    </Badge>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="p-6 space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue, {session?.user?.name || "Administrateur"} ! Voici un aperçu de votre établissement.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Réservations récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Réservations récentes
            </CardTitle>
            <CardDescription>
              Les dernières demandes de réservation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{reservation.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.chambre} • {reservation.dateArrivee}
                    </p>
                  </div>
                  <StatutBadge statut={reservation.statut} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages récents
            </CardTitle>
            <CardDescription>
              Les derniers messages de contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      message.isRead ? "bg-muted" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{message.nom}</p>
                      <span className="text-xs text-muted-foreground">
                        {message.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {message.sujet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/chambres/nouveau"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <BedDouble className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Ajouter une chambre</p>
                <p className="text-sm text-muted-foreground">
                  Créer un nouvel hébergement
                </p>
              </div>
            </Link>
            <Link
              href="/admin/reservations"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <CalendarCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Gérer les réservations</p>
                <p className="text-sm text-muted-foreground">
                  Voir toutes les demandes
                </p>
              </div>
            </Link>
            <Link
              href="/admin/contacts"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Répondre aux messages</p>
                <p className="text-sm text-muted-foreground">
                  8 messages non lus
                </p>
              </div>
            </Link>
            <Link
              href="/admin/galerie"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Gérer la galerie</p>
                <p className="text-sm text-muted-foreground">
                  Photos et médias
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
