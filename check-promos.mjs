import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();
  console.log('Date actuelle:', now.toISOString());

  console.log('\n=== Toutes les promotions ===');
  const all = await prisma.promotion.findMany({
    select: {
      id: true, nom: true, cible: true, type: true, valeur: true,
      isActive: true, dateDebut: true, dateFin: true, chambreId: true, codePromo: true
    }
  });

  console.log('Total:', all.length);
  all.forEach(p => {
    console.log(`  - ${p.nom} | cible: ${p.cible} | type: ${p.type} | valeur: ${p.valeur} | active: ${p.isActive} | debut: ${p.dateDebut.toISOString()} | fin: ${p.dateFin.toISOString()} | chambreId: ${p.chambreId || 'null'}`);
  });

  const active = all.filter(p => p.isActive && p.dateDebut <= now && p.dateFin >= now);
  console.log('\n=== Promotions actives maintenant ===');
  console.log('Total actives:', active.length);
  active.forEach(p => {
    console.log(`  - ${p.nom} | cible: ${p.cible} | type: ${p.type} | valeur: ${p.valeur}`);
  });

  if (active.length === 0) {
    console.log('\n>>> AUCUNE PROMOTION ACTIVE ! C\'est pourquoi rien ne s\'affiche sur le site.');
    if (all.length > 0) {
      console.log('>>> Des promotions existent mais ne sont pas actives (isActive=false ou hors dates).');
    } else {
      console.log('>>> Aucune promotion en base de donnees. Creez-en une depuis l\'admin.');
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
