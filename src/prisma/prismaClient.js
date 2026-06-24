import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR CRÍTICO: No se encontró la variable DATABASE_URL.");
  process.exit(1);
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { prisma };