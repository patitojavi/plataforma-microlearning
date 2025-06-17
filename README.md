# Plataforma de Microlearning Empresarial - **SKILL BITS**

## 🧠 Descripción General

**SKILL BITS** es una plataforma de microlearning empresarial que busca modernizar la capacitación de empleados mediante sesiones breves, dinámicas y accesibles. Incluye evaluaciones rápidas, un sistema de recompensas (badges) y herramientas de gestión para instructores y administradores.

Desarrollada con una arquitectura cliente-servidor desacoplada utilizando tecnologías modernas como **React**, **Node.js** y **MongoDB**, permite una experiencia fluida y escalable.

---

## 🚀 Características Principales

### 👩‍💼 Para Usuarios (Empleados)
- Inscripción a capacitaciones.
- Seguimiento de progreso y logros.
- Obtención de insignias por participación.
- Sugerencias de cursos según intereses.
- Historial de cursos completados.

### 🎓 Para Capacitadores
- Creación, edición y eliminación de cursos.
- Subida de evaluaciones con preguntas/respuestas.
- Monitoreo de resultados y feedback de usuarios.

### 🛠️ Para Administradores
- Gestión global de usuarios y asignación de roles.
- Supervisión de capacitaciones y recompensas.
- Dashboard con métricas de uso y actividad.

---

## 🧰 Tecnologías Utilizadas
### Frontend
- **React.js** + **Vite** + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** y **Aceternity UI** para componentes UI

### Backend
- **Node.js** + **Express**
- **MongoDB**
- **Autenticación**: JSON Web Tokens (JWT) y bcrypt

---
## 📁 Estructura del Repositorio
```
plataforma-microlearning/
├── backend/   # API Express y modelos de MongoDB
└── frontend/  # Aplicación React + Vite
```
## ⚙️ Configuración de Entorno
### Backend
Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
MONGO_URI=<cadena de conexión a MongoDB>
JWT_SECRET=<secreto para firmar los JWT>
PORT=5000  # (opcional)
```
### Frontend
```
No requiere variables de entorno por defecto. La URL base de la API es http://localhost:5000. Puedes modificarla en los archivos frontend/src/services/*.ts si alojas el backend en otro lugar.
```

---
## 🛠️ Instalación y Ejecución
En ambas carpetas (frontend y backend), ejecutar:
```
npm install  # o pnpm install
```
### Modo Desarrollo
Backend
```
npm run dev
```
Frontend
```
npm run dev
```
Construcción para Producción
```
npm run build
```
---

## ☁️ Despliegue

- **Vercel** para el frontend.
- **Render** para el backend y la base de datos.

---

## Roles y navegación

- **Admin**: acceso a `/admin` y páginas para gestionar usuarios y cursos.
- **Capacitador**: acceso a `/capacitador` y vistas de cursos propios.
- **Usuario**: acceso a `/usuario`, lista de capacitaciones y evaluaciones.


---

## Principales rutas de la API

- **Autenticación**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- **Usuarios**
  - `GET /api/usuarios` (solo admin)
  - `GET /api/usuarios/:id` (solo admin)
  - `PUT /api/usuarios/:id` y `DELETE /api/usuarios/:id` (solo admin)
- **Capacitaciones**
  - `POST /api/capacitaciones` (admin/capacitador)
  - `GET /api/capacitaciones`
  - `POST /api/capacitaciones/:id/unirse`
- **Evaluaciones**
  - `POST /api/evaluaciones` (admin/capacitador)
  - `POST /api/evaluaciones/responder`

---
## 👨‍💻 Autores


- **Patricio Benavides** - **Backend/API**
- **Nelson Neculhueque** - **Frontend Cliente**
- **Juan Manuel Sepúlveda** - **Frontend Admin**
