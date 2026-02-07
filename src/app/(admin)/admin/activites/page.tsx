"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getActivityLogs,
  getActivityLogUsers,
  getActivityLogEntityTypes,
} from "@/lib/actions/activity-log";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

type Log = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  description: string;
  createdAt: Date;
};

type LogUser = {
  userId: string;
  userName: string | null;
  userEmail: string | null;
};

const PAGE_SIZE = 50;

const actionBadge: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  UPDATE_STATUT: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  TOGGLE: "bg-yellow-100 text-yellow-700",
  CHANGE_ROLE: "bg-purple-100 text-purple-700",
};

const actionLabel: Record<string, string> = {
  CREATE: "Creation",
  UPDATE: "Modification",
  UPDATE_STATUT: "Statut",
  DELETE: "Suppression",
  TOGGLE: "Basculement",
  CHANGE_ROLE: "Role",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function ActivitesPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<LogUser[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);

  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const result = await getActivityLogs({
      userId: filterUser !== "all" ? filterUser : undefined,
      entityType: filterType !== "all" ? filterType : undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    });
    if (result.success && result.data) {
      setLogs(result.data.logs);
      setTotal(result.data.total);
    }
    setLoading(false);
  }, [filterUser, filterType, page]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    async function loadFilters() {
      const [usersResult, typesResult] = await Promise.all([
        getActivityLogUsers(),
        getActivityLogEntityTypes(),
      ]);
      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data);
      }
      if (typesResult.success && typesResult.data) {
        setEntityTypes(typesResult.data);
      }
    }
    loadFilters();
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Journal d&apos;activites</h1>
          <p className="text-muted-foreground">
            Historique de toutes les actions effectuees par les utilisateurs
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filterUser}
          onValueChange={(v) => {
            setFilterUser(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Tous les utilisateurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les utilisateurs</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.userId} value={u.userId}>
                {u.userName || u.userEmail || u.userId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterType}
          onValueChange={(v) => {
            setFilterType(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {entityTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-muted-foreground self-center">
          {total} activite{total !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tableau */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
              <TableHead className="w-[130px]">Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune activite enregistree
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {log.userName || "Inconnu"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.userEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={actionBadge[log.action] || "bg-gray-100 text-gray-700"}
                    >
                      {actionLabel[log.action] || log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.entityType}</TableCell>
                  <TableCell className="text-sm">{log.description}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Precedent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
