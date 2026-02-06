// Types pour l'application Akwa Luxury Lodge

export type Role = "ADMIN" | "EDITOR";

export type ServiceType =
  | "RESTAURATION"
  | "ACTIVITE"
  | "BIEN_ETRE"
  | "PISCINE"
  | "TRANSPORT"
  | "AUTRE";

export type EvenementType =
  | "EVENEMENT"
  | "CONFERENCE"
  | "MARIAGE"
  | "SEMINAIRE"
  | "TEAM_BUILDING"
  | "RECEPTION";

export type ReservationStatut =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "ANNULEE"
  | "TERMINEE";

export type ContactSujet =
  | "INFORMATION"
  | "RESERVATION"
  | "EVENEMENT"
  | "RECLAMATION"
  | "PARTENARIAT"
  | "AUTRE";

// Types pour les formulaires
export interface ChambreFormData {
  nom: string;
  slug?: string;
  description: string;
  descriptionCourte: string;
  prix: number;
  prixWeekend?: number;
  capacite: number;
  superficie?: number;
  nombreLits?: number;
  typeLit?: string;
  vue?: string;
  etage?: number;
  equipements: string[];
  caracteristiques: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  ordre?: number;
}

export interface ServiceFormData {
  nom: string;
  slug?: string;
  description: string;
  descriptionCourte: string;
  type: ServiceType;
  icone?: string;
  prix?: number;
  prixDescription?: string;
  horaires?: string;
  capacite?: number;
  duree?: string;
  inclus: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  ordre?: number;
}

export interface EvenementFormData {
  titre: string;
  slug?: string;
  description: string;
  descriptionCourte: string;
  type: EvenementType;
  dateDebut: Date;
  dateFin?: Date;
  heureDebut?: string;
  heureFin?: string;
  lieu?: string;
  capaciteMin?: number;
  capaciteMax?: number;
  prix?: number;
  prixDescription?: string;
  equipements: string[];
  inclus: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ReservationFormData {
  civilite?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays?: string;
  ville?: string;
  dateArrivee: Date;
  dateDepart: Date;
  nombreAdultes: number;
  nombreEnfants?: number;
  chambreId?: string;
  message?: string;
  demandesSpeciales?: string[];
}

export interface ContactFormData {
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  sujet: ContactSujet;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  nom?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types pour les statistiques du dashboard
export interface DashboardStats {
  totalChambres: number;
  chambresActives: number;
  totalReservations: number;
  reservationsEnAttente: number;
  reservationsConfirmees: number;
  totalContacts: number;
  contactsNonLus: number;
  totalServices: number;
  totalEvenements: number;
}

// Types pour la pagination
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Types pour les filtres
export interface ChambreFilters extends PaginationParams {
  isActive?: boolean;
  isFeatured?: boolean;
  minPrix?: number;
  maxPrix?: number;
  capaciteMin?: number;
}

export interface ServiceFilters extends PaginationParams {
  type?: ServiceType;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ReservationFilters extends PaginationParams {
  statut?: ReservationStatut;
  dateDebut?: Date;
  dateFin?: Date;
  chambreId?: string;
}

export interface ContactFilters extends PaginationParams {
  sujet?: ContactSujet;
  isRead?: boolean;
  isArchived?: boolean;
}

// Type pour les paramètres du site
export interface SiteSettingsData {
  // Informations générales
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;

  // Contact
  email: string;
  telephone: string;
  telephoneSecondaire?: string;
  adresse: string;
  ville: string;
  pays: string;
  codePostal?: string;
  coordonneesGPS?: {
    lat: number;
    lng: number;
  };

  // Réseaux sociaux
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tripadvisor?: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];

  // Horaires
  horairesReception?: string;
  horairesRestaurant?: string;
  horairesPiscine?: string;

  // Autres
  devise: string;
  langue: string;
}
