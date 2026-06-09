import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool as NeonPool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// Detectamos si estamos en un entorno con Neon (usando la variable DATABASE_URL de Neon)
const isNeon = process.env.DATABASE_URL?.includes('neon.tech');

let adapter;

if (isNeon) {
  // Configuración para Neon
  const neonPool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  adapter = new PrismaNeon(neonPool);
} else {
  // Configuración para Docker - Local
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  adapter = new PrismaPg(pool);
}

export const prisma = new PrismaClient({ adapter });