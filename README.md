# 🍔 UCEats - UCE Bar Automation System

**UCEats** is a Full Stack web application designed to modernize and manage the bars and cafeterias at the Universidad Central del Ecuador (UCE). It allows administrators to manage product inventory (food, drinks, snacks) through an intuitive interface with real image upload support.

---

## 🚀 Tech Stack

This project uses a microservices-based architecture containerized with **Docker**.

### 💻 Frontend (Client)
Built with **React + Vite** for a fast and reactive user experience.
* **React 18:** Main UI library.
* **React Hook Form:** Efficient form handling and validation.
* **Axios:** HTTP client for server communication (FormData support).
* **React Icons:** Vector icons package.
* **CSS Modules / Inline:** Custom styling with CSS variables.

### 🛠️ Backend (Server)
RESTful API built on **Node.js**.
* **Express.js:** Minimalist and robust web framework.
* **Mongoose:** ODM for data modeling in MongoDB.
* **Multer:** Middleware for handling file uploads (images).
* **Cors:** Cross-origin access management.
* **Morgan:** HTTP request logger for development.
* **Dotenv:** Environment variable management.

### 🗄️ Database
* **MongoDB:** NoSQL document-oriented database (data persistence).

### 🐳 DevOps & Infrastructure
* **Docker:** Service containerization.
* **Docker Compose:** Container orchestration (Frontend, Backend, DB).

---

## ✨ Current Features (MVP)

### Product Management (Full CRUD + Images)
1.  **Create:** Modal form to add new products with **image upload support (JPG/PNG)**.
2.  **Read:** Real-time product visualization with server-side image rendering.
3.  **Update:** Edit existing products (Name, Price, Category, and Image).
4.  **Delete:** Secure product deletion with confirmation.
5.  **Auto-Refresh:** Interface updates instantly after any change without reloading the page.

---

## ⚙️ Installation & Setup

To run this project locally, you need **Docker Desktop** installed.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd uceats
    ```

2.  **Start services:**
    ```bash
    docker compose up --build
    ```

3.  **Access the application:**
    * **Frontend:** `http://localhost:5173`
    * **Backend API:** `http://localhost:3000`
    * **Database:** Port `27017`

---

## 🔜 Roadmap
* [x] Real image upload implementation (Multer).
* [ ] Authentication System (Login/Register with JWT).
* [ ] Client View (Read-only Public Menu).
* [ ] Shopping Cart.

---
**Developed by:** [Your Name] - Information Systems Engineering Student.

--------
ESPANISH

# 🍔 UCEats - Sistema de Automatización de Bares UCE

**UCEats** es una aplicación web Full Stack diseñada para modernizar y gestionar los bares y comedores de la Universidad Central del Ecuador (UCE). Permite a los administradores gestionar el inventario de productos (comidas, bebidas, snacks) mediante una interfaz intuitiva, con soporte para subida de imágenes reales.

---

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza una arquitectura basada en microservicios contenerizados con **Docker**.

### 💻 Frontend (Cliente)
Construido con **React + Vite** para una experiencia de usuario rápida y reactiva.
* **React 18:** Librería principal de UI.
* **React Hook Form:** Manejo eficiente y validación de formularios.
* **Axios:** Cliente HTTP para comunicación con el servidor (soporte FormData).
* **React Icons:** Paquete de íconos vectoriales.
* **CSS Modules / Inline:** Estilos personalizados con variables CSS.

### 🛠️ Backend (Servidor)
API RESTful construida sobre **Node.js**.
* **Express.js:** Framework web minimalista y robusto.
* **Mongoose:** ODM para modelado de datos en MongoDB.
* **Multer:** Middleware para manejo y subida de archivos (imágenes).
* **Cors:** Gestión de permisos de acceso cruzado.
* **Morgan:** Logger de peticiones HTTP para desarrollo.
* **Dotenv:** Gestión de variables de entorno.

### 🗄️ Base de Datos
* **MongoDB:** Base de datos NoSQL orientada a documentos (persistencia de datos).

### 🐳 DevOps & Infraestructura
* **Docker:** Contenerización de servicios.
* **Docker Compose:** Orquestación de los contenedores (Frontend, Backend, DB).

---

## ✨ Funcionalidades Actuales (MVP)

### Gestión de Productos (CRUD Completo + Imágenes)
1.  **Crear:** Formulario modal para ingresar nuevos productos con **soporte para subida de imágenes (JPG/PNG)**.
2.  **Leer:** Visualización de productos en tiempo real con renderizado de imágenes desde el servidor.
3.  **Actualizar:** Edición de productos existentes (Nombre, Precio, Categoría e Imagen).
4.  **Eliminar:** Borrado seguro de productos con confirmación.
5.  **Refresco Automático:** La interfaz se actualiza instantáneamente tras cualquier cambio sin recargar la página.

---

## ⚙️ Instalación y Ejecución

Para correr este proyecto localmente, necesitas tener instalado **Docker Desktop**.

1.  **Clonar el repositorio:**
    ```bash
    git clone <tu-repositorio-url>
    cd uceats
    ```

2.  **Iniciar los servicios:**
    ```bash
    docker compose up --build
    ```

3.  **Acceder a la aplicación:**
    * **Frontend:** `http://localhost:5173`
    * **Backend API:** `http://localhost:3000`
    * **Base de Datos:** Puerto `27017`

---

## 🔜 Próximos Pasos (Roadmap)
* [x] Implementación de subida de imágenes reales (Multer).
* [ ] Sistema de Autenticación (Login/Register con JWT).
* [ ] Vista de Cliente (Menú público solo lectura).
* [ ] Carrito de compras.

---
**Desarrollado por:** [Tu Nombre] - Estudiante de Ingeniería en Sistemas de Información.

---