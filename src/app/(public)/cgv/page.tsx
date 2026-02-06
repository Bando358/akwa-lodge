import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente d'Akwa Luxury Lodge - Modalités de réservation et séjour.",
};

export default function CGVPage() {
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
            <ScrollText className="mr-2 h-3 w-3" />
            CGV
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="max-w-2xl mx-auto text-white/90">
            Modalités de réservation et conditions de séjour
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-2xl font-bold mb-4">
              1. Objet
            </h2>
            <p className="text-muted-foreground mb-6">
              Les présentes conditions générales de vente régissent les
              relations contractuelles entre Akwa Luxury Lodge et ses clients
              pour toute réservation de chambre, service ou prestation.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              2. Réservation
            </h2>
            <p className="text-muted-foreground mb-4">
              La réservation devient ferme et définitive dès réception du
              paiement de l&apos;acompte ou de la totalité du séjour.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Acompte requis : 30% du montant total</li>
              <li>Solde à régler à l&apos;arrivée</li>
              <li>Confirmation envoyée sous 24h</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              3. Tarifs
            </h2>
            <p className="text-muted-foreground mb-6">
              Les tarifs affichés sont en FCFA et incluent la TVA. Le
              petit-déjeuner est inclus dans le tarif des chambres. Les
              tarifs peuvent varier selon la saison et les événements
              spéciaux.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              4. Conditions d&apos;annulation
            </h2>
            <p className="text-muted-foreground mb-4">
              Les conditions d&apos;annulation sont les suivantes :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>
                <strong>Plus de 7 jours avant l&apos;arrivée :</strong>{" "}
                Remboursement intégral de l&apos;acompte
              </li>
              <li>
                <strong>Entre 3 et 7 jours :</strong>{" "}
                Remboursement de 50% de l&apos;acompte
              </li>
              <li>
                <strong>Moins de 48 heures :</strong>{" "}
                Acompte non remboursable
              </li>
              <li>
                <strong>No-show :</strong>{" "}
                Facturation de la première nuit
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              5. Arrivée et départ
            </h2>
            <p className="text-muted-foreground mb-6">
              <strong>Check-in :</strong> à partir de 14h00<br />
              <strong>Check-out :</strong> avant 12h00<br />
              Un late check-out peut être demandé selon disponibilité
              (supplément possible).
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              6. Moyens de paiement
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous acceptons les moyens de paiement suivants :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Espèces (FCFA)</li>
              <li>Cartes bancaires (Visa, Mastercard)</li>
              <li>Mobile Money (Orange Money, MTN Money, Wave)</li>
              <li>Virement bancaire</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              7. Règlement intérieur
            </h2>
            <p className="text-muted-foreground mb-4">
              Les clients s&apos;engagent à respecter le règlement intérieur
              de l&apos;établissement, notamment :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Respecter le calme après 22h00</li>
              <li>Ne pas fumer dans les chambres</li>
              <li>Signaler tout dommage causé aux équipements</li>
              <li>Respecter les autres clients et le personnel</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold mb-4">
              8. Responsabilité
            </h2>
            <p className="text-muted-foreground mb-6">
              Akwa Luxury Lodge ne saurait être tenu responsable des objets
              de valeur non déposés au coffre-fort de la réception. Un
              coffre-fort est disponible dans chaque chambre. L&apos;hôtel
              décline toute responsabilité en cas de vol ou de perte d&apos;objets
              personnels.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              9. Force majeure
            </h2>
            <p className="text-muted-foreground mb-6">
              En cas de force majeure (catastrophe naturelle, épidémie,
              troubles civils, etc.), Akwa Luxury Lodge se réserve le droit
              de proposer un report de séjour sans pénalité.
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              10. Réclamations
            </h2>
            <p className="text-muted-foreground mb-6">
              Toute réclamation doit être adressée par écrit à la direction
              dans un délai de 7 jours suivant la fin du séjour à l&apos;adresse
              email : direction@akwalodge.com
            </p>

            <h2 className="font-serif text-2xl font-bold mb-4">
              11. Droit applicable
            </h2>
            <p className="text-muted-foreground mb-6">
              Les présentes CGV sont soumises au droit ivoirien. Tout litige
              sera soumis aux tribunaux compétents d&apos;Abidjan.
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
