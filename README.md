# Nyxidiom - Gestión de Tareas
Este proyecto es una aplicación de gestión de tareas, que incluye un frontend hecho con Remix y Tailwind, un backend hecho con Node.js y una base de datos MongoDB, todo desplegado en contenedores de Docker.

## Requisitos
Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

    · Docker
    · Docker-compose

## Configuración del Proyecto
El proyecto está dividido en tres servicios principales:

    1. MongoDB: Base de datos para almacenar los datos de usuarios y tareas.
    2. Backend: Aplicación Node.js que gestiona la lógica de negocio y sirve la API.
    3. Frontend: Aplicación de cliente hecha con Remix para interactuar con el usuario.


## Estructura del Proyecto
La estructura básica del proyecto es la siguiente:
    
    /backend             # Código del backend (Node.js y Express)
    - controllers        # Controladores para usuarios y tareas
    - routes             # Rutas de la API
    - models             # Modelos de datos (Mongoose)
    - Dockerfile         # Dockerfile para construir el backend
    - .env               # Variables de entorno para el backend
    /frontend            # Código del frontend (Remix)
    - Dockerfile         # Dockerfile para construir el frontend
    - .env               # Variables de entorno para el frontend
    docker-compose.yml   # Definición de los servicios con Docker Compose


## Variables de Entorno
Antes de iniciar los contenedores, asegúrate de configurar las variables de entorno en los archivos .env tanto para el backend como para el frontend (recomendado y utilizado en el desarrollo).

    · Backend (backend/.env):

        PORT="5000"
        MONGO_URI="mongodb://mongodb:27017"

    · Frontend (frontend/.env):

        API_URL="http://backend:5000"


## Instrucciones para Levantar el Proyecto

1. Clonar el Repositorio:

    · git clone https://github.com/tu-usuario/tu-repositorio.git
    · cd tu-repositorio

2. Construir y Levantar los Servicios:

    · docker-compose up --build -d


Este comando hará lo siguiente:

    · Construirá las imágenes de Docker tanto para el frontend como para el backend.
    · Levantará los contenedores para MongoDB, el backend y el frontend.
    · El parámetro -d asegura que los contenedores se ejecuten en segundo plano.


## Verificar los Servicios
Puedes verificar que todos los contenedores están corriendo con el siguiente comando:

    · docker ps

Debes ver tres contenedores en ejecución: mongodb, backend, y frontend.

## Acceder a la Aplicación
Una vez que los contenedores estén en funcionamiento, puedes acceder a la aplicación:

    · Frontend: Visita http://localhost:3000 en tu navegador.
    · ackend API: La API está disponible en http://localhost:5000.


## Detener los Contenedores
Si necesitas detener los contenedores, puedes usar el siguiente comando:

    · docker-compose down

Este comando detendrá y eliminará todos los contenedores, redes y volúmenes definidos en docker-compose.yml.


## Comandos Útiles

· Levantar los contenedores:

    docker-compose up -d

· Levantar los contenedores y reconstruir las imágenes:

    docker-compose up --build -d

· Ver logs de los servicios:

    docker-compose logs

· Ver logs de un servicio específico (por ejemplo, el backend):

    docker-compose logs backend

· Detener los contenedores:

    docker-compose down


## Notas Adicionales
Si deseas restablecer la base de datos de MongoDB (eliminar todos los datos), puedes eliminar el volumen de Docker que almacena los datos persistentes:

    · docker volume rm tu-repositorio_mongo-data

Esto eliminará todos los datos almacenados en MongoDB, y el contenedor los recreará en su próximo inicio.
