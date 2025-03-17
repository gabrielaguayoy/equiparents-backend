EquiParents - Backend

Este es el backend de EquiParents, desarrollado con Node.js, Express.js y Prisma ORM, utilizando PostgreSQL como base de datos.

🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente:

🟢 Node.js (versión 18 o superior)

🟢 PostgreSQL

🟢 Git

🟢 Visual Studio Code

🟢 Un cliente de API como Postman o Insomnia

📥 Instalación

1️⃣ Clonar el repositorio

git clone git@github.com:gabrielaguayoy/equiparents-backend.git
cd equiparents-backend

2️⃣ Instalar dependencias

npm install

3️⃣ Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto y copia lo siguiente:

DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/equiparents"
PORT=5000
JWT_SECRET="tu_secreto_super_seguro"

4️⃣ Configurar la base de datos con Prisma

npx prisma migrate dev --name init
npx prisma generate

5️⃣ Iniciar el servidor en localhost

npm run dev

6️⃣ Probar API con Postman o navegador

Verificar que el servidor está corriendo en: http://localhost:5000

🖥 Uso en Visual Studio Code

Abre VS Code y selecciona File > Open Folder y elige equiparents-backend

Abre una terminal integrada con:

Ctrl + ñ (Windows/Linux)

Cmd + ñ (Mac)

Ejecuta npm run dev para iniciar el servidor en localhost

Usa Thunder Client en VS Code o Postman para probar las rutas de la API.

📂 Estructura del Proyecto

equiparents-backend/
│── src/
│ ├── api/ # Rutas de la API
│ ├── controllers/ # Controladores de lógica de negocio
│ ├── middleware/ # Middleware de autenticación, validación, etc.
│ ├── lib/ # Configuración de Prisma
│ ├── server.js # Servidor Express
│── prisma/
│ ├── schema.prisma # Esquema de base de datos
│── .env # Variables de entorno
│── package.json
│── README.md
