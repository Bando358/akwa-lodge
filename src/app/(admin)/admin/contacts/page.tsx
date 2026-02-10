import { MessageSquare, Mail, MailOpen } from "lucide-react";
import { getContacts } from "@/lib/actions/contacts";
import { getUserRole } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactsTable } from "./contacts-table";

export default async function ContactsPage() {
  const [result, userRole] = await Promise.all([
    getContacts(),
    getUserRole(),
  ]);
  const contacts = result.success ? result.data : [];

  const unread = contacts?.filter((c) => !c.isRead).length || 0;
  const read = contacts?.filter((c) => c.isRead).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Messages
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les messages de contact
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Non lus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MailOpen className="h-4 w-4" />
              Lus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{read}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Messages reçus</CardTitle>
          <CardDescription>
            Cliquez sur un message pour le lire
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contacts && contacts.length > 0 ? (
            <ContactsTable contacts={contacts} userRole={userRole ?? undefined} />
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun message</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Les messages de contact apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
