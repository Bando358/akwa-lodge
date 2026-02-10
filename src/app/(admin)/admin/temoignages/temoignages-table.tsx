"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
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
  deleteTemoignage,
  approveTemoignage,
  rejectTemoignage,
  toggleTemoignageActive,
} from "@/lib/actions/temoignages";

type Temoignage = {
  id: string;
  nom: string;
  pays: string | null;
  note: number;
  texte: string;
  dateVisite: Date | null;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
};

export function TemoignagesTable({ temoignages, userRole }: { temoignages: Temoignage[]; userRole?: string }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteTemoignage(deleteId);
      if (result.success) {
        toast.success("Témoignage supprimé");
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

  const handleApprove = async (id: string) => {
    try {
      const result = await approveTemoignage(id);
      if (result.success) {
        toast.success("Témoignage approuvé");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await rejectTemoignage(id);
      if (result.success) {
        toast.success("Témoignage rejeté");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const result = await toggleTemoignageActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive
            ? "Témoignage activé"
            : "Témoignage désactivé"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const renderStars = (note: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= note ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Témoignage</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {temoignages.map((temoignage) => (
            <TableRow key={temoignage.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{temoignage.nom}</p>
                  {temoignage.pays && (
                    <p className="text-sm text-muted-foreground">
                      {temoignage.pays}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{renderStars(temoignage.note)}</TableCell>
              <TableCell>
                <p className="text-sm line-clamp-2 max-w-[300px]">
                  {temoignage.texte}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      temoignage.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {temoignage.isApproved ? "Approuvé" : "En attente"}
                  </Badge>
                  {!temoignage.isActive && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Inactif
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
                      <Link href={`/admin/temoignages/${temoignage.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!temoignage.isApproved ? (
                      <DropdownMenuItem
                        onClick={() => handleApprove(temoignage.id)}
                      >
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Approuver
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleReject(temoignage.id)}
                      >
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Rejeter
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(temoignage.id)}
                    >
                      {temoignage.isActive ? (
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
                    {userRole === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(temoignage.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </>
                    )}
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
              Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est
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
