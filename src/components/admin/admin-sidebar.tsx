"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { NotificationSound } from "@/components/admin/notification-sound";
import {
  LayoutDashboard,
  BedDouble,
  UtensilsCrossed,
  CalendarDays,
  Images,
  CalendarCheck,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Palmtree,
  Users,
  Star,
  Mail,
  Soup,
  Megaphone,
  Percent,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Chambres",
    href: "/admin/chambres",
    icon: BedDouble,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: UtensilsCrossed,
  },
  {
    title: "Menu Restaurant",
    href: "/admin/menu",
    icon: Soup,
  },
  {
    title: "Événements",
    href: "/admin/evenements",
    icon: CalendarDays,
  },
  {
    title: "Galerie",
    href: "/admin/galerie",
    icon: Images,
  },
  {
    title: "Réservations",
    href: "/admin/reservations",
    icon: CalendarCheck,
  },
  {
    title: "Contacts",
    href: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    title: "Témoignages",
    href: "/admin/temoignages",
    icon: Star,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Annonces",
    href: "/admin/annonces",
    icon: Megaphone,
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
    icon: Percent,
  },
];

const bottomMenuItems = [
  {
    title: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
  },
  {
    title: "Activités",
    href: "/admin/activites",
    icon: Activity,
  },
  {
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
  },
];

function SidebarContentComponent() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Palmtree className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold text-sidebar-foreground">
              Akwa Lodge
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Administration
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-200",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <Separator className="my-4 bg-sidebar-border" />

        <SidebarMenu>
          {bottomMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-200",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </>
  );
}

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarContentComponent />
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex items-center gap-2">
              <Palmtree className="h-5 w-5 text-primary" />
              <span className="font-serif font-semibold">Akwa Lodge Admin</span>
            </div>
          </div>
          {children}
          <NotificationSound />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminSidebar;
