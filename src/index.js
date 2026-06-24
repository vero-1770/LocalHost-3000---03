import "dotenv/config";
import app from "./app.js";

// Listen condicional
if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 TravelHub API en ejecución local`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===========================================`);
  });

  // Evitamos dejar puertos abiertos o conexiones colgadas en la BD al reiniciar nodemon
  process.on("SIGTERM", () => {
    console.log("Cerrando el servidor HTTP...");
    server.close(() => {
      console.log("Servidor HTTP cerrado.");
    });
  });
}

// Exportación requerida para la arquitectura Serverless de Vercel
export default app;