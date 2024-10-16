# Usa una imagen base de Node.js
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY ./package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compilar el código TypeScript a JavaScript
RUN npx tsc

# Etapa 2: Ejecutar la aplicación
FROM node:18-alpine

WORKDIR /app

# Copiar solo las dependencias necesarias para producción
COPY ./package*.json ./
RUN npm install --production

# Copiar el código JavaScript compilado desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto que usará tu aplicación backend
EXPOSE 5000

# Ejecutar el backend
CMD ["node", "dist/server.js"]
