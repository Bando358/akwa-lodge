"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Mail,
  MailOpen,
  User,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { ContactSujet } from "@prisma/client";
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
  markContactAsRead,
  deleteContact,
} from "@/lib/actions/contacts";

type Contact = {
  id: string;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string | null;
  sujet: ContactSujet;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

const sujetLabels: Record<ContactSujet, string> = {
  INFORMATION: "Information",
  RESERVATION: "Réservation",
  EVENEMENT: "Événement",
  RECLAMATION: "Réclamation",
  PARTENARIAT: "Partenariat",
  AUTRE: "Autre",
};

const sujetColors: Record<ContactSujet, string> = {
  INFORMATION: "bg-blue-100 text-blue-700",
  RESERVATION: "bg-green-100 text-green-700",
  EVENEMENT: "bg-purple-100 text-purple-700",
  RECLAMATION: "bg-red-100 text-red-700",
  PARTENARIAT: "bg-orange-100 text-orange-700",
  AUTRE: "bg-gray-100 text-gray-700",
};

export function ContactsTable({ contacts, userRole }: { contacts: Contact[]; userRole?: string }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteContact(deleteId);
      if (result.success) {
        toast.success("Message supprimé");
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

  const handleViewContact = async (contact: Contact) => {
    setViewContact(contact);
    if (!contact.isRead) {
      try {
        await markContactAsRead(contact.id);
        router.refresh();
      } catch {
        // Silently fail
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
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
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Expéditeur</TableHead>
            <TableHead>Sujet</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className={!contact.isRead ? "bg-primary/5" : ""}
            >
              <TableCell>
                {contact.isRead ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className={`font-medium ${!contact.isRead ? "font-semibold" : ""}`}>
                    {contact.prenom} {contact.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contact.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={sujetColors[contact.sujet]} variant="secondary">
                  {sujetLabels[contact.sujet]}
                </Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
                  {contact.message}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(contact.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lire
                    </DropdownMenuItem>
                    {userRole === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(contact.id)}
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

      {/* Dialog de lecture */}
      <Dialog open={!!viewContact} onOpenChange={() => setViewContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message de contact</DialogTitle>
            <DialogDescription>
              Reçu le {viewContact && formatDateTime(viewContact.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {viewContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expéditeur</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {viewContact.prenom} {viewContact.nom}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sujet</p>
                  <Badge className={sujetColors[viewContact.sujet]} variant="secondary">
                    {sujetLabels[viewContact.sujet]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${viewContact.email}`}
                    className="text-primary hover:underline"
                  >
                    {viewContact.email}
                  </a>
                </p>
                {viewContact.telephone && (
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${viewContact.telephone}`}
                      className="hover:underline"
                    >
                      {viewContact.telephone}
                    </a>
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {viewContact.message}
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button asChild className="flex-1">
                  <a href={`mailto:${viewContact.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Répondre par email
                  </a>
                </Button>
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
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est
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
