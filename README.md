# Torbellino - Frontend Bootstrap

Frontend basado en el diseño de referencia de Café Torbellino.

## Tecnologías

- HTML5
- CSS3
- Bootstrap 5.3
- Bootstrap Icons
- JavaScript Vanilla
- SweetAlert2
- Google Fonts

## Backend

La URL base está centralizada en `js/api.js`:

```js
const API_BASE_URL = "http://localhost:8080/api";
```

Endpoints contemplados inicialmente:

- `GET /api/menu`
- `GET /api/menu/categorias`
- `GET /api/sedes`
- `GET /api/nosotros`
- `POST /api/reservas`
- `POST /api/contacto`
- `POST /api/newsletter`

Si tu Spring Boot usa otros endpoints, solo modificaremos `js/api.js`.

## Ejecutar

Abre el proyecto con VS Code y usa Live Server sobre `index.html`.

Si Spring Boot corre en `http://localhost:8080`, configura CORS en el backend para permitir el origen del frontend.

El proyecto trae datos de demostración como fallback para poder trabajar el diseño antes de terminar la API.
