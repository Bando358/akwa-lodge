import { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Akwa Luxury Lodge pour toute demande d'information, réservation ou événement. Notre équipe est à votre écoute.",
};

export default function ContactPage() {
  return <ContactClient />;
}
