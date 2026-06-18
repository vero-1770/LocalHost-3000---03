import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// 1. Ruta raíz (Para que Vercel no te tire 404 al entrar al link principal)
app.get("/", (req, res) => {
  res.send({ status: "ok", message: "¡El backend de TravelHub está online y funcionando!" });
});

// 2. Tu ruta de health check original
app.get("/api/health", (req, res) => {
  res.send({ status: "ok", message: "API funcionando correctamente" });
});

// 3. Tus rutas de items
app.use("/api/items", itemRoutes);

// 4. app.listen condicional: Solo corre en tu local, Vercel lo ignora.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
  });
}

// 5. La exportación vital para que el entorno Serverless funcione
export default app;