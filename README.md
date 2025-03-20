# Backend - Equi·Parents

## 📌 Descripción
Este es el backend del sistema **Equi·Parents**, desarrollado en **Node.js con Express** y utilizando **Prisma** como ORM para la base de datos.

## 🚀 Instalación y Ejecución
### 1️⃣ Instalar dependencias
```
cd equiparents-backend
npm install
```

### 2️⃣ Configurar variables de entorno
Crea un archivo `.env` en la raíz del backend y define las variables necesarias:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/equiparents
JWT_SECRET=clave_secreta
PORT=4000
```

### 3️⃣ Ejecutar Prisma Migrate y Seed
```
npx prisma migrate dev
npx prisma db seed
```

### 4️⃣ Ejecutar el servidor
```
npm run dev
```

## 📂 Estructura del Backend
```
📂 src/
 ├── 📂 api/
 │   ├── 📂 auth/
 │   ├── 📂 users/
 │   ├── 📂 children/
 │   ├── 📂 parentalAccounts/
 │   ├── 📂 roles/
 ├── 📂 middleware/
 ├── 📂 config/
 ├── 📂 utils/
 ├── server.js
```

---
