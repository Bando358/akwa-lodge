"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Percent,
  Tag,
  Gift,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { PromotionType, PromotionCible } from "@prisma/client";
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
import { deletePromotion, togglePromotionActive } from "@/lib/actions/promotions";

type Promotion = {
  id: string;
  nom: string;
  description: string | null;
  type: PromotionType;
  valeur: number;
  cible: PromotionCible;
  codePromo: string | null;
  dateDebut: string;
  dateFin: string;
  usageMax: number | null;
  usageActuel: number;
  isActive: boolean;
  chambre?: { id: string; nom: string; slug: string } | null;
  service?: { id: string; nom: string; slug: string; type: string } | null;
  _count: { annonces: number };
};

const typeLabels: Record<PromotionType, string> = {
  POURCENTAGE: "Pourcentage",
  MONTANT_FIXE: "Montant fixe",
  OFFRE_SPECIALE: "Offre spéciale",
  PACK: "Pack",
};

const typeColors: Record<PromotionType, string> = {
  POURCENTAGE: "bg-green-100 text-green-700",
  MONTANT_FIXE: "bg-blue-100 text-blue-700",
  OFFRE_SPECIALE: "bg-purple-100 text-purple-700",
  PACK: "bg-amber-100 text-amber-700",
};

const cibleLabels: Record<PromotionCible, string> = {
  TOUS: "Tous",
  CHAMBRE: "Chambres",
  RESTAURATION: "Restauration",
  PISCINE: "Piscine",
  ACTIVITE: "Activités",
  BIEN_ETRE: "Bien-être",
  EVENEMENT: "Événements",
};

export function PromotionsTable({ promotions, userRole }: { promotions: Promotion[]; userRole?: string }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deletePromotion(deleteId);
      if (result.success) {
        toast.success("Promotion supprimée");
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
      const result = await togglePromotionActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive ? "Promotion activée" : "Promotion désactivée"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié !");
  };

  const isExpired = (dateFin: string) => new Date(dateFin) < new Date();

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const formatValue = (type: PromotionType, valeur: number) => {
    switch (type) {
      case "POURCENTAGE":
        return `-${valeur}%`;
      case "MONTANT_FIXE":
        return `-${valeur.toLocaleString("fr-FR")} FCFA`;
      default:
        return valeur.toString();
    }
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <Percent className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Aucune promotion</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Créez votre première promotion
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/promotions/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle promotion
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/promotions/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle promotion
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Promotion</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Cible</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Utilisation</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => {
            const expired = isExpired(promo.dateFin);

            return (
              <TableRow key={promo.id} className={expired ? "opacity-60" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {promo.type === "POURCENTAGE" ? (
                        <Percent className="h-5 w-5 text-primary" />
                      ) : promo.type === "PACK" ? (
                        <Gift className="h-5 w-5 text-primary" />
                      ) : (
                        <Tag className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{promo.nom}</p>
                      <p className="text-lg font-bold text-primary">
                        {formatValue(promo.type, promo.valeur)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={typeColors[promo.type]} variant="secondary">
                    {typeLabels[promo.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cibleLabels[promo.cible]}</Badge>
                  {promo.chambre && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {promo.chambre.nom}
                    </p>
                  )}
                  {promo.service && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {promo.service.nom}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {promo.codePromo ? (
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                        {promo.codePromo}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyCode(promo.codePromo!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <span className="font-medium">{promo.usageActuel}</span>
                    {promo.usageMax && (
                      <span className="text-muted-foreground">
                        /{promo.usageMax}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{formatDate(promo.dateDebut)}</p>
                    <p className="text-muted-foreground">
                      → {formatDate(promo.dateFin)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {expired ? (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Expirée
                    </Badge>
                  ) : promo.isActive ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Inactive
                    </Badge>
                  )}
                  {promo._count.annonces > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {promo._count.annonces} annonce(s)
                    </p>
                  )}
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
                        <Link href={`/admin/promotions/${promo.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleActive(promo.id)}>
                        {promo.isActive ? (
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
                            onClick={() => setDeleteId(promo.id)}
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
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est
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
