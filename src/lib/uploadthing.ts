import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Configuration des types de fichiers autorisés
export const ourFileRouter = {
  // Upload d'images pour les chambres
  chambreImage: f({ image: { maxFileSize: "16MB", maxFileCount: 20 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Image chambre uploadée:", file.url);
      return { url: file.url };
    }),

  // Upload d'images pour la galerie
  galerieImage: f({ image: { maxFileSize: "16MB", maxFileCount: 50 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Image galerie uploadée:", file.url);
      return { url: file.url };
    }),

  // Upload d'images générales (accueil, bannières, etc.)
  generalImage: f({ image: { maxFileSize: "16MB", maxFileCount: 20 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Image uploadée:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
