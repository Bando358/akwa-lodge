"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Download, Loader2, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  getNewsletterSubscribers,
  getNewsletterStats,
  deleteNewsletterSubscribers,
  toggleNewsletterSubscriberActive,
  exportNewsletterEmails,
} from "@/lib/actions/newsletter";

type Subscriber = {
  id: string;
  email: string;
  nom: string | null;
  isActive: boolean;
  source: string | null;
  createdAt: Date;
};

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<{ total: number; actifs: number; inactifs: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [subscribersResult, statsResult] = await Promise.all([
        getNewsletterSubscribers({ search: searchTerm || undefined }),
        getNewsletterStats(),
      ]);

      if (subscribersResult.success) {
        setSubscribers(subscribersResult.data || []);
      }
      if (statsResult.success) {
        setStats(statsResult.data || null);
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelectSubscriber = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(subscribers.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const result = await deleteNewsletterSubscribers(selectedIds);
      if (result.success) {
        toast.success(`${selectedIds.length} abonné(s) supprimé(s)`);
        setSelectedIds([]);
        loadData();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
    setShowDeleteDialog(false);
  };

  const handleToggleActive = async (id: string) => {
    try {
      const result = await toggleNewsletterSubscriberActive(id);
      if (result.success) {
        toast.success(
          result.data?.isActive
            ? "Abonné réactivé"
            : "Abonné désactivé"
        );
        loadData();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportNewsletterEmails(true);
      if (result.success && result.data) {
        const csv = result.data.map((s) => `${s.email},${s.nom || ""}`).join("\n");
        const blob = new Blob([`Email,Nom\n${csv}`], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Export réussi");
      } else {
        toast.error(result.error || "Erreur lors de l'export");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            Newsletter
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les abonnés à la newsletter
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} variant="outline">
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total abonnés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.actifs || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Désabonnés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats?.inactifs || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Abonnés</CardTitle>
              <CardDescription>
                {selectedIds.length > 0
                  ? `${selectedIds.length} sélectionné(s)`
                  : "Liste des abonnés à la newsletter"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px]"
              />
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === subscribers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(subscriber.id)}
                        onCheckedChange={(checked) =>
                          handleSelectSubscriber(subscriber.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      {subscriber.nom || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {subscriber.source || "site_web"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(subscriber.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          subscriber.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {subscriber.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(subscriber.id)}
                      >
                        {subscriber.isActive ? (
                          <UserMinus className="h-4 w-4" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun abonné</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Les abonnés à la newsletter apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedIds.length} abonné(s) ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
