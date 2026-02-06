import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Vérifier si on utilise Vercel Blob ou le stockage local
const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Types de fichiers autorisés
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Tailles maximales
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB pour les vidéos

// Générer un nom de fichier unique
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop()?.toLowerCase() || "";
  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 50);
  return `${baseName}-${timestamp}-${random}.${ext}`;
}

// Déterminer le dossier de destination
function getUploadFolder(mimeType: string): string {
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return "videos";
  }
  return "images";
}

// Upload vers le stockage local
async function uploadToLocal(
  file: File,
  folder: string,
  fileName: string
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  // Créer le dossier s'il n'existe pas
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  // Retourner l'URL relative accessible publiquement
  return `/uploads/${folder}/${fileName}`;
}

// Supprimer du stockage local
async function deleteFromLocal(url: string): Promise<void> {
  // Extraire le chemin relatif de l'URL
  const relativePath = url.replace(/^\/uploads\//, "");
  const filePath = path.join(process.cwd(), "public", "uploads", relativePath);

  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression locale:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const uploadedFiles: {
      url: string;
      name: string;
      type: string;
      size: number;
    }[] = [];
    const errors: string[] = [];

    // Log du mode de stockage utilisé
    console.log(
      `Mode de stockage: ${useVercelBlob ? "Vercel Blob" : "Local (public/uploads)"}`
    );

    for (const file of files) {
      // Vérifier le type de fichier
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`Type de fichier non autorisé: ${file.name}`);
        continue;
      }

      // Vérifier la taille
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        errors.push(
          `Fichier trop volumineux: ${file.name} (max ${maxSizeMB}MB)`
        );
        continue;
      }

      try {
        const folder = getUploadFolder(file.type);
        const uniqueFileName = generateFileName(file.name);
        let fileUrl: string;

        if (useVercelBlob) {
          // Upload vers Vercel Blob (production)
          const blobPath = `${folder}/${uniqueFileName}`;
          const blob = await put(blobPath, file, {
            access: "public",
            addRandomSuffix: false,
          });
          fileUrl = blob.url;
        } else {
          // Upload vers le stockage local (développement)
          fileUrl = await uploadToLocal(file, folder, uniqueFileName);
        }

        uploadedFiles.push({
          url: fileUrl,
          name: file.name,
          type: file.type,
          size: file.size,
        });
      } catch (err) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, err);
        errors.push(`Erreur lors de l'upload: ${file.name}`);
      }
    }

    if (uploadedFiles.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      storage: useVercelBlob ? "vercel-blob" : "local",
    });
  } catch (error) {
    console.error("Erreur d'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

// Supprimer un fichier
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    // Déterminer si c'est un fichier local ou Vercel Blob
    const isLocalFile = url.startsWith("/uploads/");

    if (isLocalFile) {
      // Supprimer du stockage local
      await deleteFromLocal(url);
    } else {
      // Supprimer de Vercel Blob
      try {
        await del(url);
      } catch (err) {
        console.error("Erreur lors de la suppression Vercel Blob:", err);
        // On continue même si la suppression échoue
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur de suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
