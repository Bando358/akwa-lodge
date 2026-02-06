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
import { ServiceType } from "@prisma/client";
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
  deleteService,
  toggleServiceActive,
  toggleServiceFeatured,
} from "@/lib/actions/services";

type Service = {
  id: string;
  nom: string;
  slug: string;
  type: ServiceType;
  prix: number | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
};

const typeLabels: Record<ServiceType, string> = {
  RESTAURATION: "Restauration",
  ACTIVITE: "Activité",
  BIEN_ETRE: "Bien-être",
  PISCINE: "Piscine",
  TRANSPORT: "Transport",
  AUTRE: "Autre",
};

const typeColors: Record<ServiceType, string> = {
  RESTAURATION: "bg-orange-100 text-orange-700",
  ACTIVITE: "bg-blue-100 text-blue-700",
  BIEN_ETRE: "bg-purple-100 text-purple-700",
  PISCINE: "bg-cyan-100 text-cyan-700",
  TRANSPORT: "bg-green-100 text-green-700",
  AUTRE: "bg-gray-100 text-gray-700",
};

export function ServicesTable({ services }: { services: Service[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteService(deleteId);
      if (result.success) {
        toast.success("Service supprimé avec succès");
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
      const result = await toggleServiceActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive
            ? "Service activé"
            : "Service désactivé"
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
      const result = await toggleServiceFeatured(id);
      if (result.success) {
        toast.success(
          result.data?.isFeatured
            ? "Service mis en vedette"
            : "Service retiré des vedettes"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du changement");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const formatPrice = (prix: number | null) => {
    if (!prix) return "-";
    return new Intl.NumberFormat("fr-FR").format(prix) + " FCFA";
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <Link
                  href={`/admin/services/${service.id}`}
                  className="font-medium hover:underline"
                >
                  {service.nom}
                </Link>
                {service.isFeatured && (
                  <Star className="inline-block ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </TableCell>
              <TableCell>
                <Badge className={typeColors[service.type]} variant="secondary">
                  {typeLabels[service.type]}
                </Badge>
              </TableCell>
              <TableCell>{formatPrice(service.prix)}</TableCell>
              <TableCell>
                <Badge
                  variant={service.isActive ? "default" : "secondary"}
                  className={
                    service.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {service.isActive ? "Actif" : "Inactif"}
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
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/services/${service.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(service.id)}
                    >
                      {service.isActive ? (
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
                      onClick={() => handleToggleFeatured(service.id)}
                    >
                      {service.isFeatured ? (
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
                      onClick={() => setDeleteId(service.id)}
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
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est
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
