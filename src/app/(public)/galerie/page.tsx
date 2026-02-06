import { getImages, getImageCategories } from "@/lib/actions/images";
import { GalerieClient } from "./galerie-client";

// Server Component - pré-charge les images côté serveur
export default async function GaleriePage() {
  // Charger les images et catégories côté serveur
  const [imagesResult, categoriesResult] = await Promise.all([
    getImages(),
    getImageCategories(),
  ]);

  // Préparer les images pour le client (exclure les images de banner)
  const galleryImages =
    imagesResult.success && imagesResult.data
      ? imagesResult.data
          .filter((img) => img.categorie !== "accueil") // Exclure les images de banner
          .map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            titre: img.titre,
            categorie: img.categorie,
          }))
      : [];

  // Préparer les catégories (exclure "accueil" qui est pour la page d'accueil)
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data.filter((cat) => cat !== "accueil")
      : [];

  return <GalerieClient images={galleryImages} categories={categories} />;
}
