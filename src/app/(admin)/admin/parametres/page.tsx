"use client";

import { useState, useEffect } from "react";
import { Settings, Save, RotateCcw, Loader2 } from "lucide-react";
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
import { getSettings, setSettings, resetSettings, defaultSettings } from "@/lib/actions/settings";

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
        toast.success("Paramètres enregistrés");
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
        toast.success("Paramètres réinitialisés");
        loadSettings();
      } else {
        toast.error(result.error || "Erreur lors de la réinitialisation");
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
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configurez les paramètres de votre site
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isResetting}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser les paramètres</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux
                  valeurs par défaut ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Réinitialiser
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
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Les informations de base de votre établissement
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
              <CardTitle>Coordonnées</CardTitle>
              <CardDescription>
                Les informations de contact de votre établissement
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
                  <Label htmlFor="contact_phone">Téléphone</Label>
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
                  <Label htmlFor="horaires_reception">Réception</Label>
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
              <CardTitle>Réseaux sociaux</CardTitle>
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
              <CardTitle>Référencement (SEO)</CardTitle>
              <CardDescription>
                Optimisez votre visibilité sur les moteurs de recherche
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
                <Label htmlFor="seo_keywords">Mots-clés</Label>
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
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>
                Activez ou désactivez des fonctionnalités du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Réservations en ligne</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux visiteurs de faire des demandes de réservation
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
                    Afficher le formulaire d&apos;inscription à la newsletter
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
                    Activer le widget de chat (nécessite une configuration externe)
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
      </Tabs>
    </div>
  );
}
