"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  FolderOpen,
  Soup,
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
  deleteMenuCategorie,
  toggleMenuCategorieActive,
} from "@/lib/actions/menu";
import { CategorieDialog } from "./categorie-dialog";

type Plat = {
  id: string;
  nom: string;
};

type Categorie = {
  id: string;
  nom: string;
  description: string | null;
  ordre: number;
  isActive: boolean;
  plats?: Plat[];
};

export function CategoriesTable({ categories, userRole }: { categories: Categorie[]; userRole?: string }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editCategorie, setEditCategorie] = useState<Categorie | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteMenuCategorie(deleteId);
      if (result.success) {
        toast.success("Catégorie supprimée");
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
      const result = await toggleMenuCategorieActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive ? "Catégorie activée" : "Catégorie désactivée"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Aucune catégorie</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par créer une catégorie pour le menu
        </p>
        <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
        <CategorieDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Plats</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((categorie) => (
            <TableRow key={categorie.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{categorie.nom}</p>
                    {categorie.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {categorie.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Soup className="h-4 w-4" />
                  <span>{categorie.plats?.length || 0} plat(s)</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{categorie.ordre}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    categorie.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {categorie.isActive ? "Actif" : "Inactif"}
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
                    <DropdownMenuItem onClick={() => setEditCategorie(categorie)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(categorie.id)}
                    >
                      {categorie.isActive ? (
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
                          onClick={() => setDeleteId(categorie.id)}
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
      <CategorieDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {/* Dialog d'édition */}
      <CategorieDialog
        open={!!editCategorie}
        onOpenChange={(open) => !open && setEditCategorie(null)}
        categorie={editCategorie || undefined}
      />

      {/* Dialog de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Les plats
              associés seront également supprimés. Cette action est irréversible.
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
