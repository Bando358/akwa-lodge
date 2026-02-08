import { getImages } from "@/lib/actions/images";
import { getChambres } from "@/lib/actions/chambres";
import { getPromotionsActives } from "@/lib/actions/promotions";
import { HomePageClient } from "./home-client";
import { AnnoncesSection } from "@/components/public/annonces-section";

// Empêcher le cache statique pour que le shuffle s'exécute à chaque requête
export const dynamic = "force-dynamic";

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
  // Charger les images, chambres vedettes et promotions côté serveur
  const [imagesResult, chambresResult, promosResult] = await Promise.all([
    getImages({ categorie: "accueil" }),
    getChambres({ isActive: true, isFeatured: true, limit: 6 }),
    getPromotionsActives("CHAMBRE"),
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

  // Sérialiser les promotions pour le Client Component
  const promotions =
    promosResult.success && promosResult.data
      ? promosResult.data.map((p) => ({
          id: p.id,
          nom: p.nom,
          type: p.type,
          valeur: Number(p.valeur),
          cible: p.cible,
          chambreId: p.chambreId,
          codePromo: p.codePromo,
        }))
      : [];

  return (
    <>
      <HomePageClient
        initialBannerImages={bannerImages}
        featuredRooms={featuredRooms}
        introImages={allChambreImages}
        promotions={promotions}
      />
      <AnnoncesSection position="ACCUEIL" variant="dialog" />
    </>
  );
}
