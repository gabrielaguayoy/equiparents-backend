# Backend - Equi·Parents

## 📌 Descripción
Este es el backend de Equi·Parents, construido con Node.js y Express.

## 🚀 Instalación y Configuración

1️⃣ **Instalar dependencias**

```bash
cd equiparents-backend
npm install
```

2️⃣ **Configurar variables de entorno**

Crea un archivo `.env` con lo siguiente:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/equiparents
JWT_SECRET=clave_secreta
PORT=4000
```

3️⃣ **Inicializar la base de datos**

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4️⃣ **Ejecutar el servidor**

```bash
npm run dev
```

## 📂 Estructura del Backend
```
📂 api/
  📂 auth/
    📜 authController.js
    📜 authRoutes.js
    📜 authService.js
  📂 children/
    📜 childController.js
    📜 childRoutes.js
    📜 childService.js
  📂 config/
    📜 database.js
    📜 envConfig.js
  📂 middleware/
    📜 authenticate.js
    📜 validateRequest.js
  📂 parentalAccounts/
    📜 inviteController.js
    📜 inviteRoutes.js
    📜 inviteService.js
    📜 parentalController.js
    📜 parentalRoutes.js
    📜 parentalService.js
  📂 roles/
    📜 roleController.js
    📜 roleRoutes.js
    📜 roleService.js
  📂 users/
    📜 userController.js
    📜 userRoutes.js
    📜 userService.js
  📂 utils/
    📜 authUtils.js
    📜 emailService.js
    📜 errorHandler.js

```

## 🛠️ Configuración en VS Code
- Abrir **VS Code**
- Ir a **File > Open Workspace**
- Seleccionar `equiparents.code-workspace`

## 🛠️ Flujo de Git
1️⃣ **Clonar los repositorios**

```bash
git clone https://github.com/gabrielaguayoy/equiparents-backend.git
git clone https://github.com/gabrielaguayoy/equiparents-frontend.git
```

2️⃣ **Crear una nueva rama**

```bash
git checkout -b feature/nueva-funcionalidad
```

3️⃣ **Confirmar cambios**

```bash
git add .
git commit -m "Agregada nueva funcionalidad"
```

4️⃣ **Subir cambios a GitHub**

```bash
git push origin feature/nueva-funcionalidad
```
