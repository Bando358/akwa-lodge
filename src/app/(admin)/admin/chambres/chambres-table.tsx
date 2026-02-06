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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  deleteChambre,
  toggleChambreActive,
  toggleChambreFeatured,
} from "@/lib/actions/chambres";

interface Chambre {
  id: string;
  nom: string;
  slug: string;
  prix: number | { toString(): string };
  capacite: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string }[];
}

interface ChambresTableProps {
  chambres: Chambre[];
}

export function ChambresTable({ chambres }: ChambresTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteChambre(deleteId);

    if (result.success) {
      toast.success("Chambre supprimée avec succès");
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleToggleActive = async (id: string) => {
    const result = await toggleChambreActive(id);

    if (result.success) {
      toast.success(
        result.data?.isActive ? "Chambre activée" : "Chambre désactivée"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors du changement de statut");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleChambreFeatured(id);

    if (result.success) {
      toast.success(
        result.data?.isFeatured
          ? "Chambre mise en vedette"
          : "Chambre retirée de la vedette"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors du changement");
    }
  };

  const formatPrice = (price: number | { toString(): string }) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price.toString());
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix/nuit</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chambres.map((chambre) => (
            <TableRow key={chambre.id}>
              <TableCell>
                <div className="h-12 w-16 overflow-hidden rounded-md bg-muted">
                  {chambre.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={chambre.images[0].url}
                      alt={chambre.nom}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/admin/chambres/${chambre.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {chambre.nom}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    /{chambre.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(chambre.prix)}
              </TableCell>
              <TableCell>{chambre.capacite} pers.</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {chambre.isActive ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500">
                      Inactive
                    </Badge>
                  )}
                  {chambre.isFeatured && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <Star className="mr-1 h-3 w-3" />
                      Vedette
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
                      <Link href={`/admin/chambres/${chambre.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(chambre.id)}
                    >
                      {chambre.isActive ? (
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
                      onClick={() => handleToggleFeatured(chambre.id)}
                    >
                      {chambre.isFeatured ? (
                        <>
                          <StarOff className="mr-2 h-4 w-4" />
                          Retirer vedette
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
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(chambre.id)}
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette chambre ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
