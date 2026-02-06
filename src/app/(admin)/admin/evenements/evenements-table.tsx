"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { EvenementType } from "@prisma/client";
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
  deleteEvenement,
  toggleEvenementActive,
  toggleEvenementFeatured,
} from "@/lib/actions/evenements";

type Evenement = {
  id: string;
  titre: string;
  slug: string;
  type: EvenementType;
  dateDebut: Date;
  dateFin: Date | null;
  prix: number | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
};

const typeLabels: Record<EvenementType, string> = {
  EVENEMENT: "Événement",
  CONFERENCE: "Conférence",
  MARIAGE: "Mariage",
  SEMINAIRE: "Séminaire",
  TEAM_BUILDING: "Team Building",
  RECEPTION: "Réception",
};

const typeColors: Record<EvenementType, string> = {
  EVENEMENT: "bg-blue-100 text-blue-700",
  CONFERENCE: "bg-purple-100 text-purple-700",
  MARIAGE: "bg-pink-100 text-pink-700",
  SEMINAIRE: "bg-green-100 text-green-700",
  TEAM_BUILDING: "bg-orange-100 text-orange-700",
  RECEPTION: "bg-cyan-100 text-cyan-700",
};

export function EvenementsTable({ evenements }: { evenements: Evenement[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteEvenement(deleteId);
      if (result.success) {
        toast.success("Événement supprimé avec succès");
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

  const handleToggleActive = async (id: string) => {
    try {
      const result = await toggleEvenementActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive
            ? "Événement activé"
            : "Événement désactivé"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du changement de statut");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const result = await toggleEvenementFeatured(id);
      if (result.success) {
        toast.success(
          result.data?.isFeatured
            ? "Événement mis en vedette"
            : "Événement retiré des vedettes"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du changement");
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

  const formatPrice = (prix: number | null) => {
    if (!prix) return "-";
    return new Intl.NumberFormat("fr-FR").format(prix) + " FCFA";
  };

  const isUpcoming = (date: Date) => new Date(date) >= new Date();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evenements.map((evenement) => (
            <TableRow key={evenement.id}>
              <TableCell>
                <Link
                  href={`/admin/evenements/${evenement.id}`}
                  className="font-medium hover:underline"
                >
                  {evenement.titre}
                </Link>
                {evenement.isFeatured && (
                  <Star className="inline-block ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </TableCell>
              <TableCell>
                <Badge className={typeColors[evenement.type]} variant="secondary">
                  {typeLabels[evenement.type]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={!isUpcoming(evenement.dateDebut) ? "text-muted-foreground" : ""}>
                    {formatDate(evenement.dateDebut)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatPrice(evenement.prix)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge
                    variant={evenement.isActive ? "default" : "secondary"}
                    className={
                      evenement.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {evenement.isActive ? "Actif" : "Inactif"}
                  </Badge>
                  {!isUpcoming(evenement.dateDebut) && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Passé
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/evenements/${evenement.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(evenement.id)}
                    >
                      {evenement.isActive ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Activer
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleFeatured(evenement.id)}
                    >
                      {evenement.isFeatured ? (
                        <>
                          <StarOff className="mr-2 h-4 w-4" />
                          Retirer des vedettes
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Mettre en vedette
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteId(evenement.id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est
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
