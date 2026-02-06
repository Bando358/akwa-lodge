"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Megaphone,
  Pin,
  PinOff,
  Copy,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { MediaType, AnnonceCible, AnnoncePosition } from "@prisma/client";
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
  deleteAnnonce,
  toggleAnnonceActive,
  toggleAnnoncePinned,
  duplicateAnnonce,
} from "@/lib/actions/annonces";

type Annonce = {
  id: string;
  titre: string;
  description: string | null;
  mediaType: MediaType;
  mediaUrl: string | null;
  mediaDuration: number | null;
  lien: string | null;
  cibleType: AnnonceCible;
  dateDebut: string;
  dateFin: string;
  position: AnnoncePosition;
  ordre: number;
  isActive: boolean;
  isPinned: boolean;
  promotion: {
    id: string;
    nom: string;
    valeur: number;
    type: string;
    codePromo: string | null;
  } | null;
};

const mediaTypeIcons = {
  TEXT: FileText,
  IMAGE: ImageIcon,
  VIDEO: Video,
};

const mediaTypeLabels = {
  TEXT: "Texte",
  IMAGE: "Image",
  VIDEO: "Vidéo",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cibleLabels: Record<AnnonceCible, string> = {
  GENERAL: "Général",
  HEBERGEMENT: "Hébergement",
  RESTAURATION: "Restauration",
  ACTIVITES: "Activités",
  EVENEMENTS: "Événements",
  PROMOTIONS: "Promotions",
};

const positionLabels: Record<AnnoncePosition, string> = {
  ACCUEIL: "Accueil",
  HEBERGEMENT: "Hébergement",
  RESTAURATION: "Restauration",
  ACTIVITES: "Activités",
  EVENEMENTS: "Événements",
  TOUTES_PAGES: "Toutes pages",
  POPUP: "Popup",
  BANNIERE: "Bannière",
};

export function AnnoncesTable({ annonces }: { annonces: Annonce[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteAnnonce(deleteId);
      if (result.success) {
        toast.success("Annonce supprimée");
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
      const result = await toggleAnnonceActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive ? "Annonce activée" : "Annonce désactivée"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleTogglePinned = async (id: string) => {
    try {
      const result = await toggleAnnoncePinned(id);
      if (result.success) {
        toast.success(
          result.data?.isPinned ? "Annonce épinglée" : "Annonce désépinglée"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateAnnonce(id);
      if (result.success) {
        toast.success("Annonce dupliquée");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const isExpired = (dateFin: string) => new Date(dateFin) < new Date();
  const isUpcoming = (dateDebut: string) => new Date(dateDebut) > new Date();

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  if (annonces.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Aucune annonce</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Créez votre première annonce
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/annonces/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/annonces/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Annonce</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {annonces.map((annonce) => {
            const MediaIcon = mediaTypeIcons[annonce.mediaType];
            const expired = isExpired(annonce.dateFin);
            const upcoming = isUpcoming(annonce.dateDebut);

            return (
              <TableRow key={annonce.id} className={expired ? "opacity-60" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {annonce.mediaUrl && annonce.mediaType === "IMAGE" ? (
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={annonce.mediaUrl}
                          alt={annonce.titre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-primary/10">
                        <MediaIcon className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{annonce.titre}</p>
                        {annonce.isPinned && (
                          <Pin className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      {annonce.promotion && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Promo: {annonce.promotion.nom}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <MediaIcon className="mr-1 h-3 w-3" />
                      {mediaTypeLabels[annonce.mediaType]}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {positionLabels[annonce.position]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{formatDate(annonce.dateDebut)}</p>
                    <p className="text-muted-foreground">
                      → {formatDate(annonce.dateFin)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {expired ? (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Expirée
                      </Badge>
                    ) : upcoming ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        À venir
                      </Badge>
                    ) : annonce.isActive ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Inactive
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
                        <Link href={`/admin/annonces/${annonce.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      {annonce.lien && (
                        <DropdownMenuItem asChild>
                          <a href={annonce.lien} target="_blank" rel="noopener">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Voir le lien
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDuplicate(annonce.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePinned(annonce.id)}>
                        {annonce.isPinned ? (
                          <>
                            <PinOff className="mr-2 h-4 w-4" />
                            Désépingler
                          </>
                        ) : (
                          <>
                            <Pin className="mr-2 h-4 w-4" />
                            Épingler
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(annonce.id)}>
                        {annonce.isActive ? (
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(annonce.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
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
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est
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
