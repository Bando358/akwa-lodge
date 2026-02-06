"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Images, Plus, Trash2, Star, StarOff, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  getImages,
  deleteImages,
  toggleImageFeatured,
  createImages,
  getImageCategories,
} from "@/lib/actions/images";

type ImageType = {
  id: string;
  url: string;
  alt: string | null;
  titre: string | null;
  categorie: string | null;
  isFeatured: boolean;
  createdAt: Date;
};

// Catégories prédéfinies pour les images
// Catégories prédéfinies pour les images
const IMAGE_CATEGORIES = [
  { value: "accueil", label: "Page d'accueil" },
  { value: "chambres", label: "Chambres" },
  { value: "restaurant", label: "Restaurant" },
  { value: "piscine", label: "Piscine" },
  { value: "spa", label: "Spa & Bien-être" },
  { value: "evenements", label: "Événements" },
  { value: "conferences", label: "Salles de conférence" },
  { value: "exterieur", label: "Extérieur & Jardins" },
  { value: "plage", label: "Plage & Lagune" },
  { value: "activites", label: "Activités" },
  { value: "autre", label: "Autre" },
] as const;

// Fonction pour obtenir le label d'une catégorie
function getCategoryLabel(value: string | null): string {
  if (!value) return "";
  const cat = IMAGE_CATEGORIES.find((c) => c.value === value);
  return cat ? cat.label : value;
}

export default function GaleriePage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [newImageMeta, setNewImageMeta] = useState({ alt: "", categorie: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [imagesResult, categoriesResult] = await Promise.all([
        getImages(selectedCategory !== "all" ? { categorie: selectedCategory } : undefined),
        getImageCategories(),
      ]);

      if (imagesResult.success) {
        setImages(imagesResult.data || []);
      }
      if (categoriesResult.success) {
        setCategories(categoriesResult.data || []);
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelectImage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedImages([...selectedImages, id]);
    } else {
      setSelectedImages(selectedImages.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map((i) => i.id));
    } else {
      setSelectedImages([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const result = await deleteImages(selectedImages);
      if (result.success) {
        toast.success(`${selectedImages.length} image(s) supprimée(s)`);
        setSelectedImages([]);
        loadData();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
    setShowDeleteDialog(false);
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const result = await toggleImageFeatured(id);
      if (result.success) {
        toast.success(
          result.data?.isFeatured
            ? "Image mise en vedette"
            : "Image retirée des vedettes"
        );
        loadData();
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleSaveImages = async () => {
    if (uploadedUrls.length === 0) {
      toast.error("Aucune image à ajouter");
      return;
    }

    setIsSaving(true);
    try {
      const imagesToCreate = uploadedUrls.map((url, index) => ({
        url,
        alt: newImageMeta.alt || null,
        categorie: newImageMeta.categorie || null,
        ordre: index,
        isFeatured: false,
      }));

      const result = await createImages(imagesToCreate);

      if (result.success) {
        toast.success(`${uploadedUrls.length} image(s) ajoutée(s) avec succès`);
        setUploadedUrls([]);
        setNewImageMeta({ alt: "", categorie: "" });
        setShowAddDialog(false);
        loadData();
      } else {
        toast.error(result.error || "Erreur lors de l'ajout");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setUploadedUrls([]);
    setNewImageMeta({ alt: "", categorie: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Images className="h-8 w-8 text-primary" />
            Galerie
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les images de votre établissement
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          else setShowAddDialog(true);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Ajouter des images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter des images</DialogTitle>
              <DialogDescription>
                Uploadez vos images directement. Vous pouvez en ajouter plusieurs à la fois.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Zone d'upload */}
              <ImageUpload
                value={uploadedUrls}
                onChange={(urls) => setUploadedUrls(urls as string[])}
                multiple
                maxFiles={20}
              />

              {/* Métadonnées communes */}
              {uploadedUrls.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Ces informations seront appliquées à toutes les images uploadées
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alt">Texte alternatif</Label>
                      <Input
                        id="alt"
                        placeholder="Description des images"
                        value={newImageMeta.alt}
                        onChange={(e) =>
                          setNewImageMeta({ ...newImageMeta, alt: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select
                        value={newImageMeta.categorie}
                        onValueChange={(value) =>
                          setNewImageMeta({ ...newImageMeta, categorie: value })
                        }
                      >
                        <SelectTrigger id="categorie">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {IMAGE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button
                onClick={handleSaveImages}
                disabled={isSaving || uploadedUrls.length === 0}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Enregistrer {uploadedUrls.length > 0 && `(${uploadedUrls.length})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En vedette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {images.filter((i) => i.isFeatured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Catégories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                {selectedImages.length > 0
                  ? `${selectedImages.length} image(s) sélectionnée(s)`
                  : "Sélectionnez des images pour les modifier"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {IMAGE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedImages.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer ({selectedImages.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <Checkbox
                  checked={selectedImages.length === images.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Tout sélectionner
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={(checked) =>
                          handleSelectImage(image.id, checked as boolean)
                        }
                        className="bg-white/80"
                      />
                    </div>
                    {image.isFeatured && (
                      <Badge className="absolute top-2 right-2 z-10 bg-yellow-500">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Vedette
                      </Badge>
                    )}
                    <Image
                      src={image.url}
                      alt={image.alt || "Image"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleToggleFeatured(image.id)}
                      >
                        {image.isFeatured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {image.categorie && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="bg-white/80">
                          {getCategoryLabel(image.categorie)}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Images className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucune image</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par ajouter votre première image
              </p>
              <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter des images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedImages.length} image(s) ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
