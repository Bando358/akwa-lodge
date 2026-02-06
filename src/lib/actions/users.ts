"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// Schéma de validation pour les utilisateurs
const userSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  role: z.nativeEnum(Role).default("EDITOR"),
  isActive: z.boolean().default(true),
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères").optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

type UserInput = z.infer<typeof userSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Récupérer tous les utilisateurs
export async function getUsers(options?: {
  isActive?: boolean;
  role?: Role;
}) {
  try {
    const users = await prisma.user.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.role && { role: options.role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return { success: false, error: "Erreur lors de la récupération des utilisateurs" };
  }
}

// Récupérer un utilisateur par ID
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la récupération de l'utilisateur" };
  }
}

// Créer un utilisateur
export async function createUser(data: UserInput) {
  try {
    const validatedData = userSchema.parse(data);

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { success: false, error: "Cet email est déjà utilisé" };
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/utilisateurs");

    return { success: true, data: user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la création de l'utilisateur" };
  }
}

// Mettre à jour un utilisateur
export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    const validatedData = updateUserSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Vérifier l'unicité de l'email si changé
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (userWithEmail) {
        return { success: false, error: "Cet email est déjà utilisé" };
      }
    }

    // Hasher le nouveau mot de passe si fourni
    let hashedPassword;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...validatedData,
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath(`/admin/utilisateurs/${id}`);

    return { success: true, data: user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la mise à jour de l'utilisateur" };
  }
}

// Supprimer un utilisateur
export async function deleteUser(id: string) {
  try {
    // Vérifier qu'on ne supprime pas le dernier admin
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", isActive: true },
    });

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    if (userToDelete.role === "ADMIN" && adminCount <= 1) {
      return { success: false, error: "Impossible de supprimer le dernier administrateur" };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/utilisateurs");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la suppression de l'utilisateur" };
  }
}

// Activer/Désactiver un utilisateur
export async function toggleUserActive(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Vérifier qu'on ne désactive pas le dernier admin
    if (user.role === "ADMIN" && user.isActive) {
      const activeAdminCount = await prisma.user.count({
        where: { role: "ADMIN", isActive: true },
      });

      if (activeAdminCount <= 1) {
        return { success: false, error: "Impossible de désactiver le dernier administrateur" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    revalidatePath("/admin/utilisateurs");

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Erreur lors du changement de statut" };
  }
}

// Changer le rôle d'un utilisateur
export async function updateUserRole(id: string, role: Role) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Vérifier qu'on ne retire pas le dernier admin
    if (user.role === "ADMIN" && role !== "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN", isActive: true },
      });

      if (adminCount <= 1) {
        return { success: false, error: "Impossible de retirer le rôle du dernier administrateur" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    revalidatePath("/admin/utilisateurs");

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Erreur lors du changement de rôle:", error);
    return { success: false, error: "Erreur lors du changement de rôle" };
  }
}

// Statistiques utilisateurs
export async function getUserStats() {
  try {
    const [total, admins, editors, actifs] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "EDITOR" } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      data: { total, admins, editors, actifs },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}
