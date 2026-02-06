import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité d'Akwa Luxury Lodge - Protection de vos données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
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
            <Shield className="mr-2 h-3 w-3" />
            Confidentialité
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Politique de Confidentialité
          </h1>
          <p className="max-w-2xl mx-auto text-white/90">
            Comment nous protégeons vos données personnelles
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-2xl font-bold mb-4">
              1. Introduction
            </h2>
            <p className="text-muted-foreground mb-6">
              Akwa Luxury Lodge s&apos;engage à protéger la vie privée de ses
              clients et visiteurs. Cette politique de confidentialité explique
              comment nous collectons, utilisons et protégeons vos données
              personnelles.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              2. Données collectées
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Informations de réservation (dates, préférences)</li>
              <li>Données de navigation sur notre site</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              3. Utilisation des données
            </h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Traiter vos demandes de réservation</li>
              <li>Vous contacter concernant votre séjour</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              4. Protection des données
            </h2>
            <p className="text-muted-foreground mb-6">
              Nous mettons en œuvre des mesures de sécurité appropriées pour
              protéger vos données contre tout accès non autorisé, modification,
              divulgation ou destruction. Nos systèmes sont régulièrement mis
              à jour pour garantir la sécurité de vos informations.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              5. Partage des données
            </h2>
            <p className="text-muted-foreground mb-6">
              Nous ne vendons pas vos données personnelles. Nous pouvons
              partager vos informations avec des prestataires de services
              tiers uniquement dans le cadre de l&apos;exécution de nos
              services (par exemple, systèmes de paiement).
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              6. Cookies
            </h2>
            <p className="text-muted-foreground mb-6">
              Notre site utilise des cookies pour améliorer votre expérience
              de navigation. Vous pouvez configurer votre navigateur pour
              refuser les cookies, mais cela pourrait affecter certaines
              fonctionnalités du site.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              7. Vos droits
            </h2>
            <p className="text-muted-foreground mb-4">
              Conformément à la réglementation en vigueur, vous disposez des
              droits suivants :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              8. Contact
            </h2>
            <p className="text-muted-foreground mb-6">
              Pour toute question concernant cette politique ou pour exercer
              vos droits, contactez-nous à :<br />
              Email : privacy@akwalodge.com<br />
              Téléphone : +225 07 00 00 00 00
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              9. Modifications
            </h2>
            <p className="text-muted-foreground mb-6">
              Nous nous réservons le droit de modifier cette politique à tout
              moment. Les modifications seront publiées sur cette page avec
              la date de mise à jour.
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
