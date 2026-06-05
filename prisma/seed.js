import "dotenv/config";

// Importo instancia nativa y configurada de la app
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({adapter});

// Importo API
import apiDestinos from "./destinos.json" with { type: "json" };

// Guardaremos los destinos creados en un array para poder referenciarlos en las interacciones
const destinosCreadosdeBase = [];

async function main() {
  console.log("🌱 Iniciando inyección de datos...");

  // LIMPIEZA TOTAL DE LAS TABLAS (En orden inverso de Foreign Keys)
  console.log("🧹 Vaciando tablas...");
  await prisma.vote.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.image.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();
  await prisma.transportation.deleteMany();
  console.log("✨ Tablas limpias.");

  // TABLA: USER
  console.log("👤 Creando usuarios...");
  const usuarios = await Promise.all([
    prisma.user.create({
      data: {
        username: "gabriel_britos",
        email: "gabriel@travelhub.com",
        // Clave: uncoma2026
        passwordHash: "$2a$10$O6XI0H4zfp7e.ZRXjbu8AutZTwq7nqOvQQlDaLs99T5rzjdDRTejK",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel"
      }
    }),
    prisma.user.create({
      data: {
        username: "paula_dev",
        email: "paula@travelhub.com",
        // Clave: paula123
        passwordHash: "$2a$10$L6pgTppBxVhnXHg4ad04u.HCt7pxr4OgdF75N3X9l64pPTxjceJyy",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=paula"
      }
    }),
    prisma.user.create({
      data: {
        username: "tester_uncoma",
        email: "tester@fi.uncoma.edu.ar",
        // Clave: testHashLocal2026
        passwordHash: "$2a$10$iVb6dF.it1r5d1fkS22oY.xNBpUpu8kwooouw1ES8msUhZQgj1nYu",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tester"
      }
    })
  ]);

  // TABLA: TRANSPORTATION
  console.log("🚌 Insertando transportes...");
  const mapaTransportes = {};
  const listaTransportes = [
    { type: "avión", provider: "Aerolíneas Argentinas" },
    { type: "bus", provider: "Empresa KOKO" },
    { type: "auto", provider: "Localiza Rent-A-Car" },
    { type: "barco", provider: "Ferry Caribe Express" },
    { type: "crucero", provider: "Royal Caribbean International" },
    { type: "tren", provider: "Inca Rail" },
    { type: "ferry", provider: "Naviera Austral" },
    { type: "sendero", provider: "Trekking Guiado" },
    { type: "lancha", provider: "Taxi Marítimo Local" }
  ];

  for (const t of listaTransportes) {
    const tCreado = await prisma.transportation.create({
      data: { type: t.type, provider: t.provider }
    });
    // Normalizamos la clave del mapa a minúsculas para evitar desajustes con el JSON
    mapaTransportes[t.type.toLowerCase()] = tCreado.id;
  }

  // TABLAS: DESTINATION, IMAGE y ACCOMMODATION
  console.log("🗺️ Insertando los destinos con imágenes y alojamientos...");
  
  for (const dest of apiDestinos) {
    const nombreLimpioRuta = dest.nombre.replace(/\s+/g, "");

    // Mapeo seguro ignorando espacios y variaciones de mayúsculas
    const IDsTransportesAConectar = (dest.accesibilidad || [])
      .map(tipo => mapaTransportes[tipo.trim().toLowerCase()])
      .filter(id => id !== undefined);

    const ratingCalculado = dest.cantidadVotos > 0 
      ? parseFloat((dest.puntuacionTotal / dest.cantidadVotos).toFixed(1)) 
      : 0;

    const nuevoDestino = await prisma.destination.create({
      data: {
        name: dest.nombre,
        description: dest.descripcion,
        location: dest.ubicacion,
        country: dest.pais,
        budget: dest.presupuesto,
        rating: ratingCalculado,
        totalScore: dest.puntuacionTotal,
        votesCount: dest.cantidadVotos,
        
        // TABLA: IMAGE
        images: {
          create: [
            { url: `/images/${nombreLimpioRuta}1.jpg` },
            { url: `/images/${nombreLimpioRuta}2.jpg` },
            { url: `/images/${nombreLimpioRuta}3.jpg` }
          ]
        },

        // TABLA: ACCOMMODATION
        accommodations: {
          create: (dest.alojamiento || []).map(aloj => ({
            name: aloj.nombre,
            location: aloj.ubicacion,
            description: aloj.reseña,
            pricePerNight: aloj.presupuesto,
            type: aloj.tipo,
            // IMPORTANTE: Tu modelo debe aceptar Int? (nullable) para stars
            stars: aloj.tipo === "Hotel" ? 4 : null 
          }))
        },

        // Relación implícita M:N hacia TRANSPORTATION
        transportations: {
          connect: IDsTransportesAConectar.map(id => ({ id }))
        }
      }
    });

    destinosCreadosdeBase.push(nuevoDestino);
  }

  // TABLAS: FAVORITE Y VOTE (Interacciones cruzadas)
  console.log("❤️ Vinculando interacciones de favoritos y votaciones...");

  // Búsquedas seguras por nombre y país para evitar el bug de "San Juan"
  const bariloche = destinosCreadosdeBase.find(d => d.name === "Bariloche");
  const sanMartin = destinosCreadosdeBase.find(d => d.name === "San Martín de los Andes");
  const losRoques = destinosCreadosdeBase.find(d => d.name === "Los Roques");

  // Simulación: Gabriel
  if (bariloche && sanMartin) {
    await prisma.favorite.create({ data: { userId: usuarios[0].id, destinationId: bariloche.id } });
    await prisma.favorite.create({ data: { userId: usuarios[0].id, destinationId: sanMartin.id } });

    await prisma.vote.create({ data: { userId: usuarios[0].id, destinationId: bariloche.id, score: 5.0 } });
    await prisma.vote.create({ data: { userId: usuarios[0].id, destinationId: sanMartin.id, score: 4.8 } });
  }

  // Simulación: Paula
  if (losRoques && bariloche) {
    await prisma.favorite.create({ data: { userId: usuarios[1].id, destinationId: losRoques.id } });
    await prisma.favorite.create({ data: { userId: usuarios[1].id, destinationId: bariloche.id } });

    await prisma.vote.create({ data: { userId: usuarios[1].id, destinationId: losRoques.id, score: 5.0 } });
    await prisma.vote.create({ data: { userId: usuarios[1].id, destinationId: bariloche.id, score: 4.5 } });
  }

  // Simulación: Tester
  if (bariloche && losRoques) {
    await prisma.vote.create({ data: { userId: usuarios[2].id, destinationId: bariloche.id, score: 3.5 } });
    await prisma.vote.create({ data: { userId: usuarios[2].id, destinationId: losRoques.id, score: 4.0 } });
  }

  console.log("🏁 ¡Base de datos local poblada de manera 100% íntegra!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante la inserción del seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });