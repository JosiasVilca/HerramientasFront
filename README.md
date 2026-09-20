
---

# 🎨 Frontend — NexoraStore

Aplicación web SPA/SSR construida con **Next.js + TypeScript + Tailwind CSS** para el sistema **[SwiftLogix]**.

Interfaz de usuario para el personal autorizado que consume la API REST del backend.

---

## 🌐 Demostración en Vivo

El proyecto se encuentra actualmente desplegado y disponible en el siguiente enlace:

* 🔗 **URL del proyecto:** [https://herramientas-front-d9oe.vercel.app/]

> ⚠️ **Nota de seguridad / Credenciales de prueba:**
> * **Correo:** admin@swiftlogix.com
> * **Contraseña:** Admin123
> 
> 

---

## 🏢 ¿Qué es este sistema?

Este proyecto es la **capa de presentación (frontend)** del sistema **[NexoraStore]**, compuesto por los siguientes repositorios:

| Repositorio | Rol | Deploy |
| --- | --- | --- |
| Herramientas-Backend | API REST (Spring Boot) | Render,Supabase y Cloudinary |
| HerramientasFront | Interfaz Web (Next.js) | Vercel |

**NexoraStore** es una plataforma **[privada / empresarial]** diseñada para **[describir brevemente el propósito principal, ej: optimizar el seguimiento de envíos, gestión de inventarios y logística interna]**.

---

## 🎯 Objetivo

Proporcionar una interfaz ágil, intuitiva y responsive para que el personal pueda gestionar **envíos, ventas, clientes** de forma centralizada, resolviendo los siguientes problemas:

* ⏱️ **Retrasos en el seguimiento de paquetes en tiempo real.**
* 🔔 **Falta de visibilidad de estados de entrega.**
* 🗂️ **Procesos manuales y errores en el registro de datos.**

---

## 👥 Roles y Vistas por Rol

| Rol | Vistas Principales |
| --- | --- |
| Administrador | Dashboard admin, Gestión de Paquetes, Reportes |
| Cliente / Usuario | Compras, Editar Perfil, Consulta de Estado, Historial |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| --- | --- |
| **Framework** | Next.js (React) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS |
| **Componentes UI** | Shadcn/UI |
| **Deploy** | Vercel |

---

## 📂 Estructura del Proyecto

```
HerramientasFront/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── (store)/
│   ├── admin/
│   ├── profile/
│   ├── tracking/
│   ├── tracking-detail/
│   ├── tracking-list/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── packages/
│   ├── store/
│   ├── tracking/
│   ├── tracking-detail/
│   ├── tracking-list/
│   └── ui/
├── context/
│   └── auth-context.tsx
├── data/
│   └── products.ts
├── lib/
│   ├── api-client.ts
│   ├── use-combined-products.ts
│   └── utils.ts
├── public/
│   ├── banner.jpg
│   ├── fondo.jpg
│   ├── logotipo.png
│   └── promo.jpg
├── services/
│   ├── auth.service.ts
│   ├── package.service.ts
│   └── tracking.service.ts
├── types/
│   ├── auth.ts
│   ├── package.ts
│   └── tracking.ts
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

```

---

## 🚀 Plan de Lanzamientos (Release Plan)

| Release | Sprints incluidos | Contenido |
| --- | --- | --- |
| **Release 1** | Sprint 1 | Autenticación, dashboard base y módulo principal |
| **Release 2** | Sprint 2 | Módulo de operaciones avanzadas / reportes |
| **Release 3** | Sprint 3 | Integración final y cierre de proyecto |

---

## 💻 Desarrollo Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### Requisitos previos

* Node.js 18.x o superior
* npm / pnpm / yarn
* Backend corriendo en http://localhost:3000

### 1. Clonar el repositorio

```bash
git clone https://github.com/JosiasVilca/HerramientasFront.git
cd HerramientasFront

```

### 2. Instalar dependencias

```bash
npm install

```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto guiándote del ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:[8080/api]

```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev

```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Ejecutar Tests / Linters

```bash
# Ejecutar para la construcción y verificación del front
pnpm build

# Ejecutar en local
pnpm dev

```

---

## ☁️ Despliegue en Vercel

El proyecto cuenta con despliegue continuo (CI/CD) conectado a **Vercel**.

1. Cada push a la rama `main` despliega automáticamente una actualización en producción.
2. Las variables de entorno de producción están configuradas directamente en el panel de control de Vercel.

---

## 🔗 Repositorios Relacionados

* **Backend:** [https://github.com/Zogurf/Herramientas-Backend](https://github.com/Zogurf/Herramientas-Backend)
* **Frontend (este repo):** [https://github.com/JosiasVilca/HerramientasFront](https://github.com/JosiasVilca/HerramientasFront.git?)

---