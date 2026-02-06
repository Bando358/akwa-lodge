import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales d'Akwa Luxury Lodge - Informations juridiques et légales.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-primary/90 to-accent">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <Badge
            variant="outline"
            className="mb-4 border-secondary/50 text-secondary bg-secondary/10"
          >
            <FileText className="mr-2 h-3 w-3" />
            Légal
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Mentions Légales
          </h1>
          <p className="max-w-2xl mx-auto text-white/90">
            Informations juridiques concernant Akwa Luxury Lodge
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-2xl font-bold mb-4">
              1. Éditeur du site
            </h2>
            <p className="text-muted-foreground mb-6">
              Le site akwalodge.com est édité par :<br />
              <strong>Akwa Luxury Lodge SARL</strong><br />
              Jacqueville, Côte d&apos;Ivoire<br />
              Capital social : 10 000 000 FCFA<br />
              RCCM : CI-ABJ-2020-B-12345<br />
              Téléphone : +225 07 00 00 00 00<br />
              Email : contact@akwalodge.com
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              2. Directeur de la publication
            </h2>
            <p className="text-muted-foreground mb-6">
              Le directeur de la publication est M./Mme [Nom du Directeur],
              en qualité de Gérant de la société Akwa Luxury Lodge SARL.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              3. Hébergement
            </h2>
            <p className="text-muted-foreground mb-6">
              Ce site est hébergé par :<br />
              [Nom de l&apos;hébergeur]<br />
              [Adresse de l&apos;hébergeur]<br />
              [Contact de l&apos;hébergeur]
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-muted-foreground mb-6">
              L&apos;ensemble du contenu du site akwalodge.com (textes, images,
              vidéos, logos, icônes, etc.) est protégé par le droit d&apos;auteur
              et le droit des marques. Toute reproduction, représentation,
              modification, publication, adaptation de tout ou partie des
              éléments du site est interdite sans autorisation écrite préalable.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-muted-foreground mb-6">
              Akwa Luxury Lodge s&apos;efforce d&apos;assurer l&apos;exactitude
              des informations diffusées sur ce site. Toutefois, elle ne peut
              garantir l&apos;exactitude, la précision ou l&apos;exhaustivité
              des informations mises à disposition. Les informations présentes
              sur le site sont susceptibles d&apos;être modifiées à tout moment.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              6. Cookies
            </h2>
            <p className="text-muted-foreground mb-6">
              Le site peut utiliser des cookies pour améliorer l&apos;expérience
              utilisateur. Pour plus d&apos;informations, veuillez consulter
              notre politique de confidentialité.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              7. Droit applicable
            </h2>
            <p className="text-muted-foreground mb-6">
              Les présentes mentions légales sont régies par le droit ivoirien.
              En cas de litige, les tribunaux d&apos;Abidjan seront seuls
              compétents.
            </p>

            <p className="text-sm text-muted-foreground mt-12">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
