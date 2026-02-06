import { getImages } from "@/lib/actions/images";
import { getChambres } from "@/lib/actions/chambres";
import { HomePageClient } from "./home-client";

// Fonction utilitaire pour mélanger un tableau (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Server Component - pré-charge les données côté serveur
export default async function HomePage() {
  // Charger les images et chambres vedettes côté serveur
  const [imagesResult, chambresResult] = await Promise.all([
    getImages({ categorie: "accueil" }),
    getChambres({ isActive: true, isFeatured: true, limit: 6 }),
  ]);

  // Mélanger les images côté serveur pour un affichage aléatoire
  const bannerImages = imagesResult.success && imagesResult.data
    ? shuffleArray(imagesResult.data.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })))
    : [];

  // Convertir les chambres pour le client (avec toutes les images)
  const featuredRooms = chambresResult.success && chambresResult.data
    ? chambresResult.data.map(chambre => ({
        id: chambre.id,
        nom: chambre.nom,
        slug: chambre.slug,
        type: chambre.type,
        descriptionCourte: chambre.descriptionCourte,
        prix: Number(chambre.prix),
        capacite: chambre.capacite,
        superficie: chambre.superficie,
        images: chambre.images.map(img => img.url),
        isFeatured: chambre.isFeatured,
      }))
    : [];

  // Collecter toutes les images de chambres pour le diaporama de la section introduction
  const allChambreImages = chambresResult.success && chambresResult.data
    ? shuffleArray(
        chambresResult.data.flatMap(chambre =>
          chambre.images.map(img => ({
            url: img.url,
            alt: chambre.nom,
          }))
        )
      )
    : [];

  return (
    <HomePageClient
      initialBannerImages={bannerImages}
      featuredRooms={featuredRooms}
      introImages={allChambreImages}
    />
  );
}
