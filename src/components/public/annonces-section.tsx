import { getAnnoncesActives } from "@/lib/actions/annonces";
import { AnnoncePosition } from "@prisma/client";
import { AnnoncesCarousel, AnnonceCard } from "./annonce-card";

interface AnnoncesSectionProps {
  position: AnnoncePosition;
  variant?: "carousel" | "grid" | "banner";
  title?: string;
  maxItems?: number;
  className?: string;
}

export async function AnnoncesSection({
  position,
  variant = "carousel",
  title,
  maxItems = 5,
  className,
}: AnnoncesSectionProps) {
  const result = await getAnnoncesActives(position);

  if (!result.success || !result.data || result.data.length === 0) {
    return null;
  }

  const annonces = result.data.slice(0, maxItems).map((a) => ({
    ...a,
    mediaType: a.mediaType as "TEXT" | "IMAGE" | "VIDEO",
    promotion: a.promotion
      ? {
          ...a.promotion,
          valeur: Number(a.promotion.valeur),
        }
      : null,
  }));

  if (variant === "banner" && annonces.length > 0) {
    return (
      <AnnonceCard
        annonce={annonces[0]}
        variant="banner"
        className={className}
      />
    );
  }

  return (
    <section className={className}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-center">
          {title}
        </h2>
      )}

      {variant === "carousel" ? (
        <div className="max-w-lg mx-auto">
          <AnnoncesCarousel annonces={annonces} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {annonces.map((annonce) => (
            <AnnonceCard key={annonce.id} annonce={annonce} variant="card" />
          ))}
        </div>
      )}
    </section>
  );
}

// Composant client pour le popup d'annonce
export { AnnoncePopup } from "./annonce-card";
