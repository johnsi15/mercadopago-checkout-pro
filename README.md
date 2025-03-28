# MercadoPago API Mutuo

Este proyecto es una API basada en Node.js que utiliza Express y la biblioteca de MercadoPago para manejar pagos y notificaciones webhook. Está diseñada para integrarse con el sistema de pagos de MercadoPago y gestionar notificaciones relacionadas con transacciones.

## Características

- Creación de preferencias de pago con MercadoPago.
- Manejo de notificaciones webhook para validar transacciones.
- Configuración para despliegue en Fly.io.
- Uso de variables de entorno para configuraciones sensibles.

## Requisitos

- Node.js (versión 20.13.1 o superior recomendada).
- npm (incluido con Node.js).
- Una cuenta de desarrollador en [MercadoPago](https://www.mercadopago.com.co/developers/es/docs).

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/johnsi15/mercadopago-checkout-pro
   cd mercadopago-checkout-pro
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

   ```env
   ACCESS_TOKEN=<tu_access_token_de_mercadopago>
   WEBHOOK_SECRET=<tu_secreto_webhook>
   PORT=3000
   NODE_ENV=development
   ```

4. (Opcional) Si deseas usar Docker, asegúrate de tener Docker instalado y ejecuta:

   ```bash
   docker build -t mercadopago-checkout-pro .
   ```

## Uso

### Modo Desarrollo

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

### Modo Producción

Para iniciar el servidor en modo producción:

```bash
npm run start
```

### Depuración

Para iniciar el servidor con soporte para depuración:

```bash
npm run debug
```

## Endpoints

### Crear Preferencia de Pago

- **POST** `/create_preference`
- **Descripción:** Crea una preferencia de pago en MercadoPago.
- **Cuerpo de la solicitud:**
  ```json
  {
    "description": "Descripción del producto",
    "price": 100,
    "quantity": 1
  }
  ```
- **Respuesta:**
  ```json
  {
    "id": "ID de la preferencia",
    "init_point": "URL para iniciar el pago"
  }
  ```

### Webhook de MercadoPago

- **POST** `/webhook/mercadopago`
- **Descripción:** Maneja notificaciones de MercadoPago para validar transacciones.

### Feedback de Pago

- **GET** `/feedback`
- **Descripción:** Devuelve información sobre el estado de un pago.

## Despliegue en Fly.io

1. Instala la CLI de Fly.io siguiendo las instrucciones en [Fly.io](https://fly.io/docs/getting-started/installing-flyctl/).
2. Inicia sesión en Fly.io:

   ```bash
   flyctl auth login
   ```

3. Despliega la aplicación:

   ```bash
   flyctl launch
   ```

## Estructura del Proyecto

```
.dockerignore
.env
.gitignore
config.js
Dockerfile
fly.toml
package.json
routes.js
server.js
webhook-mercadopago.js
```

- **`server.js`**: Configuración principal del servidor Express.
- **`routes.js`**: Define las rutas de la API.
- **`webhook-mercadopago.js`**: Lógica para manejar notificaciones webhook de MercadoPago.
- **`config.js`**: Configuración del proyecto basada en variables de entorno.
- **`Dockerfile`**: Configuración para construir y ejecutar la aplicación en un contenedor Docker.
- **`fly.toml`**: Configuración para desplegar la aplicación en Fly.io.

## Dependencias

- **`express`**: Framework para construir la API.
- **`cors`**: Middleware para habilitar CORS.
- **`mercadopago`**: SDK oficial de MercadoPago.
- **`nodemon`**: Herramienta para recarga automática en desarrollo.

## Licencia

Este proyecto está licenciado bajo la licencia ISC.