import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';

// Detectamos si estamos en un entorno con Neon (usando la variable DATABASE_URL de Neon)
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const isNeon = process.env.DATABASE_URL?.includes('neon.tech');

let adapter;

if (isNeon) {
  // Configuración para Neon
  adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
} else {
  // Configuración para Docker - Local
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  adapter = new PrismaPg(pool);
}

export const prisma = new PrismaClient({ adapter });