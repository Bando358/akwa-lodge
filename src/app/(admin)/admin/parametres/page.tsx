"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getSettings, setSettings, resetSettings } from "@/lib/actions/settings";
import Link from "next/link";

export default function ParametresPage() {
  const [settings, setSettingsState] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const result = await getSettings();
      if (result.success) {
        setSettingsState(result.data || {});
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await setSettings(settings);
      if (result.success) {
        toast.success("Parametres enregistres");
      } else {
        toast.error(result.error || "Erreur lors de l'enregistrement");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSettings();
      if (result.success) {
        toast.success("Parametres reinitialises");
        loadSettings();
      } else {
        toast.error(result.error || "Erreur lors de la reinitialisation");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tete */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Parametres
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configurez les parametres de votre site
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isResetting}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reinitialiser
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reinitialiser les parametres</AlertDialogTitle>
                <AlertDialogDescription>
                  Etes-vous sur de vouloir reinitialiser tous les parametres aux
                  valeurs par defaut ? Cette action est irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reinitialiser
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="social">Reseaux sociaux</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalites</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations generales</CardTitle>
              <CardDescription>
                Les informations de base de votre etablissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nom du site</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Slogan</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline || ""}
                    onChange={(e) => handleChange("site_tagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ""}
                  onChange={(e) => handleChange("site_description", e.target.value)}
                  rows={3}
                />
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input
                    id="currency"
                    value={settings.currency || ""}
                    onChange={(e) => handleChange("currency", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_methods">Moyens de paiement</Label>
                  <Input
                    id="payment_methods"
                    value={settings.payment_methods || ""}
                    onChange={(e) => handleChange("payment_methods", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Coordonnees</CardTitle>
              <CardDescription>
                Les informations de contact de votre etablissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telephone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ""}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                  <Input
                    id="contact_whatsapp"
                    value={settings.contact_whatsapp || ""}
                    onChange={(e) => handleChange("contact_whatsapp", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_address">Adresse</Label>
                  <Input
                    id="contact_address"
                    value={settings.contact_address || ""}
                    onChange={(e) => handleChange("contact_address", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horaires">
          <Card>
            <CardHeader>
              <CardTitle>Horaires</CardTitle>
              <CardDescription>
                Les horaires d&apos;ouverture et de service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="horaires_reception">Reception</Label>
                  <Input
                    id="horaires_reception"
                    value={settings.horaires_reception || ""}
                    onChange={(e) => handleChange("horaires_reception", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaires_restaurant">Restaurant</Label>
                  <Input
                    id="horaires_restaurant"
                    value={settings.horaires_restaurant || ""}
                    onChange={(e) => handleChange("horaires_restaurant", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaires_bar">Bar</Label>
                  <Input
                    id="horaires_bar"
                    value={settings.horaires_bar || ""}
                    onChange={(e) => handleChange("horaires_bar", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaires_piscine">Piscine</Label>
                  <Input
                    id="horaires_piscine"
                    value={settings.horaires_piscine || ""}
                    onChange={(e) => handleChange("horaires_piscine", e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="horaires_checkin">Check-in</Label>
                  <Input
                    id="horaires_checkin"
                    value={settings.horaires_checkin || ""}
                    onChange={(e) => handleChange("horaires_checkin", e.target.value)}
                    placeholder="14:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaires_checkout">Check-out</Label>
                  <Input
                    id="horaires_checkout"
                    value={settings.horaires_checkout || ""}
                    onChange={(e) => handleChange("horaires_checkout", e.target.value)}
                    placeholder="12:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Reseaux sociaux</CardTitle>
              <CardDescription>
                Liens vers vos profils sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ""}
                    onChange={(e) => handleChange("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ""}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter / X</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter || ""}
                    onChange={(e) => handleChange("social_twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => handleChange("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube || ""}
                    onChange={(e) => handleChange("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_tiktok">TikTok</Label>
                  <Input
                    id="social_tiktok"
                    value={settings.social_tiktok || ""}
                    onChange={(e) => handleChange("social_tiktok", e.target.value)}
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Referencement (SEO)</CardTitle>
              <CardDescription>
                Optimisez votre visibilite sur les moteurs de recherche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Titre SEO</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title || ""}
                  onChange={(e) => handleChange("seo_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">Description SEO</Label>
                <Textarea
                  id="seo_description"
                  value={settings.seo_description || ""}
                  onChange={(e) => handleChange("seo_description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Mots-cles</Label>
                <Input
                  id="seo_keywords"
                  value={settings.seo_keywords || ""}
                  onChange={(e) => handleChange("seo_keywords", e.target.value)}
                  placeholder="hotel, luxe, jacqueville..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalites</CardTitle>
              <CardDescription>
                Activez ou desactivez des fonctionnalites du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Reservations en ligne</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux visiteurs de faire des demandes de reservation
                  </p>
                </div>
                <Switch
                  checked={settings.feature_reservation === "true"}
                  onCheckedChange={(checked) =>
                    handleChange("feature_reservation", checked ? "true" : "false")
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher le formulaire d&apos;inscription a la newsletter
                  </p>
                </div>
                <Switch
                  checked={settings.feature_newsletter === "true"}
                  onCheckedChange={(checked) =>
                    handleChange("feature_newsletter", checked ? "true" : "false")
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Chat en direct</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le widget de chat (necessite une configuration externe)
                  </p>
                </div>
                <Switch
                  checked={settings.feature_chat === "true"}
                  onCheckedChange={(checked) =>
                    handleChange("feature_chat", checked ? "true" : "false")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ ONGLET NOTIFICATIONS ============ */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                Notifications WhatsApp via CallMeBot
              </CardTitle>
              <CardDescription>
                Recevez des alertes WhatsApp pour chaque nouvelle reservation,
                message de contact ou inscription newsletter. Chaque administrateur
                configure ses propres notifications depuis son profil.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comment activer les notifications (2 min)</CardTitle>
              <CardDescription>
                CallMeBot est un service gratuit qui envoie des messages WhatsApp.
                Chaque admin doit suivre ces etapes une seule fois.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Envoyer un message d&apos;autorisation</p>
                  <p className="text-sm text-muted-foreground">
                    Sur votre WhatsApp, envoyez le message suivant au numero{" "}
                    <strong>+34 623 78 95 80</strong> :
                  </p>
                  <p className="mt-2 rounded-md bg-muted px-3 py-2 text-sm font-mono">
                    I allow callmebot to send me messages
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Recuperer votre cle API</p>
                  <p className="text-sm text-muted-foreground">
                    CallMeBot vous repondra avec votre <strong>cle API</strong> (un numero comme 123456).
                    Notez-le.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Configurer votre profil</p>
                  <p className="text-sm text-muted-foreground">
                    Allez dans{" "}
                    <strong>Utilisateurs</strong>, modifiez votre compte et renseignez
                    votre numero WhatsApp et la cle API CallMeBot. Vous pouvez
                    aussi tester l&apos;envoi depuis cette page.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/admin/utilisateurs">
                      Aller aux utilisateurs
                    </Link>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Bon a savoir :</strong> Les notifications sont envoyees a tous
                  les administrateurs actifs qui ont configure leur numero et cle API.
                  Chaque admin recoit ses propres alertes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
