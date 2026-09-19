// Todas las peticiones del frontend pasan por aquí.
// Backend Spring Boot esperado: http://localhost:8080

const API_BASE_URL = "http://localhost:8080/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const error = await response.json();
      message = error.message || error.mensaje || message;
    } catch (_) {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

const API = {
  menu: () => apiRequest("/menu"),
  categoriasMenu: () => apiRequest("/menu/categorias"),
  sedes: () => apiRequest("/sedes"),
  reserva: (data) => apiRequest("/reservas", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  contacto: (data) => apiRequest("/contacto", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  newsletter: (data) => apiRequest("/newsletter", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  nosotros: () => apiRequest("/nosotros")
};
