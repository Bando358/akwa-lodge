"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  Clock,
  Trash2,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { ReservationStatut } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateReservationStatut,
  deleteReservation,
} from "@/lib/actions/reservations";

type Reservation = {
  id: string;
  numero: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateArrivee: Date;
  dateDepart: Date;
  nombreAdultes: number;
  nombreEnfants: number;
  statut: ReservationStatut;
  message: string | null;
  chambre: { id: string; nom: string; slug: string } | null;
  createdAt: Date;
};

const statutLabels: Record<ReservationStatut, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  ANNULEE: "Annulée",
  TERMINEE: "Terminée",
};

const statutColors: Record<ReservationStatut, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMEE: "bg-green-100 text-green-700",
  ANNULEE: "bg-red-100 text-red-700",
  TERMINEE: "bg-gray-100 text-gray-700",
};

export function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewReservation, setViewReservation] = useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteReservation(deleteId);
      if (result.success) {
        toast.success("Réservation supprimée");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleChangeStatut = async (id: string, statut: ReservationStatut) => {
    try {
      const result = await updateReservationStatut(id, statut);
      if (result.success) {
        toast.success(`Réservation ${statutLabels[statut].toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du changement de statut");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Chambre</TableHead>
            <TableHead>Personnes</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">
                    {reservation.prenom} {reservation.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(reservation.dateArrivee)} -{" "}
                    {formatDate(reservation.dateDepart)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {reservation.chambre?.nom || (
                  <span className="text-muted-foreground">Non spécifiée</span>
                )}
              </TableCell>
              <TableCell>
                <span>
                  {reservation.nombreAdultes} adulte(s)
                  {reservation.nombreEnfants > 0 &&
                    `, ${reservation.nombreEnfants} enfant(s)`}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={statutColors[reservation.statut]} variant="secondary">
                  {statutLabels[reservation.statut]}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewReservation(reservation)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {reservation.statut === "EN_ATTENTE" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleChangeStatut(reservation.id, "CONFIRMEE")}
                        >
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Confirmer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeStatut(reservation.id, "ANNULEE")}
                        >
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          Annuler
                        </DropdownMenuItem>
                      </>
                    )}
                    {reservation.statut === "CONFIRMEE" && (
                      <DropdownMenuItem
                        onClick={() => handleChangeStatut(reservation.id, "TERMINEE")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Marquer terminée
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteId(reservation.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog de détails */}
      <Dialog open={!!viewReservation} onOpenChange={() => setViewReservation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogDescription>
              Numéro: {viewReservation?.numero}
            </DialogDescription>
          </DialogHeader>
          {viewReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {viewReservation.prenom} {viewReservation.nom}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge className={statutColors[viewReservation.statut]} variant="secondary">
                    {statutLabels[viewReservation.statut]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {viewReservation.email}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {viewReservation.telephone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Arrivée</p>
                  <p className="font-medium">{formatDate(viewReservation.dateArrivee)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Départ</p>
                  <p className="font-medium">{formatDate(viewReservation.dateDepart)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Chambre</p>
                  <p className="font-medium">
                    {viewReservation.chambre?.nom || "Non spécifiée"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Personnes</p>
                  <p className="font-medium">
                    {viewReservation.nombreAdultes} adulte(s)
                    {viewReservation.nombreEnfants > 0 &&
                      `, ${viewReservation.nombreEnfants} enfant(s)`}
                  </p>
                </div>
              </div>

              {viewReservation.message && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {viewReservation.message}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                Demande reçue le {formatDateTime(viewReservation.createdAt)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
