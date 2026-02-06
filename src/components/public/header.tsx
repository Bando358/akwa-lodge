"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Hébergement", href: "/hebergement" },
  { name: "Restauration", href: "/restauration" },
  { name: "Activités", href: "/activites" },
  {
    name: "Événements",
    href: "/evenements",
    children: [
      { name: "Événements", href: "/evenements" },
      { name: "Conférences", href: "/conferences" },
    ],
  },
  { name: "Galerie", href: "/galerie" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Barre supérieure */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs lg:text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+2250700048097"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+225 07 00 04 80 97</span>
            </a>
            <a
              href="mailto:Contact@akwaluxurylodge.com"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Contact@akwaluxurylodge.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Jacqueville - Sassako-Bégnini, Côte d&apos;Ivoire</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md"
            : "bg-background"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 overflow-hidden rounded-full">
                <Image
                  src="/logo-akwa-lodge.jpg"
                  alt="Akwa Luxury Lodge"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-lg lg:text-xl font-bold text-foreground">
                  Akwa Luxury Lodge
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                  Jacqueville - Sassako-Bégnini
                </span>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Bouton réservation desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Button asChild className="font-medium bg-primary hover:bg-primary/90">
                <Link href="/reservation">Réserver</Link>
              </Button>
            </div>

            {/* Menu mobile */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src="/logo-akwa-lodge.jpg"
                        alt="Akwa Luxury Lodge"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-serif">Akwa Luxury Lodge</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link
                        href="/reservation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Réserver maintenant
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                    <a
                      href="tel:+2250700048097"
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      +225 07 00 04 80 97
                    </a>
                    <a
                      href="mailto:Contact@akwaluxurylodge.com"
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      Contact@akwaluxurylodge.com
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
