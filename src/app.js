import express from "express";
import cors from "cors";
import destinoRoutes from "./routes/destino.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
  });
});

app.use("/api/destinos", destinoRoutes);

//Debe ir SIEMPRE al final, despues de todas las rutas
app.use(errorHandler);

export default app;