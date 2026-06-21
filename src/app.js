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

// Configuramos un solo CORS que sirva pa' todo el mundo
app.use(cors({
    origin: [
      "http://localhost:5173", // Tu React de Vite (¡Imprescindible aquí!)
      "http://localhost:3000",
      process.env.FRONTEND_URL  // Tu URL de producción cuando lo montes
    ].filter(Boolean), // Esto limpia si alguna variable viene undefined
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "¡TravelHub funcionando correctamente!",
  });
});

// Tus rutas quedan igualito...
app.use("/api/destinos", destinoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/transportations", transportationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;