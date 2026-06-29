import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import destinoRoutes from "./routes/destino.routes.js";
import userRoutes from "./routes/user.routes.js";
import accommodationRoutes from "./routes/accommodation.routes.js";
import transportationRoutes from "./routes/transportation.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import imageRoutes from "./routes/image.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Inicializo aplicación
const app = express();

// Centralizo los origenes permitidos (producción + local)
const allowedOrigins = [
  "http://localhost:5173",// LOCAL
  process.env.FRONTEND_URL// DOMINIO DE PRODUCCIÓN VERCEL
].filter(Boolean);// evitamos valores undefined

// Configuración de cors
app.use(cors({
    origin: (origin, callback) => {
      // Si la petición no tiene origen (como Postman o el Health Check)
      // o el origen está explícitamente listado, permitimos el acceso.
      if(!origin || allowedOrigins.includes(origin)){
        callback(null, true);
      }else{
        callback(new Error(`Bloqueado por CORS: El origen ${origin} no está autorizado.`));
      }
    },
    credentials: true,// permitimos el envío de Access/Refresh Cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Ruta raíz para evitar error 404
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "¡El backend de TravelHub está online y funcionando de forma serverless!",
  });
});

// Endpoint de monitoreo
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "¡TravelHub funcionando correctamente!",
  });
});

// Registros de rutas de la aplicación
app.use("/api/destinos", destinoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/transportations", transportationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);

//Manejo centralizado de errores. Debe ir SIEMPRE al final, despues de todas las rutas
app.use(errorHandler);

export default app;