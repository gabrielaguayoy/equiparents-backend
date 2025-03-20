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
│ ├── api/ # 📌 Módulos de la API organizados por dominio
│ │ ├── users/ # 📌 Gestión de usuarios
│ │ │ ├── userRoutes.js # 📌 Rutas de usuarios
│ │ │ ├── userController.js # 📌 Controlador de usuarios
│ │ │ ├── userService.js # 📌 Lógica de negocio para usuarios
│ │ ├── auth/ # 📌 Autenticación
│ │ │ ├── authRoutes.js # 📌 Rutas de autenticación
│ │ │ ├── authController.js # 📌 Controlador de autenticación
│ │ │ ├── authService.js # 📌 Lógica de autenticación
│ │ ├── parentalAccounts/ # 📌 Gestión de cuentas parentales
│ │ │ ├── parentalRoutes.js # 📌 Rutas de cuentas parentales
│ │ │ ├── parentalController.js # 📌 Controlador de cuentas parentales
│ │ │ ├── parentalService.js # 📌 Lógica de cuentas parentales
│ │ │ ├── inviteRoutes.js # 📌 Rutas de invitaciones de padres
│ │ │ ├── inviteController.js # 📌 Controlador de invitaciones
│ │ │ ├── inviteService.js # 📌 Lógica de invitaciones
│ │ ├── children/ # 📌 Gestión de hijos
│ │ │ ├── childRoutes.js # 📌 Rutas de hijos
│ │ │ ├── childController.js # 📌 Controlador de hijos
│ │ │ ├── childService.js # 📌 Lógica de hijos
│ │ ├── roles/ # 📌 Gestión de roles
│ │ │ ├── roleRoutes.js # 📌 Rutas de roles
│ │ │ ├── roleController.js # 📌 Controlador de roles
│ │ │ ├── roleService.js # 📌 Lógica de roles
│ │ ├── notifications/ # 📌 Notificaciones
│ │ │ ├── notificationRoutes.js # 📌 Rutas de notificaciones
│ │ │ ├── notificationController.js # 📌 Controlador de notificaciones
│ │ │ ├── notificationService.js # 📌 Lógica de notificaciones
│ │ ├── payments/ # 📌 Pagos e integración con Webpay
│ │ │ ├── paymentRoutes.js # 📌 Rutas de pagos
│ │ │ ├── paymentController.js # 📌 Controlador de pagos
│ │ │ ├── paymentService.js # 📌 Lógica de pagos
│ ├── middleware/ # 📌 Middlewares
│ │ ├── authenticate.js # 📌 Middleware de autenticación JWT
│ │ ├── validateRequest.js # 📌 Middleware para validaciones de datos
│ ├── config/ # 📌 Configuración del backend
│ │ ├── database.js # 📌 Configuración de Prisma y conexión a PostgreSQL
│ │ ├── envConfig.js # 📌 Carga de variables de entorno
│ ├── utils/ # 📌 Utilidades globales
│ │ ├── errorHandler.js # 📌 Manejo global de errores
│ │ ├── emailService.js # 📌 Servicio de envío de correos (SendGrid)
│ │ ├── authUtils.js # 📌 Funciones auxiliares de autenticación
│ ├── server.js # 📌 Configuración principal del servidor Express
│── prisma/ # 📌 Configuración y migraciones de la base de datos
│ ├── migrations/ # 📌 Carpeta de migraciones de Prisma
│ ├── schema.prisma # 📌 Esquema de la base de datos en Prisma
│ ├── seeds.js # 📌 Script para poblar datos iniciales (roles, admin, etc.)
│── .env # 📌 Variables de entorno (🔒 No debe subirse al repo)
│── .gitignore # 📌 Archivos y carpetas a ignorar en Git
│── package.json # 📌 Configuración de dependencias de Node.js
│── README.md # 📌 Documentación del backend
