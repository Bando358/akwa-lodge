"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getActivityLogs(options?: {
  userId?: string;
  entityType?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Non autorise" };
    }

    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const where = {
      ...(options?.userId && { userId: options.userId }),
      ...(options?.entityType && { entityType: options.entityType }),
      ...(options?.action && { action: options.action }),
    };

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return { success: true, data: { logs, total } };
  } catch (error) {
    console.error("Erreur lors de la recuperation des activites:", error);
    return { success: false, error: "Erreur lors de la recuperation des activites" };
  }
}

export async function getActivityLogUsers() {
  try {
    const users = await prisma.activityLog.findMany({
      select: {
        userId: true,
        userName: true,
        userEmail: true,
      },
      distinct: ["userId"],
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Erreur" };
  }
}

export async function getActivityLogEntityTypes() {
  try {
    const types = await prisma.activityLog.findMany({
      select: { entityType: true },
      distinct: ["entityType"],
      orderBy: { entityType: "asc" },
    });

    return { success: true, data: types.map((t) => t.entityType) };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Erreur" };
  }
}
