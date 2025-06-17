# Plataforma de Microlearning Empresarial

## Descripción del Proyecto
## Descripción general

**Plataforma de Microlearning Empresarial** es una solución innovadora diseñada para capacitar empleados mediante sesiones breves y dinámicas. La plataforma incluye evaluaciones exprés, un sistema de recompensas y herramientas de gestión para administradores e instructores. Está desarrollada con tecnologías modernas como React, Node.js y MongoDB, siguiendo una arquitectura cliente-servidor desacoplada.
Esta plataforma permite gestionar capacitaciones breves para empleados. Incluye un sistema de evaluaciones y recompensas, así como paneles diferenciados según el rol de cada usuario.

## Características Principales
## Características principales

### Para Empleados (Usuarios Finales)
- **Usuarios**: inscripción a capacitaciones, seguimiento de progreso y obtención de insignias.
- **Capacitadores**: creación y administración de cursos y evaluaciones.
- **Administradores**: gestión global de usuarios y capacitaciones.

- 📚 Acceso a cursos y microlecciones.
- 🏆 Sistema de badges y recompensas por progreso.
- 📊 Visualización de historial de cursos completados.
- 🔍 Sugerencias de cursos basadas en intereses.
## Tecnologías

### Para Instructores
- **Frontend**: React + Vite, TypeScript y Tailwind CSS.
- **Backend**: Node.js, Express y MongoDB.
- **Autenticación**: JSON Web Tokens (JWT) y bcrypt.

- ✏️ Creación, edición y eliminación de cursos.
- 📝 Subida de evaluaciones con preguntas y respuestas.
- 📈 Monitoreo de resultados y feedback de usuarios.
## Estructura del repositorio

### Para Administradores
```
plataforma-microlearning/
├── backend/   # API Express y modelos de MongoDB
└── frontend/  # Aplicación React + Vite
```

- 👥 Gestión de usuarios y asignación de roles.
- 📉 Dashboard con métricas de uso y actividad.
- 🏅 Supervisión de recompensas y categorías de cursos.
## Configuración de entorno

## Tecnologías Utilizadas
En la carpeta `backend` crear un archivo `.env` con las siguientes variables:

### Frontend
```
MONGO_URI=<cadena de conexión de MongoDB>
JWT_SECRET=<secreto para firmar JWT>
PORT=5000 # opcional
```

- **React.js** con **Vite** y **TypeScript** para una interfaz dinámica y robusta.
- **Tailwind CSS** para estilos eficientes y responsivos.
- **shadcn/ui** y **Aceternity UI** para componentes visuales atractivos.
La aplicación frontend no requiere variables de entorno, aunque los servicios usan la URL `http://localhost:5000` para la API. Modifica esa dirección en `frontend/src/services/*.ts` si el backend se aloja en otra ubicación.

### Backend
## Instalación

- **Node.js** con **Express** para la lógica del servidor.
- **MongoDB** como base de datos NoSQL flexible y escalable.
- **JWT** y **bcrypt** para autenticación segura.
Ejecutar los siguientes comandos en cada carpeta (`backend` y `frontend`):

### Despliegue
```bash
npm install     # o pnpm install
```

- **Vercel** para el frontend.
- **Render** para el backend y la base de datos.
## Ejecución en desarrollo

## Autores
En `backend`:

```bash
npm run dev
```

En `frontend`:

```bash
npm run dev
```

## Construcción para producción

```bash
npm run build
```

Opcionalmente se pueden desplegar los proyectos: el frontend en **Vercel** y el backend en **Render** o cualquier plataforma compatible con Node.js.

## Roles y navegación

- **Admin**: acceso a `/admin` y páginas para gestionar usuarios y cursos.
- **Capacitador**: acceso a `/capacitador` y vistas de cursos propios.
- **Usuario**: acceso a `/usuario`, lista de capacitaciones y evaluaciones.

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

- **Patricio Benavides** - **Backend/API**
- **Nelson Neculhueque** - **Frontend Cliente**
- **Juan Manuel Sepúlveda** - **Frontend Admin**
