import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { PushNotificationBanner } from "@/components/push-notification-banner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PushNotificationBanner />
    </div>
  );
}
