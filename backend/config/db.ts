/* lógica de conexión a la base de datos. */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const connectDB = async () => {
    try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;