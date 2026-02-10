"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Soup,
  Leaf,
  Flame,
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
import { deletePlat, togglePlatActive } from "@/lib/actions/menu";
import { PlatDialog } from "./plat-dialog";

type Categorie = {
  id: string;
  nom: string;
  description?: string | null;
  ordre?: number;
  isActive?: boolean;
};

type Plat = {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  image: string | null;
  allergenes: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isActive: boolean;
  ordre: number;
  categorieId: string;
  categorie: {
    id: string;
    nom: string;
  };
};

export function PlatsTable({
  plats,
  categories,
  userRole,
}: {
  plats: Plat[];
  categories: Categorie[];
  userRole?: string;
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editPlat, setEditPlat] = useState<Plat | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deletePlat(deleteId);
      if (result.success) {
        toast.success("Plat supprimé");
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
      const result = await togglePlatActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive ? "Plat activé" : "Plat désactivé"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (plats.length === 0) {
    return (
      <div className="text-center py-12">
        <Soup className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Aucun plat</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par ajouter des plats au menu
        </p>
        <Button
          className="mt-4"
          onClick={() => setShowCreateDialog(true)}
          disabled={categories.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau plat
        </Button>
        {categories.length === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            Créez d&apos;abord une catégorie
          </p>
        )}
        <PlatDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          categories={categories}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowCreateDialog(true)}
          disabled={categories.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau plat
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plat</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plats.map((plat) => (
            <TableRow key={plat.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {plat.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image
                        src={plat.image}
                        alt={plat.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Soup className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{plat.nom}</p>
                    {plat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {plat.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{plat.categorie.nom}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(plat.prix)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {plat.isVegetarian && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                      title="Végétarien"
                    >
                      <Leaf className="h-3 w-3" />
                    </Badge>
                  )}
                  {plat.isVegan && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                      title="Vegan"
                    >
                      V
                    </Badge>
                  )}
                  {plat.isSpicy && (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700"
                      title="Épicé"
                    >
                      <Flame className="h-3 w-3" />
                    </Badge>
                  )}
                  {!plat.isVegetarian && !plat.isVegan && !plat.isSpicy && (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    plat.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {plat.isActive ? "Actif" : "Inactif"}
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
                    <DropdownMenuItem onClick={() => setEditPlat(plat)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(plat.id)}
                    >
                      {plat.isActive ? (
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
                          onClick={() => setDeleteId(plat.id)}
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

      {/* Dialog de création */}
      <PlatDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        categories={categories}
      />

      {/* Dialog d'édition */}
      <PlatDialog
        open={!!editPlat}
        onOpenChange={(open) => !open && setEditPlat(null)}
        plat={editPlat || undefined}
        categories={categories}
      />

      {/* Dialog de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est
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
