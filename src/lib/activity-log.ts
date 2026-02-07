import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function logActivity(params: {
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: object;
}) {
  try {
    const session = await auth();
    if (!session?.user) return;

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name || null,
        userEmail: session.user.email,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description,
        metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
      },
    });
  } catch (error) {
    console.error("[ActivityLog] Erreur:", error);
  }
}
