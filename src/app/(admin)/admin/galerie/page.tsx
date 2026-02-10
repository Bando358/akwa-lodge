"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Images, Plus, Trash2, Star, StarOff, Loader2, Upload, Pencil, Eye, AlertTriangle, CheckCircle, Trash } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  getImages,
  deleteImages,
  toggleImageFeatured,
  createImages,
  updateImage,
  getImageCategories,
  checkInvalidImages,
  cleanupInvalidImages,
} from "@/lib/actions/images";

type ImageType = {
  id: string;
  url: string;
  alt: string | null;
  titre: string | null;
  description: string | null;
  categorie: string | null;
  isFeatured: boolean;
  createdAt: Date;
};

// Categories predefinies pour les images
const IMAGE_CATEGORIES = [
  { value: "accueil", label: "Page d'accueil" },
  { value: "chambres", label: "Chambres" },
  { value: "restaurant", label: "Restaurant" },
  { value: "piscine", label: "Piscine" },
  { value: "spa", label: "Spa & Bien-etre" },
  { value: "evenements", label: "Evenements" },
  { value: "conferences", label: "Salles de conference" },
  { value: "exterieur", label: "Exterieur & Jardins" },
  { value: "plage", label: "Plage & Lagune" },
  { value: "activites", label: "Activites" },
  { value: "autre", label: "Autre" },
] as const;

// Fonction pour obtenir le label d'une categorie
function getCategoryLabel(value: string | null): string {
  if (!value) return "";
  const cat = IMAGE_CATEGORIES.find((c) => c.value === value);
  return cat ? cat.label : value;
}

export default function GaleriePage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [images, setImages] = useState<ImageType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageType | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [newImageMeta, setNewImageMeta] = useState({ alt: "", categorie: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    alt: "",
    titre: "",
    description: "",
    categorie: "",
    isFeatured: false,
  });
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [invalidImagesData, setInvalidImagesData] = useState<{
    total: number;
    valid: number;
    invalid: number;
    invalidImages: Array<{ id: string; url: string; categorie: string | null; titre: string | null }>;
  } | null>(null);
  const [isCheckingImages, setIsCheckingImages] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        toast.success(`${selectedImages.length} image(s) supprimee(s)`);
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
            : "Image retiree des vedettes"
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
      toast.error("Aucune image a ajouter");
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
        toast.success(`${uploadedUrls.length} image(s) ajoutee(s) avec succes`);
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

  const handleEditImage = (image: ImageType) => {
    setEditingImage(image);
    setEditForm({
      alt: image.alt || "",
      titre: image.titre || "",
      description: image.description || "",
      categorie: image.categorie || "",
      isFeatured: image.isFeatured,
    });
    setShowEditDialog(true);
  };

  const handlePreviewImage = (image: ImageType) => {
    setPreviewImage(image);
    setShowPreviewDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;

    setIsSaving(true);
    try {
      const result = await updateImage(editingImage.id, {
        alt: editForm.alt || null,
        titre: editForm.titre || null,
        description: editForm.description || null,
        categorie: editForm.categorie || null,
        isFeatured: editForm.isFeatured,
      });

      if (result.success) {
        toast.success("Image mise a jour avec succes");
        setShowEditDialog(false);
        setEditingImage(null);
        loadData();
      } else {
        toast.error(result.error || "Erreur lors de la mise a jour");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditingImage(null);
    setEditForm({
      alt: "",
      titre: "",
      description: "",
      categorie: "",
      isFeatured: false,
    });
  };

  const handleCheckInvalidImages = async () => {
    setIsCheckingImages(true);
    try {
      const result = await checkInvalidImages();
      if (result.success && result.data) {
        setInvalidImagesData(result.data);
        setShowCleanupDialog(true);
      } else {
        toast.error(result.error || "Erreur lors de la verification");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsCheckingImages(false);
    }
  };

  const handleCleanupImages = async () => {
    setIsCleaningUp(true);
    try {
      const result = await cleanupInvalidImages();
      if (result.success) {
        toast.success(result.message || "Nettoyage termine");
        setShowCleanupDialog(false);
        setInvalidImagesData(null);
        loadData();
      } else {
        toast.error(result.error || "Erreur lors du nettoyage");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tete */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Images className="h-8 w-8 text-primary" />
            Galerie
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerez les images de votre etablissement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCheckInvalidImages}
            disabled={isCheckingImages}
          >
            {isCheckingImages ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="mr-2 h-4 w-4" />
            )}
            Verifier les URLs
          </Button>
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
                Uploadez vos images directement. Vous pouvez en ajouter plusieurs a la fois.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Zone d'upload */}
              <ImageUpload
                value={uploadedUrls}
                onChange={(urls) => setUploadedUrls(urls as string[])}
                multiple
                maxFiles={20}
                endpoint="galerieImage"
              />

              {/* Metadonnees communes */}
              {uploadedUrls.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Ces informations seront appliquees a toutes les images uploadees
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
                      <Label htmlFor="categorie">Categorie</Label>
                      <Select
                        value={newImageMeta.categorie}
                        onValueChange={(value) =>
                          setNewImageMeta({ ...newImageMeta, categorie: value })
                        }
                      >
                        <SelectTrigger id="categorie">
                          <SelectValue placeholder="Selectionner une categorie" />
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
              Categories
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
                  ? `${selectedImages.length} image(s) selectionnee(s)`
                  : "Selectionnez des images pour les modifier"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les categories</SelectItem>
                  {IMAGE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isAdmin && selectedImages.length > 0 && (
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
                  Tout selectionner
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
                        onClick={() => handlePreviewImage(image)}
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleEditImage(image)}
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleToggleFeatured(image.id)}
                        title={image.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
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
                Commencez par ajouter votre premiere image
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
              Etes-vous sur de vouloir supprimer {selectedImages.length} image(s) ?
              Cette action est irreversible.
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

      {/* Dialog d'edition d'image */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) handleCloseEditDialog();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;image</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette image
            </DialogDescription>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-6 py-4">
              {/* Apercu de l'image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={editingImage.url}
                  alt={editingImage.alt || "Image"}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Formulaire */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-titre">Titre</Label>
                    <Input
                      id="edit-titre"
                      placeholder="Titre de l'image"
                      value={editForm.titre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, titre: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-categorie">Categorie</Label>
                    <Select
                      value={editForm.categorie || "_none_"}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, categorie: value === "_none_" ? "" : value })
                      }
                    >
                      <SelectTrigger id="edit-categorie">
                        <SelectValue placeholder="Selectionner une categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">Aucune categorie</SelectItem>
                        {IMAGE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-alt">Texte alternatif (SEO)</Label>
                  <Input
                    id="edit-alt"
                    placeholder="Description de l'image pour le SEO"
                    value={editForm.alt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, alt: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Description detaillee de l'image"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-featured">Image en vedette</Label>
                    <p className="text-sm text-muted-foreground">
                      Les images en vedette apparaissent sur la page d&apos;accueil
                    </p>
                  </div>
                  <Switch
                    id="edit-featured"
                    checked={editForm.isFeatured}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, isFeatured: checked })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de preview */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewImage?.titre || "Apercu de l'image"}</DialogTitle>
            {previewImage?.description && (
              <DialogDescription>{previewImage.description}</DialogDescription>
            )}
          </DialogHeader>
          {previewImage && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={previewImage.url}
                  alt={previewImage.alt || "Image"}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {previewImage.categorie && (
                  <Badge variant="secondary">
                    {getCategoryLabel(previewImage.categorie)}
                  </Badge>
                )}
                {previewImage.isFeatured && (
                  <Badge className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    En vedette
                  </Badge>
                )}
              </div>
              {previewImage.alt && (
                <p className="text-sm text-muted-foreground">
                  <strong>Alt:</strong> {previewImage.alt}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              setShowPreviewDialog(false);
              if (previewImage) handleEditImage(previewImage);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de nettoyage des images invalides */}
      <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {invalidImagesData && invalidImagesData.invalid > 0 ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Verification des images
            </DialogTitle>
            <DialogDescription>
              Resultat de la verification des URLs d&apos;images
            </DialogDescription>
          </DialogHeader>
          {invalidImagesData && (
            <div className="space-y-4 py-4">
              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{invalidImagesData.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{invalidImagesData.valid}</div>
                  <div className="text-sm text-muted-foreground">Valides</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{invalidImagesData.invalid}</div>
                  <div className="text-sm text-muted-foreground">Invalides</div>
                </div>
              </div>

              {/* Liste des images invalides */}
              {invalidImagesData.invalid > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Images avec URLs invalides:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {invalidImagesData.invalidImages.map((img) => (
                      <div key={img.id} className="flex items-start gap-2 p-2 bg-red-50 rounded text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{img.titre || "Sans titre"}</div>
                          <div className="text-xs text-muted-foreground truncate">{img.url}</div>
                          {img.categorie && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {getCategoryLabel(img.categorie)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ces images ont des URLs qui ne pointent pas vers Uploadthing et ne s&apos;afficheront pas correctement.
                    Vous pouvez les supprimer et re-uploader de nouvelles images.
                  </p>
                </div>
              )}

              {invalidImagesData.invalid === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-4 text-lg font-medium">Toutes les images sont valides!</p>
                  <p className="text-sm text-muted-foreground">
                    Aucune image avec une URL invalide n&apos;a ete trouvee.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCleanupDialog(false)}>
              Fermer
            </Button>
            {isAdmin && invalidImagesData && invalidImagesData.invalid > 0 && (
              <Button
                variant="destructive"
                onClick={handleCleanupImages}
                disabled={isCleaningUp}
              >
                {isCleaningUp ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                Supprimer les invalides ({invalidImagesData.invalid})
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
