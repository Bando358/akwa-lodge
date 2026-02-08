import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { PushNotificationBanner } from "@/components/push-notification-banner";
import { AnnoncesSection } from "@/components/public/annonces-section";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Banniere d'annonces en haut du site */}
      <AnnoncesSection position="BANNIERE" variant="banner" />
      <AnnoncesSection position="TOUTES_PAGES" variant="banner" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PushNotificationBanner />
    </div>
  );
}
