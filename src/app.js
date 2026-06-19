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

const app = express();

// Middleware manual para forzar CORS en Vercel antes de cualquier ruta
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Si es una petición de preflight (OPTIONS), respondemos inmediatamente con 200 OK
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Abajo de esto dejas el cors estándar y el resto de tus rutas como estaban...
app.use(cors({
    // Agregamos el localhost de Vite directamente en la lista de permitidos
    origin: [
      process.env.FRONTEND_URL, 
      process.env.VITE_API_URL,
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "¡TravelHub funcionando correctamente!",
  });
});

app.use("/api/destinos", destinoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/transportations", transportationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);

//Debe ir SIEMPRE al final, despues de todas las rutas
app.use(errorHandler);

export default app;