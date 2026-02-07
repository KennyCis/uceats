# UCEats - University Bar Automation System

**UCEats** is a comprehensive Full Stack web application engineered to modernize the management and service delivery of bars and cafeterias at the Universidad Central del Ecuador (UCE). It facilitates inventory management, order processing, and payment integration through a secure, role-based interface.

The system bridges the gap between kitchen staff and students using real-time communication protocols and secure authentication standards.

---

## Technical Architecture

The project utilizes a Jamstack approach with a microservices-oriented structure, containerized for consistent deployment.

### Frontend (Client)
* **Framework:** React 18 + Vite (SPA Architecture).
* **State Management:** Context API (Auth and Cart modules).
* **Networking:** Axios for REST API consumption.
* **Real-time Communication:** Socket.io Client for live order updates.
* **Authentication:** Google OAuth 2.0 (@react-oauth/google) and internal JWT handling.
* **Payment Integration:** Stripe.js for secure credit card processing.
* **UI/UX:** CSS Modules and Responsive Design principles.

### Backend (Server)
* **Runtime:** Node.js.
* **Framework:** Express.js.
* **Database Modeling:** Mongoose (ODM).
* **Authentication:** * JSON Web Tokens (JWT) for session management.
    * Google Auth Library for identity verification.
* **Real-time Server:** Socket.io for bi-directional event emission (Kitchen <-> Client).
* **API Documentation:** Swagger UI (OpenAPI Specification).
* **File Handling:** Multer for local image storage.
* **Security:** CORS, Bcrypt for password hashing, and input validation.

### Database
* **System:** MongoDB (NoSQL Document Store).
* **Collections:** Users, Products, Orders.

### Infrastructure & DevOps
* **Containerization:** Docker.
* **Orchestration:** Docker Compose (Frontend, Backend, Database services).

---

## Key Features

### 1. Authentication & Security
* **Hybrid Authentication:** Supports both standard email/password registration and Google OAuth 2.0 "One Tap" login.
* **Role-Based Access Control (RBAC):** Distinct permissions for Administrators (Kitchen) and Clients (Students).
* **Route Protection:** Implementation of Higher-Order Components (HOC) to guard sensitive routes based on token validity and user roles.

### 2. Product Management (Admin)
* Full CRUD operations for inventory items.
* Server-side image upload and serving via static middleware.
* Real-time inventory updates.

### 3. Ordering System
* **Shopping Cart:** Persistent client-side state for order aggregation.
* **Payment Gateway:** Integration with Stripe for secure transaction simulation in test mode.
* **Order Tracking:** Live status tracking (Pending -> In Progress -> Ready -> Delivered).

### 4. Real-Time Synchronization
* Implementation of WebSocket events (`server:neworder`, `server:orderupdated`) to synchronize the Kitchen Dashboard with Client views instantly without polling.

### 5. API Documentation
* Fully documented endpoints available at `http://3.227.144.60:3000/api-docs` using Swagger UI.

---

## Installation & Setup

Prerequisites: Docker Desktop and Git.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd uceats
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `backend` directory with the following keys:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://mongo:27017/uceatsdb
    JWT_SECRET=your_secure_secret
    FRONTEND_URL=http://localhost:5173
    GOOGLE_CLIENT_ID=your_google_client_id
    ```

3.  **Deploy Services:**
    ```bash
    docker compose up --build
    ```

4.  **Access Points:**
    * **Application:** http://localhost:5173
    * **API Documentation:** http://3.227.144.60:3000/api-docs
    * **Backend Health Check:** http://3.227.144.60:3000

---

## Project Roadmap

* [x] Core Architecture Setup (MERN + Docker).
* [x] Image Upload Handling.
* [x] Authentication (JWT + Google OAuth).
* [x] Role-Based Access Control.
* [x] Real-time WebSockets Implementation.
* [x] Payment Gateway Integration (Stripe).
* [x] API Documentation (Swagger).
* [ ] Production Deployment (CI/CD Pipelines).

---

**Developed by:** Kenny Cisneros - Information Systems Engineering Student.

-------------------------------------------------------------------------
SPANISH VERSION
-------------------------------------------------------------------------

# UCEats - Sistema de Automatización de Bares UCE

**UCEats** es una aplicación web Full Stack diseñada para modernizar la gestión y el servicio de bares y comedores en la Universidad Central del Ecuador (UCE). El sistema facilita la gestión de inventarios, el procesamiento de pedidos y la integración de pagos a través de una interfaz segura basada en roles.

El sistema conecta al personal de cocina y a los estudiantes mediante protocolos de comunicación en tiempo real y estándares de autenticación seguros.

---

## Arquitectura Técnica

El proyecto utiliza un enfoque Jamstack con una estructura orientada a microservicios, contenerizada para un despliegue consistente.

### Frontend (Cliente)
* **Framework:** React 18 + Vite (Arquitectura SPA).
* **Gestión de Estado:** Context API (Módulos de Auth y Carrito).
* **Red:** Axios para consumo de API REST.
* **Comunicación en Tiempo Real:** Socket.io Client para actualizaciones de pedidos en vivo.
* **Autenticación:** Google OAuth 2.0 (@react-oauth/google) y manejo interno de JWT.
* **Integración de Pagos:** Stripe.js para procesamiento seguro de tarjetas de crédito.
* **UI/UX:** CSS Modules y principios de Diseño Responsivo.

### Backend (Servidor)
* **Entorno:** Node.js.
* **Framework:** Express.js.
* **Modelado de Datos:** Mongoose (ODM).
* **Autenticación:** * JSON Web Tokens (JWT) para gestión de sesiones.
    * Google Auth Library para verificación de identidad.
* **Servidor en Tiempo Real:** Socket.io para emisión de eventos bidireccionales (Cocina <-> Cliente).
* **Documentación de API:** Swagger UI (Especificación OpenAPI).
* **Manejo de Archivos:** Multer para almacenamiento local de imágenes.
* **Seguridad:** CORS, Bcrypt para hash de contraseñas y validación de entradas.

### Base de Datos
* **Sistema:** MongoDB (Almacenamiento de documentos NoSQL).
* **Colecciones:** Usuarios, Productos, Pedidos.

### Infraestructura y DevOps
* **Contenerización:** Docker.
* **Orquestación:** Docker Compose (Servicios de Frontend, Backend y Base de Datos).

---

## Funcionalidades Clave

### 1. Autenticación y Seguridad
* **Autenticación Híbrida:** Soporte para registro estándar por correo/contraseña y login mediante Google OAuth 2.0 ("One Tap").
* **Control de Acceso Basado en Roles (RBAC):** Permisos distintos para Administradores (Cocina) y Clientes (Estudiantes).
* **Protección de Rutas:** Implementación de componentes de orden superior para proteger rutas sensibles según la validez del token y el rol del usuario.

### 2. Gestión de Productos (Admin)
* Operaciones CRUD completas para ítems de inventario.
* Subida y servicio de imágenes desde el servidor.
* Actualización de inventario en tiempo real.

### 3. Sistema de Pedidos
* **Carrito de Compras:** Estado persistente del lado del cliente para agregación de pedidos.
* **Pasarela de Pagos:** Integración con Stripe para simulación segura de transacciones en modo de prueba.
* **Seguimiento de Pedidos:** Rastreo de estado en vivo (Pendiente -> En Progreso -> Listo -> Entregado).

### 4. Sincronización en Tiempo Real
* Implementación de eventos WebSocket (`server:neworder`, `server:orderupdated`) para sincronizar el Panel de Cocina con las vistas del Cliente instantáneamente sin necesidad de recargar (polling).

### 5. Documentación de API
* Endpoints totalmente documentados y accesibles en `http://3.227.144.60:3000/api-docs` utilizando Swagger UI.

---

## Instalación y Configuración

Prerrequisitos: Docker Desktop y Git.

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd uceats
    ```

2.  **Configuración de Entorno:**
    Crear un archivo `.env` en el directorio `backend` con las siguientes claves:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://mongo:27017/uceatsdb
    JWT_SECRET=tu_secreto_seguro
    FRONTEND_URL=http://localhost:5173
    GOOGLE_CLIENT_ID=tu_cliente_id_google
    ```

3.  **Desplegar Servicios:**
    ```bash
    docker compose up --build
    ```

4.  **Puntos de Acceso:**
    * **Aplicación:** http://localhost:5173
    * **Documentación API:** http://3.227.144.60:3000/api-docs
    * **Backend Health Check:** http://3.227.144.60:3000

---

## Hoja de Ruta del Proyecto

* [x] Configuración de Arquitectura Base (MERN + Docker).
* [x] Manejo de Subida de Imágenes.
* [x] Autenticación (JWT + Google OAuth).
* [x] Control de Acceso Basado en Roles.
* [x] Implementación de WebSockets en Tiempo Real.
* [x] Integración de Pasarela de Pagos (Stripe).
* [x] Documentación de API (Swagger).
* [ ] Despliegue en Producción (CI/CD Pipelines).

---

**Desarrollado por:** Kenny Cisneros - Estudiante de Ingeniería en Sistemas de Información.