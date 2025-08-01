# Brive TODO

Una aplicación web moderna de gestión de tareas construida con React y TypeScript, que ofrece una interfaz intuitiva para organizar proyectos y tareas.

## 🚀 Instalación Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) o [pnpm](https://pnpm.io/) o [bun](https://bun.sh/)

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd todo
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```
s
3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y configura la URL de tu API backend:
   ```env
   VITE_APP_API=http://localhost:3000/
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

5. **Abre tu navegador**
   
   Ve a [http://localhost:5173](http://localhost:5173) para ver la aplicación.

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción de producción

## 🛠️ Tecnologías Utilizadas

### Framework y Librerías Core
- **[React 19](https://react.dev/)** - Biblioteca de JavaScript para construir interfaces de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Vite](https://vitejs.dev/)** - Herramienta de construcción rápida

### Enrutamiento y Estado
- **[TanStack Router](https://tanstack.com/router)** - Enrutamiento moderno para React con code-splitting automático
- **[TanStack Query](https://tanstack.com/query)** - Gestión de estado del servidor y cache

### UI y Estilos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitario
- **[ShadCN](https://ui.shadcn.com/)** - Componentes primitivos accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos SVG modulares

### Formularios y Validación
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios performante
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript

### Utilidades
- **[Axios](https://axios-http.com/)** - Cliente HTTP para comunicación con API
- **[Date-fns](https://date-fns.org/)** - Biblioteca de utilidades para fechas
- **[Chrono-node](https://github.com/wanasit/chrono)** - Parser de fechas en lenguaje natural
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones toast elegantes
- **[React Day Picker](https://react-day-picker.js.org/)** - Selector de fechas

### Herramientas de Desarrollo
- **[Biome](https://biomejs.dev/)** - Linter y formateador rápido

## 🏗️ Arquitectura

### Patrón de Componentes
- **Componentes UI**: Componentes base construidos sobre Radix UI
- **Componentes de Característica**: Componentes específicos de la aplicación
- **Layouts**: Estructuras de página y navegación

### Gestión de Estado
- **Estado del Servidor**: TanStack Query para cache y sincronización
- **Estado Local**: Zustand para estado global de la aplicación
- **Estado de Formularios**: React Hook Form para formularios

### Enrutamiento
- **File-based Routing**: Basado en la estructura de archivos en `/routes`
- **Code Splitting**: Carga lazy automática de componentes
- **Type-safe**: Rutas completamente tipadas con TypeScript

## 🔧 Configuración del Backend

Esta aplicación frontend requiere un backend que implemente las siguientes endpoints:

- **Auth**: `/auth/login`, `/auth/register`
- **Tasks**: `/tasks` (CRUD operations)
- **Projects**: `/projects` (CRUD operations)

Asegúrate de que tu API backend esté ejecutándose en la URL configurada en `VITE_APP_API`.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
