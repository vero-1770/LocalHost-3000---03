import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});