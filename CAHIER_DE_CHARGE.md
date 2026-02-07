# Cahier de Charge - Akwa Luxury Lodge

## Site Web Hôtelier & Système de Gestion

**Client :** Akwa Luxury Lodge
**Localisation :** Jacqueville - Sassako-Begnini, Côte d'Ivoire
**Date :** Février 2026
**Version :** 1.0

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Site public (visiteurs)](#2-site-public-visiteurs)
3. [Espace administration](#3-espace-administration)
4. [Système de réservation](#4-système-de-réservation)
5. [Gestion des chambres](#5-gestion-des-chambres)
6. [Restauration et menu](#6-restauration-et-menu)
7. [Événements et conférences](#7-événements-et-conférences)
8. [Galerie photos](#8-galerie-photos)
9. [Newsletter et communication](#9-newsletter-et-communication)
10. [Promotions et annonces](#10-promotions-et-annonces)
11. [Témoignages clients](#11-témoignages-clients)
12. [Gestion des contacts](#12-gestion-des-contacts)
13. [Gestion des utilisateurs](#13-gestion-des-utilisateurs)
14. [Aspects techniques](#14-aspects-techniques)
15. [Hébergement et coûts](#15-hébergement-et-coûts)
16. [Sécurité](#16-sécurité)
17. [Récapitulatif des fonctionnalités](#17-récapitulatif-des-fonctionnalités)

---

## 1. Présentation du projet

### 1.1 Objectif

Concevoir et développer un site web vitrine haut de gamme pour **Akwa Luxury Lodge**, un hôtel de luxe situé à Jacqueville (Côte d'Ivoire). Le site doit :

- Mettre en valeur l'établissement et ses prestations
- Permettre aux visiteurs de faire des demandes de réservation en ligne
- Offrir un espace d'administration complet pour gérer tout le contenu du site
- Être accessible sur ordinateur, tablette et téléphone portable

### 1.2 Public cible

| Public | Besoin |
|--------|--------|
| **Touristes locaux et internationaux** | Découvrir l'hôtel, voir les chambres, réserver |
| **Organisateurs d'événements** | Voir les espaces disponibles, demander un devis |
| **Entreprises** | Réserver des salles de conférence, organiser des séminaires |
| **Le personnel de l'hôtel** | Gérer les réservations, le contenu du site, les messages |

### 1.3 Identité visuelle

| Élément | Choix |
|---------|-------|
| **Couleur principale** | Vert forêt profond (#1a3c34) |
| **Couleur secondaire** | Or/Bronze élégant (#c9a962) |
| **Couleur d'accent** | Vert émeraude (#2d5a4e) |
| **Fond** | Blanc cassé naturel (#faf9f6) |
| **Police des titres** | Playfair Display (style serif élégant) |
| **Police du texte** | Inter (sans-serif moderne et lisible) |
| **Ambiance** | Luxe, nature, sérénité, authenticité africaine |

---

## 2. Site public (visiteurs)

Le site public est la partie visible par tous les visiteurs. Il comporte les pages suivantes :

### 2.1 Page d'accueil

La vitrine principale du site, avec :

- **Bannière plein écran** : diaporama d'images qui changent automatiquement (toutes les 20 secondes), avec un ordre aléatoire à chaque visite
- **Slogan** : "Un havre de paix au bord de la mer"
- **Boutons d'action** : "Réserver maintenant" et "Découvrir nos chambres"
- **Section "Bienvenue"** : présentation de l'hôtel avec diaporama d'images
- **Services phares** : 4 cartes (Restaurant, Piscine, Plage Privée, Bar Lounge)
- **Chambres vedettes** : jusqu'à 6 chambres mises en avant avec prix et diaporama
- **Témoignages clients** : avis avec notes en étoiles
- **Section d'appel à l'action** : invitation à réserver avec boutons contact/réservation
- **Animations** : effets d'apparition au défilement pour un rendu dynamique

### 2.2 Page Hébergement

- Liste de toutes les chambres disponibles
- Pour chaque chambre : photo, nom, type, prix par nuit, capacité
- Possibilité de cliquer pour voir le détail

### 2.3 Page Détail d'une chambre

- **Galerie d'images** avec diaporama automatique (20 secondes)
- **Lightbox** : cliquer sur une image pour la voir en grand, navigation clavier (flèches + Echap)
- **Vidéo de présentation** (si disponible) : lecture automatique à l'ouverture de la page
- **Informations complètes** : description, prix (semaine et week-end), capacité, superficie, nombre de lits, vue, étage
- **Équipements** : liste des équipements de la chambre (Wi-Fi, climatisation, etc.)
- **Caractéristiques** : points forts de la chambre
- **Bouton "Réserver"** menant au formulaire de réservation

### 2.4 Page Restauration

- Présentation du restaurant de l'hôtel
- Horaires d'ouverture
- Aperçu du menu (plats, prix)
- Galerie culinaire

### 2.5 Page Activités

- Liste des activités proposées (piscine, plage, sports, bien-être, etc.)
- Pour chaque activité : description, horaires, prix (si payant)
- Indication "inclus" ou "en supplément"

### 2.6 Page Événements

- Types d'événements accueillis : Mariages, Anniversaires, Réceptions d'entreprise, Cocktails & Galas
- Espaces disponibles avec capacité : Terrasse Océan (300 pers.), Jardin des Palmiers (200 pers.), Salle Akwa (250 pers.), Plage Privée (150 pers.)
- Services inclus : décoration, traiteur, DJ, photographe, hébergement invités, coordination, voiturier
- Bouton "Demander un devis"

### 2.7 Page Conférences

- Présentation des espaces de conférence
- Équipements disponibles (vidéoprojecteur, Wi-Fi, etc.)
- Capacités et tarifs
- Formulaire de demande

### 2.8 Page Galerie

- Affichage en grille de toutes les photos de l'hôtel
- Filtrage par catégorie (chambres, restaurant, piscine, événements, etc.)
- Clic pour voir en grand format

### 2.9 Page Contact

- **Formulaire de contact** avec les champs :
  - Nom, Prénom
  - Email, Téléphone
  - Sujet (Information, Réservation, Événement, Réclamation, Partenariat, Autre)
  - Message
- **Informations pratiques** : adresse, téléphone, email, horaires
- **Carte Google Maps** interactive montrant la localisation
- Option d'inscription à la newsletter

### 2.10 Page Réservation

- **Formulaire de pré-réservation** (la confirmation se fait manuellement par l'hôtel) :
  - Nom complet
  - Email
  - Téléphone
  - Date d'arrivée et date de départ
  - Nombre de personnes (1 à 5+)
  - Type de chambre souhaité (Standard, Bungalow Vue Mer, Suite Océan Premium, Suite Royale)
  - Message / Demandes spéciales
- **Avantages affichés** : Confirmation sous 24h, Annulation gratuite 48h avant, Meilleur tarif garanti, Petit-déjeuner inclus
- **Écran de confirmation** après envoi

### 2.11 Pages légales

- **Conditions Générales de Vente (CGV)**
- **Mentions Légales**
- **Politique de Confidentialité**

---

## 3. Espace administration

L'espace administration est accessible uniquement au personnel autorisé de l'hôtel via une page de connexion sécurisée (`/admin/login`).

### 3.1 Tableau de bord (Dashboard)

La page d'accueil de l'admin affiche en un coup d'oeil :

- **Cartes statistiques** :
  - Nombre total de chambres actives
  - Nombre de réservations du mois en cours
  - Nombre de messages non lus
  - Tendance des visiteurs
- **Dernières réservations** : tableau avec nom, dates, chambre, statut
- **Derniers messages** : liste des messages de contact récents (lu/non lu)
- **Actions rapides** : boutons d'accès direct (Ajouter chambre, Gérer réservations, Répondre aux messages, Gérer galerie)

### 3.2 Menu de navigation (Sidebar)

L'administration dispose d'un menu latéral avec les sections suivantes :

| Section | Description |
|---------|-------------|
| Dashboard | Vue d'ensemble |
| Chambres | Gestion des hébergements |
| Services | Gestion des prestations |
| Menu Restaurant | Gestion de la carte |
| Événements | Gestion des événements |
| Galerie | Gestion des photos |
| Réservations | Suivi des demandes |
| Contacts | Messages reçus |
| Témoignages | Avis clients |
| Newsletter | Gestion des abonnés |
| Annonces | Bannières et annonces |
| Promotions | Offres promotionnelles |
| Utilisateurs | Comptes administrateurs |
| Paramètres | Configuration du site |

---

## 4. Système de réservation

### 4.1 Fonctionnement

Le système de réservation fonctionne en **pré-réservation** :

1. Le visiteur remplit le formulaire de réservation sur le site
2. La demande arrive dans l'espace admin avec le statut **"En attente"**
3. Le personnel de l'hôtel examine la demande
4. Il peut changer le statut : **Confirmée**, **Annulée** ou **Terminée**
5. Le personnel peut ajouter des notes internes sur chaque réservation

### 4.2 Informations collectées

Pour chaque réservation :

- Civilité (M., Mme, etc.)
- Nom et prénom
- Email et téléphone
- Pays et ville
- Dates d'arrivée et de départ
- Nombre d'adultes et d'enfants
- Chambre souhaitée
- Demandes spéciales
- Message
- Source de la réservation

### 4.3 Gestion dans l'admin

- **Tableau** listant toutes les réservations avec tri et recherche
- **Filtres** par statut (En attente, Confirmée, Annulée, Terminée) et par dates
- **Fiche détaillée** pour chaque réservation
- **Notes internes** visibles uniquement par le personnel
- **Statistiques** : total, en attente, confirmées, annulées, terminées

### 4.4 Statuts disponibles

| Statut | Signification | Couleur |
|--------|--------------|---------|
| En attente | Nouvelle demande, pas encore traitée | Jaune/Orange |
| Confirmée | Réservation acceptée par l'hôtel | Vert |
| Annulée | Réservation annulée | Rouge |
| Terminée | Séjour terminé | Gris |

---

## 5. Gestion des chambres

### 5.1 Informations par chambre

Chaque chambre dispose des informations suivantes :

| Champ | Description | Exemple |
|-------|-------------|---------|
| Nom | Nom de la chambre | "Suite Lagune Premium" |
| Type | Catégorie | Suite, Bungalow, Chambre, Villa |
| Description | Texte long de présentation | Texte détaillé |
| Description courte | Résumé pour les listes | 1-2 phrases |
| Prix par nuit | Tarif en semaine (FCFA) | 75 000 |
| Prix week-end | Tarif le week-end (FCFA) | 95 000 |
| Capacité | Nombre de personnes max | 4 |
| Superficie | En mètres carrés | 45 m² |
| Nombre de lits | Nombre total | 2 |
| Type de lit | Type de literie | King Size, Double |
| Vue | Type de vue | Mer, Jardin, Lagune |
| Étage | Niveau | Rez-de-chaussée, 1er étage |
| Équipements | Liste | Wi-Fi, Clim, TV, Minibar, etc. |
| Caractéristiques | Points forts | Balcon privé, Jacuzzi, etc. |
| Images | Photos de la chambre | Jusqu'à 10+ photos |
| Vidéo | URL de vidéo (YouTube ou fichier) | Optionnel |

### 5.2 Options de gestion

- **Créer** une nouvelle chambre avec toutes ses informations
- **Modifier** une chambre existante
- **Supprimer** une chambre
- **Activer/Désactiver** : rendre une chambre visible ou invisible sur le site
- **Mettre en vedette** : la chambre apparaît sur la page d'accueil
- **Réordonner** : changer l'ordre d'affichage par glisser-déposer
- **Gérer les images** : ajouter, supprimer, réorganiser les photos

---

## 6. Restauration et menu

### 6.1 Gestion du menu

Le menu du restaurant est organisé en **catégories** et **plats** :

**Catégories** (exemples) :
- Entrées
- Plats principaux
- Desserts
- Boissons
- Cocktails

**Pour chaque plat** :

| Champ | Description |
|-------|-------------|
| Nom | Nom du plat |
| Description | Présentation du plat |
| Prix | Tarif en FCFA |
| Image | Photo du plat |
| Allergènes | Liste (gluten, lactose, etc.) |
| Végétarien | Oui/Non |
| Végan | Oui/Non |
| Épicé | Oui/Non |
| Actif | Visible ou masqué |
| Ordre | Position dans la catégorie |

### 6.2 Fonctionnalités

- Créer, modifier, supprimer des catégories et des plats
- Réordonner les catégories et les plats
- Activer/désactiver un plat (ex : plat en rupture)
- Indiquer les régimes alimentaires et allergènes

---

## 7. Événements et conférences

### 7.1 Types d'événements gérés

| Type | Description |
|------|-------------|
| Événement | Événement général |
| Conférence | Conférence ou séminaire professionnel |
| Mariage | Cérémonie et réception de mariage |
| Séminaire | Séminaire d'entreprise |
| Team Building | Activité de cohésion d'équipe |
| Réception | Réception privée ou cocktail |

### 7.2 Informations par événement

- Titre et description
- Type d'événement
- Date et heure de début/fin
- Lieu dans l'hôtel
- Capacité minimum et maximum
- Prix
- Équipements disponibles (vidéoprojecteur, micro, etc.)
- Services inclus (traiteur, décoration, etc.)
- Images de l'événement

### 7.3 Gestion dans l'admin

- Créer, modifier, supprimer des événements
- Activer/désactiver
- Mettre en vedette sur le site
- Ajouter des photos

---

## 8. Galerie photos

### 8.1 Organisation

Les images sont organisées par **catégories** :
- Accueil (images de la page d'accueil)
- Chambres
- Restaurant
- Piscine
- Plage
- Événements
- Espaces communs
- Extérieurs
- Autres

### 8.2 Informations par image

| Champ | Description |
|-------|-------------|
| Image | Fichier uploadé |
| Titre | Nom de l'image |
| Description | Texte alternatif |
| Catégorie | Classement par thème |
| En vedette | Apparaît en priorité |
| Ordre | Position d'affichage |
| Lien | Associée à une chambre, service ou événement |

### 8.3 Fonctionnalités

- **Upload** d'images (glisser-déposer ou sélection de fichiers)
- **Vérification** des images : outil pour détecter les images avec des URL invalides
- **Nettoyage** : suppression en lot des images invalides
- **Édition** : modifier le titre, la description, la catégorie
- **Suppression** individuelle ou par sélection

---

## 9. Newsletter et communication

### 9.1 Inscription newsletter

Un formulaire d'inscription à la newsletter est disponible dans le **pied de page** de toutes les pages du site :

| Champ | Description |
|-------|-------------|
| Email | Adresse email du visiteur (obligatoire) |
| Nom | Nom du visiteur (optionnel) |

### 9.2 Gestion des abonnés (admin)

L'administrateur dispose d'une page dédiée pour gérer les abonnés :

- **Liste des abonnés** avec recherche et filtres
- **Activer / désactiver** un abonné
- **Supprimer** un ou plusieurs abonnés
- **Exporter en CSV** la liste des emails (pour utilisation dans un outil d'emailing externe comme Mailchimp, Brevo, etc.)
- **Statistiques** : total abonnés, actifs, inactifs

> **Note** : Le système collecte les emails. L'envoi de campagnes se fait via un outil externe (Mailchimp, Brevo, etc.) en important le fichier CSV exporté.

### 9.3 Notifications multi-canaux

Lorsqu'un visiteur soumet un formulaire (réservation, contact, newsletter), **tous les administrateurs actifs** sont notifiés automatiquement via deux canaux :

#### Email (SMTP)
- Envoi via **Nodemailer** avec configuration SMTP (variables d'environnement)
- Templates HTML stylisés avec récapitulatif des données et lien vers l'admin
- Gratuit avec tout fournisseur SMTP (Gmail, OVH, etc.)

#### WhatsApp (GREEN-API)
- Envoi via **GREEN-API**, plan Developer 100% gratuit (jusqu'à 3 contacts)
- Configuration : créer un compte sur https://console.green-api.com, scanner un QR code avec WhatsApp
- Les numéros des destinataires sont gérés depuis les profils admin (`/admin/utilisateurs`)
- Messages formatés avec emojis et récapitulatif des données
- Aucune action requise de la part des destinataires

| Formulaire | Email | WhatsApp |
|------------|-------|----------|
| Réservation | Récapitulatif complet (nom, dates, personnes) | Message résumé avec emojis |
| Contact | Sujet + message + coordonnées | Message résumé avec emojis |
| Newsletter | Email de l'abonné | Message résumé avec emojis |

> **Note** : Les notifications sont envoyées en arrière-plan (fire-and-forget) pour ne pas bloquer la réponse au visiteur. Si un canal n'est pas configuré, il est silencieusement ignoré.

---

## 10. Promotions et annonces

### 10.1 Système de promotions

Permet de créer des offres commerciales :

| Type de promotion | Exemple |
|-------------------|---------|
| Pourcentage | -20% sur toutes les suites |
| Montant fixe | 10 000 FCFA de réduction |
| Offre spéciale | 3ème nuit offerte |
| Pack | Chambre + Dîner + Spa |

**Pour chaque promotion** :
- Nom et description
- Type et valeur de la réduction
- Cible : tous, chambres, restauration, activités, bien-être, piscine, événements
- Code promo (optionnel) avec vérification d'unicité
- Dates de début et fin
- Conditions d'utilisation
- Montant minimum d'achat
- Nombre maximum d'utilisations (total et par client)
- Suivi du nombre d'utilisations en temps réel

### 10.2 Système d'annonces

Permet d'afficher des bannières et messages sur le site :

**Types de média** :
- Texte seul
- Image
- Vidéo courte (3 à 5 secondes)

**Positionnement** :
- Page d'accueil
- Page hébergement
- Page restauration
- Page activités
- Page événements
- Toutes les pages
- Popup
- Bannière

**Fonctionnalités** :
- Programmation par dates (début/fin)
- Ciblage par section du site
- Couleurs personnalisables (fond et texte)
- Lien cliquable avec texte de bouton personnalisé
- Épingler en haut
- Lier à une promotion existante
- Dupliquer une annonce existante
- Statistiques : total, actives, expirées, par type de média

---

## 11. Témoignages clients

### 11.1 Informations collectées

| Champ | Description |
|-------|-------------|
| Nom | Nom du client |
| Pays | Pays d'origine |
| Photo | Photo du client (optionnel) |
| Note | De 1 à 5 étoiles |
| Texte | Avis du client |
| Date de visite | Quand le client est venu |

### 11.2 Modération

Les témoignages passent par un processus de validation :

1. Un nouveau témoignage est ajouté (par l'admin)
2. Il peut être **approuvé** ou **rejeté**
3. Seuls les témoignages approuvés ET actifs apparaissent sur le site
4. L'ordre d'affichage est personnalisable

---

## 12. Gestion des contacts

### 12.1 Réception des messages

Quand un visiteur envoie un message via le formulaire de contact :
- Le message apparaît dans la boîte de réception de l'admin
- Il est marqué comme **"Non lu"**
- Le sujet est catégorisé automatiquement

### 12.2 Fonctionnalités

- **Boîte de réception** avec indicateur lu/non lu
- **Marquer comme lu** / non lu
- **Archiver** un message
- **Répondre** : saisir une réponse (enregistrée avec date)
- **Supprimer** un message
- **Compteur** de messages non lus visible dans la sidebar
- **Recherche** et filtrage

### 12.3 Sujets disponibles

| Sujet | Description |
|-------|-------------|
| Information | Demande d'information générale |
| Réservation | Question sur une réservation |
| Événement | Demande pour un événement |
| Réclamation | Plainte ou problème |
| Partenariat | Proposition de partenariat |
| Autre | Autre sujet |

---

## 13. Gestion des utilisateurs

### 13.1 Rôles

| Rôle | Droits |
|------|--------|
| **Administrateur** | Accès complet à toutes les fonctionnalités |
| **Éditeur** | Accès limité (gestion de contenu) |

### 13.2 Fonctionnalités

- **Créer** un nouveau compte utilisateur (email + mot de passe)
- **Modifier** les informations d'un utilisateur
- **Changer le rôle** (Administrateur ou Éditeur)
- **Désactiver** un compte (l'utilisateur ne peut plus se connecter)
- **Changer le mot de passe**
- **Supprimer** un compte
- Les mots de passe sont chiffrés (non lisibles en base de données)
- Mot de passe minimum : 8 caractères

---

## 14. Aspects techniques

### 14.1 Technologies utilisées

| Technologie | Rôle | Pourquoi ce choix |
|-------------|------|-------------------|
| **Next.js 16** | Framework web | Rapide, SEO optimisé, rendu côté serveur |
| **React 19** | Interface utilisateur | Composants réutilisables, interactivité |
| **TypeScript** | Langage | Détection d'erreurs, code plus fiable |
| **Tailwind CSS** | Style/Design | Design responsive, rapide à développer |
| **PostgreSQL** | Base de données | Fiable, performant, gratuit |
| **Prisma** | Accès base de données | Simple, typé, migrations automatiques |
| **NextAuth** | Authentification | Sécurisé, standard du marché |
| **Uploadthing** | Upload d'images | Simple, gratuit jusqu'à 2 GB |
| **Framer Motion** | Animations | Animations fluides et élégantes |
| **Zod** | Validation | Validation des formulaires côté client et serveur |

### 14.2 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **Appareils** : Ordinateur, tablette, téléphone portable
- **Design responsive** : le site s'adapte automatiquement à toutes les tailles d'écran

### 14.3 Performance

- Images optimisées automatiquement (redimensionnement, compression)
- Chargement paresseux des images (lazy loading)
- Rendu côté serveur pour un chargement rapide
- Cache intelligent pour les pages statiques
- Recherche indexée en base de données

### 14.4 SEO (Référencement)

- URL propres et lisibles (ex : `/hebergement/suite-lagune-premium`)
- Balises meta dynamiques par page
- Textes alternatifs sur toutes les images
- Structure de données pour moteurs de recherche

---

## 15. Hébergement et coûts

### 15.1 Services d'hébergement

| Service | Fournisseur | Plan | Coût mensuel |
|---------|------------|------|-------------|
| **Hébergement du site** | Vercel | Hobby (gratuit) ou Pro | 0 $ ou 20 $/mois |
| **Base de données** | Neon (PostgreSQL) | Free | 0 $/mois |
| **Stockage images** | Uploadthing | Free (2 GB) | 0 $/mois |
| **Nom de domaine** | Namecheap / GoDaddy | - | ~10-15 $/an |

### 15.2 Estimation des coûts

**Scénario 1 : Trafic faible à moyen** (< 1 000 visiteurs/jour)

| Poste | Coût/mois |
|-------|-----------|
| Vercel (Hobby) | 0 $ |
| Neon (Free) | 0 $ |
| Uploadthing (Free, 2 GB) | 0 $ |
| Nom de domaine | ~1 $ |
| **TOTAL** | **~1 $/mois** |

> **Attention** : Le plan Hobby de Vercel est réservé à un usage **non commercial**. Si le site génère des revenus (réservations en ligne), il faut passer au plan Pro.

**Scénario 2 : Usage commercial / trafic en croissance**

| Poste | Coût/mois |
|-------|-----------|
| Vercel (Pro) | 20 $ |
| Neon (Launch, 10 GB) | 19 $ |
| Uploadthing (Pro, 100 GB) | 10 $ |
| Nom de domaine | ~1 $ |
| **TOTAL** | **~50 $/mois** (~30 000 FCFA) |

### 15.3 Certificat SSL (HTTPS)

- **Coût : Gratuit**
- Vercel fournit automatiquement un certificat SSL via Let's Encrypt
- Le HTTPS est activé par défaut sur tous les déploiements
- Le certificat se renouvelle automatiquement
- Aucune configuration manuelle nécessaire

### 15.4 Mise en ligne

Les étapes pour mettre le site en ligne :

1. Acheter un nom de domaine (ex : `akwaluxurylodge.com`)
2. Connecter le projet à Vercel
3. Ajouter le domaine dans les paramètres Vercel
4. Configurer les DNS chez le registrar de domaine
5. Le SSL se configure automatiquement
6. Le site est en ligne !

---

## 16. Sécurité

### 16.1 Mesures de sécurité

| Mesure | Description |
|--------|-------------|
| **Authentification** | Connexion sécurisée par email/mot de passe |
| **Mots de passe chiffrés** | Hashage bcrypt (impossible de lire les mots de passe) |
| **Sessions JWT** | Jetons signés pour les sessions admin |
| **HTTPS obligatoire** | Toutes les communications sont chiffrées |
| **Validation des données** | Tous les formulaires sont validés côté client ET serveur |
| **Protection des routes** | Les pages admin sont inaccessibles sans connexion |
| **Vérification du compte** | Un compte désactivé ne peut pas se connecter |

### 16.2 Protection des données

- Les données personnelles (emails, téléphones) sont stockées de manière sécurisée en base de données
- Les mots de passe ne sont jamais stockés en clair
- Conformité RGPD avec politique de confidentialité

---

## 17. Récapitulatif des fonctionnalités

### Site public (visiteurs)

| Fonctionnalité | Statut |
|----------------|--------|
| Page d'accueil avec diaporama et animations | Fait |
| Page hébergement (liste des chambres) | Fait |
| Détail chambre avec galerie, vidéo et lightbox | Fait |
| Page restauration avec menu | Fait |
| Page activités | Fait |
| Page événements avec espaces et capacités | Fait |
| Page conférences | Fait |
| Galerie photos avec filtres par catégorie | Fait |
| Formulaire de réservation (pré-réservation) | Fait |
| Formulaire de contact avec sujets | Fait |
| Inscription newsletter | Fait |
| Pages légales (CGV, mentions, confidentialité) | Fait |
| Design responsive (mobile, tablette, PC) | Fait |
| Animations au défilement | Fait |
| Carte Google Maps | Fait |

### Espace administration

| Fonctionnalité | Statut |
|----------------|--------|
| Tableau de bord avec statistiques | Fait |
| Gestion des chambres (créer, modifier, supprimer) | Fait |
| Gestion des services et activités | Fait |
| Gestion du menu restaurant (catégories + plats) | Fait |
| Gestion des événements et conférences | Fait |
| Gestion de la galerie photos | Fait |
| Gestion des réservations (statuts, notes) | Fait |
| Gestion des messages de contact | Fait |
| Gestion des témoignages (modération) | Fait |
| Gestion de la newsletter (export CSV) | Fait |
| Système d'annonces (texte, image, vidéo) | Fait |
| Système de promotions (codes promo, réductions) | Fait |
| Gestion des utilisateurs (rôles admin/éditeur) | Fait |
| Paramètres du site | Fait |
| Upload d'images (glisser-déposer) | Fait |
| Connexion sécurisée | Fait |

---

## Validation

Ce cahier de charge décrit l'ensemble des fonctionnalités du site web **Akwa Luxury Lodge**. Le client est invité à :

- [ ] Valider les fonctionnalités décrites
- [ ] Signaler les fonctionnalités manquantes ou à modifier
- [ ] Confirmer l'identité visuelle (couleurs, polices)
- [ ] Fournir le contenu textuel définitif (descriptions, tarifs, horaires)
- [ ] Fournir les photos et vidéos de l'hôtel
- [ ] Choisir le nom de domaine souhaité
- [ ] Valider le budget d'hébergement

**Signature du client :**

Nom : ___________________________

Date : ___________________________

Signature : ___________________________

---

**Signature du prestataire :**

Nom : ___________________________

Date : ___________________________

Signature : ___________________________
