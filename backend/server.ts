/* (Backend entry point) – Este archivo conecta MongoDB y arranca el servidor Express */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';  // Ruta de ejemplo para las tareas

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());  // Permitir que Express procese JSON

// Rutas
app.use('', taskRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI as string)
.then(() => {
  console.log('MongoDB conectado');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
})
.catch((error) => {
  console.log('Error al conectar a MongoDB:', error);
});