import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Configuramos el adaptador
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

// Instanciamos el cliente
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}