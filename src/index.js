import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// 1. Ruta raíz para que Vercel no te tire 404 al entrar al link principal
app.get("/", (req, res) => {
  res.send({ status: "ok", message: "¡El backend de TravelHub está online y funcionando!" });
});

// 2. El listen condicional: Solo corre en tu compu (local), Vercel lo ignora y lo maneja de forma serverless
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

// 3. Exportación vital para Vercel
export default app;