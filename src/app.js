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

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.VITE_API_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
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