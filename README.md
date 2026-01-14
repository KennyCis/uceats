# 🍔 UCEats - Sistema de Automatización de Bares UCE

**UCEats** es una aplicación web Full Stack diseñada para modernizar y gestionar los bares y comedores de la Universidad Central del Ecuador (UCE). Permite a los administradores gestionar el inventario de productos (comidas, bebidas, snacks) mediante una interfaz intuitiva y rápida.

---

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza una arquitectura basada en microservicios contenerizados con **Docker**.

### 💻 Frontend (Cliente)
Construido con **React + Vite** para una experiencia de usuario rápida y reactiva.
* **React 18:** Librería principal de UI.
* **React Hook Form:** Manejo eficiente y validación de formularios.
* **Axios:** Cliente HTTP para comunicación con el servidor.
* **React Icons:** Paquete de íconos vectoriales.
* **CSS Modules / Inline:** Estilos personalizados con variables CSS.

### 🛠️ Backend (Servidor)
API RESTful construida sobre **Node.js**.
* **Express.js:** Framework web minimalista y robusto.
* **Mongoose:** ODM para modelado de datos en MongoDB.
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

### Gestión de Productos (CRUD Completo)
1.  **Crear:** Formulario modal para ingresar nuevos productos con Nombre, Precio y Categoría.
2.  **Leer:** Visualización de productos en tiempo real en una cuadrícula responsive.
3.  **Actualizar:** Edición de productos existentes mediante modal pre-llenado.
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
* [ ] Implementación de subida de imágenes reales (Multer).
* [ ] Sistema de Autenticación (Login/Register).
* [ ] Vista de Cliente (Menú público).
* [ ] Carrito de compras.

---
**Desarrollado por:** Kenny Israel Cisneros Calderón - Estudiante de Ingeniería en Sistemas de Información.