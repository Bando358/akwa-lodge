"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

const quickLinks = [
  { name: "Accueil", href: "/" },
  { name: "Hébergement", href: "/hebergement" },
  { name: "Restauration", href: "/restauration" },
  { name: "Activités", href: "/activites" },
  { name: "Événements", href: "/evenements" },
  { name: "Galerie", href: "/galerie" },
];

const services = [
  { name: "Réservation", href: "/reservation" },
  { name: "Conférences", href: "/conferences" },
  { name: "Mariages", href: "/evenements" },
  { name: "Séminaires", href: "/conferences" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/p/Akwa-Luxury-Lodge-61578788417026/" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/akwaluxlodge" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await subscribeNewsletter({
        email: email.trim(),
        source: "footer",
      });

      if (result.success) {
        setIsSubscribed(true);
        setEmail("");
        toast.success("Inscription réussie !");
      } else {
        toast.error(result.error || "Erreur lors de l'inscription");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground overflow-hidden">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-16">
        <motion.div
          className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* À propos */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative h-12 w-12 overflow-hidden rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/logo-akwa-lodge.jpg"
                  alt="Akwa Luxury Lodge"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div>
                <span className="font-serif text-xl font-bold">
                  Akwa Luxury Lodge
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed">
              Un havre de paix en bord de mer. Découvrez l&apos;élégance
              naturelle de Jacqueville dans un cadre raffiné alliant luxe et
              authenticité africaine.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  aria-label={social.name}
                  whileHover={{ scale: 1.15, y: -3 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Liens rapides */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-6">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block"
                  >
                    <motion.span whileHover={{ x: 5 }} className="inline-block">
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-6">
              Nos services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    href={service.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block"
                  >
                    <motion.span whileHover={{ x: 5 }} className="inline-block">
                      {service.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <motion.li
                className="flex items-start gap-3"
                whileHover={{ x: 3 }}
              >
                <MapPin className="h-5 w-5 mt-0.5 text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Jacqueville - Sassako-Bégnini
                  <br />
                  Côte d&apos;Ivoire
                </span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }}>
                <a
                  href="tel:+2250700048097"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Phone className="h-5 w-5 text-secondary" />
                  +225 07 00 04 80 97
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }}>
                <a
                  href="mailto:Contact@akwaluxurylodge.com"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Mail className="h-5 w-5 text-secondary" />
                  Contact@akwaluxurylodge.com
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="mt-8 sm:mt-10 lg:mt-12 rounded-xl sm:rounded-2xl bg-white/5 p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold">
                Restez informé
              </h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-primary-foreground/80">
                Inscrivez-vous à notre newsletter pour recevoir nos offres
                exclusives et actualités.
              </p>
            </div>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle className="h-5 w-5" />
                <span>Merci pour votre inscription !</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-secondary"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex-shrink-0"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        className="border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-primary-foreground/60">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Akwa Luxury Lodge. Tous droits
              réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/mentions-legales" className="hover:text-secondary transition-colors">
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-secondary transition-colors"
              >
                Confidentialité
              </Link>
              <Link href="/cgv" className="hover:text-secondary transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
