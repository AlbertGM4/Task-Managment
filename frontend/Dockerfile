# Etapa 1: Construcción de la aplicación Remix
FROM node:18-alpine AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias de producción y desarrollo
RUN npm install --frozen-lockfile

# Copia el resto del código de la aplicación Remix
COPY . .

# Construye la aplicación Remix
RUN npm run build

# Etapa 2: Ejecutar la aplicación con Node.js
FROM node:18-alpine AS runner

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo las dependencias necesarias para producción
COPY package*.json ./
RUN npm install --production --frozen-lockfile

# Copia los archivos de la etapa de construcción
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/vite.config.ts /app/vite.config.ts

# Expone el puerto 3000 para que Remix sirva la aplicación
EXPOSE 3000

# Comando por defecto para iniciar el servidor de Remix
CMD ["npm", "run", "start"]
