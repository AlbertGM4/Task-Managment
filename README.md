# Nyxidiom - Backend
Este es el backend del proyecto Nyxidiom, desarrollado en Node.js usando Express y TypeScript. Se conecta a una base de datos MongoDB y expone endpoints para gestionar tareas y usuarios.

## Requisitos
Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

    · Node.js (versión 16 o superior)
    · MongoDB (si no usas Docker para la base de datos)
    · Docker (si decides contenerizar la base de datos o el backend)
    · Git (para clonar el repositorio)

## Variables de Entorno
Debes crear un archivo .env en la carpeta backend con las siguientes variables de entorno:

    MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<database>
    PORT=5000

    · MONGO_URI: La URI de conexión a tu base de datos MongoDB.
    · PORT: El puerto en el que el backend va a estar corriendo (por defecto 5000).


## Instalación y Ejecución Local
1. Clona el repositorio:

    · git clone <url-del-repositorio>
    · cd backend

2. Instala las dependencias de Node.js:

    · npm install

3. Compila el proyecto TypeScript:

    · npm run build

4. Ejecuta el proyecto:

    · npm start

El servidor backend debería estar corriendo en http://localhost:5000.


## Usar MongoDB con Docker (opcional)
Si prefieres ejecutar MongoDB en un contenedor Docker, sigue estos pasos:

1. Asegúrate de tener Docker instalado.

2. Crea un archivo docker-compose.yml en la raíz del proyecto (ya debe estar creado si sigues la estructura recomendada).

3. Ejecuta el siguiente comando para levantar MongoDB en Docker:

    · docker-compose up -d mongo

    Esto iniciará un contenedor con una instancia de MongoDB corriendo en el puerto 27017 por defecto.

4. Actualiza tu archivo .env con la conexión a la base de datos MongoDB que corre en Docker:

    · MONGO_URI=mongodb://localhost:27017/<database_name>

5. Sigue los pasos anteriores para ejecutar el backend (npm install, npm run build, npm start).


## Dockerización del Backend (opcional)
Si quieres ejecutar el backend en Docker, debes tener un Dockerfile en la carpeta backend. Aquí tienes las instrucciones para contenerizar y ejecutar el backend:

1. Construye la imagen de Docker:

    · docker build -t nyxidiom-backend .

2. Ejecuta el contenedor:

    · docker run -p 5000:5000 --env-file .env nyxidiom-backend

El servidor estará disponible en http://localhost:5000.


## Comandos Útiles
· Instalar dependencias: npm install
· Compilar TypeScript: npm run build
· Ejecutar en modo desarrollo: npm run dev
· Ejecutar en producción: npm start

## Rutas de la API
Las siguientes son las rutas expuestas por el backend:

    · GET /api/tasks: Obtiene todas las tareas.
    · POST /api/tasks: Crea una nueva tarea.
    · PUT /api/tasks/:id: Actualiza una tarea por su ID.
    · DELETE /api/tasks/:id: Elimina una tarea por su ID.


## Notas Finales
Asegúrate de tener tu base de datos MongoDB corriendo antes de ejecutar el backend.
Puedes optar por ejecutar MongoDB en un contenedor Docker o conectarte a una instancia local o remota.
Si necesitas modificar el backend, recuerda compilar los archivos de TypeScript antes de ejecutar el servidor.

