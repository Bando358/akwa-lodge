import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Début du seeding...");

  // Créer l'admin par défaut
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@akwalodge.com" },
    update: {},
    create: {
      email: "admin@akwalodge.com",
      name: "Administrateur",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin créé:", admin.email);

  // Créer quelques chambres de démonstration
  const chambres = [
    {
      nom: "Suite Lagune Premium",
      slug: "suite-lagune-premium",
      description: `Plongez dans le luxe absolu avec notre Suite Lagune Premium. Cette suite spacieuse de 55m² offre une vue imprenable sur la lagune de Jacqueville. Décorée avec raffinement, elle allie élégance contemporaine et touches africaines authentiques.

Profitez d'une terrasse privée pour admirer les couchers de soleil spectaculaires, d'un lit king-size avec literie haut de gamme, et d'une salle de bain en marbre avec baignoire et douche à l'italienne.

Le coin salon vous permettra de vous détendre tout en contemplant le paysage aquatique. Un minibar garni, une machine à café Nespresso et un service de room service 24h/24 sont à votre disposition.`,
      descriptionCourte:
        "Suite spacieuse de 55m² avec vue imprenable sur la lagune, terrasse privée et décoration raffinée.",
      prix: 150000,
      prixWeekend: 175000,
      capacite: 2,
      superficie: 55,
      nombreLits: 1,
      typeLit: "King Size",
      vue: "Lagune",
      etage: 1,
      equipements: [
        "Climatisation",
        "WiFi gratuit",
        "TV écran plat 55\"",
        "Minibar",
        "Coffre-fort",
        "Machine Nespresso",
        "Sèche-cheveux",
        "Peignoirs",
        "Chaussons",
      ],
      caracteristiques: [
        "Terrasse privée",
        "Vue sur la lagune",
        "Service en chambre 24h/24",
        "Petit-déjeuner inclus",
      ],
      isActive: true,
      isFeatured: true,
      ordre: 1,
    },
    {
      nom: "Bungalow Vue Mer",
      slug: "bungalow-vue-mer",
      description: `Découvrez l'authenticité africaine dans notre Bungalow Vue Mer. Cette structure traditionnelle revisitée offre 40m² de confort moderne dans un écrin de nature.

Le bungalow dispose d'une grande baie vitrée donnant sur un jardin tropical et la mer au loin. L'intérieur mêle matériaux naturels (bois, raphia, tissus locaux) et équipements contemporains.

Idéal pour les couples en quête d'intimité et de dépaysement, ce bungalow vous promet des nuits paisibles bercées par le chant des oiseaux et le murmure des vagues.`,
      descriptionCourte:
        "Bungalow traditionnel de 40m² alliant confort moderne et authenticité africaine avec vue sur la mer.",
      prix: 95000,
      prixWeekend: 110000,
      capacite: 2,
      superficie: 40,
      nombreLits: 1,
      typeLit: "Queen Size",
      vue: "Jardin et mer",
      equipements: [
        "Climatisation",
        "WiFi gratuit",
        "TV écran plat",
        "Minibar",
        "Coffre-fort",
        "Ventilateur de plafond",
      ],
      caracteristiques: [
        "Architecture traditionnelle",
        "Jardin privé",
        "Accès direct plage",
      ],
      isActive: true,
      isFeatured: true,
      ordre: 2,
    },
    {
      nom: "Suite Royale",
      slug: "suite-royale",
      description: `Notre Suite Royale représente le summum du luxe à Akwa Luxury Lodge. Avec ses 85m², elle offre un espace de vie exceptionnel comprenant une chambre majestueuse, un salon privé et une terrasse panoramique.

Point d'orgue de cette suite : un jacuzzi privé sur la terrasse avec vue à 180° sur la lagune. La décoration marie influences africaines et design contemporain dans une harmonie parfaite.

Le service personnalisé inclut un majordome dédié, le petit-déjeuner servi en chambre à l'heure de votre choix, et un accès exclusif au spa.`,
      descriptionCourte:
        "Suite d'exception de 85m² avec jacuzzi privé, terrasse panoramique et service personnalisé.",
      prix: 250000,
      prixWeekend: 300000,
      capacite: 4,
      superficie: 85,
      nombreLits: 2,
      typeLit: "King Size + canapé-lit",
      vue: "Lagune panoramique",
      etage: 2,
      equipements: [
        "Climatisation",
        "WiFi gratuit",
        "TV écran plat 65\"",
        "Minibar premium",
        "Coffre-fort",
        "Machine Nespresso",
        "Système audio Bose",
        "Jacuzzi privé",
      ],
      caracteristiques: [
        "Jacuzzi privé",
        "Terrasse panoramique",
        "Majordome dédié",
        "Accès spa inclus",
        "Petit-déjeuner en chambre",
      ],
      isActive: true,
      isFeatured: true,
      ordre: 0,
    },
    {
      nom: "Chambre Confort",
      slug: "chambre-confort",
      description: `Notre Chambre Confort offre tout le nécessaire pour un séjour agréable à un tarif accessible. Avec ses 28m², elle dispose d'un lit double confortable et d'une salle de bain moderne.

Décorée dans des tons apaisants, cette chambre donne sur le jardin tropical de l'établissement. Elle convient parfaitement aux voyageurs souhaitant profiter des installations de l'hôtel tout en maîtrisant leur budget.`,
      descriptionCourte:
        "Chambre de 28m² fonctionnelle et confortable avec vue jardin, idéale pour les voyageurs.",
      prix: 65000,
      prixWeekend: 75000,
      capacite: 2,
      superficie: 28,
      nombreLits: 1,
      typeLit: "Double",
      vue: "Jardin",
      equipements: [
        "Climatisation",
        "WiFi gratuit",
        "TV écran plat",
        "Coffre-fort",
        "Sèche-cheveux",
      ],
      caracteristiques: ["Vue jardin", "Accès piscine"],
      isActive: true,
      isFeatured: false,
      ordre: 3,
    },
  ];

  for (const chambre of chambres) {
    await prisma.chambre.upsert({
      where: { slug: chambre.slug },
      update: chambre,
      create: chambre,
    });
  }

  console.log("✅ Chambres créées:", chambres.length);

  // Créer quelques services
  const services = [
    {
      nom: "Restaurant Le Palmier",
      slug: "restaurant-le-palmier",
      description: `Notre restaurant gastronomique Le Palmier vous invite à un voyage culinaire unique. Notre chef met à l'honneur les produits locaux et les saveurs ivoiriennes, revisités avec une touche contemporaine.

Dans un cadre élégant avec vue sur la lagune, savourez nos spécialités de poissons et fruits de mer frais, nos viandes grillées et nos desserts maison.

Notre carte des vins propose une sélection de crus français et africains pour accompagner parfaitement vos repas.`,
      descriptionCourte:
        "Restaurant gastronomique alliant saveurs locales et cuisine contemporaine avec vue sur la lagune.",
      type: "RESTAURATION" as const,
      icone: "utensils",
      horaires: "Petit-déjeuner: 7h-10h | Déjeuner: 12h-15h | Dîner: 19h-22h",
      isActive: true,
      isFeatured: true,
      ordre: 0,
    },
    {
      nom: "Piscine Infinity",
      slug: "piscine-infinity",
      description: `Notre piscine à débordement offre une expérience unique de baignade avec une vue imprenable sur la lagune. Longue de 25 mètres, elle est idéale pour nager ou simplement se détendre.

Des transats et parasols sont à votre disposition autour du bassin. Notre bar de plage vous propose cocktails, jus de fruits frais et snacks tout au long de la journée.`,
      descriptionCourte:
        "Piscine à débordement de 25m avec vue sur la lagune et bar de plage.",
      type: "PISCINE" as const,
      icone: "waves",
      horaires: "7h - 20h",
      isActive: true,
      isFeatured: true,
      ordre: 1,
    },
    {
      nom: "Spa & Bien-être",
      slug: "spa-bien-etre",
      description: `Notre spa vous accueille dans un havre de paix pour des moments de détente absolue. Nos praticiens qualifiés vous proposent une gamme complète de soins du visage et du corps.

Découvrez nos massages traditionnels africains, nos soins aux produits naturels locaux (karité, cacao, café) et nos rituels de beauté.

Le spa dispose également d'un hammam et d'une salle de relaxation.`,
      descriptionCourte:
        "Spa proposant massages, soins du visage et du corps avec produits naturels locaux.",
      type: "BIEN_ETRE" as const,
      icone: "sparkles",
      horaires: "9h - 20h (sur réservation)",
      isActive: true,
      isFeatured: true,
      ordre: 2,
    },
    {
      nom: "Excursions en pirogue",
      slug: "excursions-pirogue",
      description: `Partez à la découverte de la lagune de Jacqueville à bord de nos pirogues traditionnelles. Nos guides locaux vous feront découvrir la faune et la flore exceptionnelles de la région.

Plusieurs formules disponibles : balade d'1h, demi-journée avec pique-nique, ou journée complète avec visite de villages de pêcheurs.`,
      descriptionCourte:
        "Découverte de la lagune en pirogue traditionnelle avec guide local.",
      type: "ACTIVITE" as const,
      icone: "ship",
      prix: 25000,
      prixDescription: "par personne",
      duree: "1h à journée complète",
      isActive: true,
      isFeatured: false,
      ordre: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log("✅ Services créés:", services.length);

  // Créer quelques témoignages
  const temoignages = [
    {
      nom: "Marie-Claire Konan",
      pays: "Côte d'Ivoire",
      note: 5,
      texte:
        "Un séjour inoubliable ! Le cadre est magnifique, le personnel aux petits soins. La suite lagune était parfaite avec sa terrasse donnant sur l'eau. Je recommande vivement pour une escapade romantique.",
      isApproved: true,
      isActive: true,
      ordre: 0,
    },
    {
      nom: "Jean-Pierre Dubois",
      pays: "France",
      note: 5,
      texte:
        "Nous avons célébré notre anniversaire de mariage à Akwa Lodge. Un moment magique dans un endroit paradisiaque. Le restaurant est excellent et le service irréprochable. Merci à toute l'équipe !",
      isApproved: true,
      isActive: true,
      ordre: 1,
    },
    {
      nom: "Amadou Diallo",
      pays: "Sénégal",
      note: 5,
      texte:
        "Parfait pour les affaires comme pour le repos. J'ai organisé un séminaire pour mon entreprise et tout était parfait. Les salles de conférence sont bien équipées et le cadre inspire la créativité.",
      isApproved: true,
      isActive: true,
      ordre: 2,
    },
  ];

  for (const temoignage of temoignages) {
    await prisma.temoignage.create({
      data: temoignage,
    });
  }

  console.log("✅ Témoignages créés:", temoignages.length);

  // Créer les paramètres du site
  const siteSettings = [
    {
      key: "site_name",
      value: "Akwa Luxury Lodge",
      type: "text",
      groupe: "general",
      label: "Nom du site",
    },
    {
      key: "site_description",
      value:
        "Hôtel de luxe situé en bordure de lagune à Jacqueville, Côte d'Ivoire",
      type: "text",
      groupe: "general",
      label: "Description du site",
    },
    {
      key: "email",
      value: "contact@akwalodge.com",
      type: "text",
      groupe: "contact",
      label: "Email de contact",
    },
    {
      key: "telephone",
      value: "+225 07 00 00 00 00",
      type: "text",
      groupe: "contact",
      label: "Téléphone principal",
    },
    {
      key: "adresse",
      value: "Jacqueville, Côte d'Ivoire",
      type: "text",
      groupe: "contact",
      label: "Adresse",
    },
    {
      key: "facebook",
      value: "https://facebook.com/akwalodge",
      type: "text",
      groupe: "social",
      label: "Facebook",
    },
    {
      key: "instagram",
      value: "https://instagram.com/akwalodge",
      type: "text",
      groupe: "social",
      label: "Instagram",
    },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log("✅ Paramètres du site créés:", siteSettings.length);

  console.log("🎉 Seeding terminé avec succès !");
  console.log("");
  console.log("📧 Identifiants admin:");
  console.log("   Email: admin@akwalodge.com");
  console.log("   Mot de passe: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
