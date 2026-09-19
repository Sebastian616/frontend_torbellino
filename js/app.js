const menuDemo = [
  {
    id: 1,
    nombre: "Café de origen",
    descripcion: "Café colombiano preparado en taza.",
    precio: 4500,
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    nombre: "Métodos de filtrado",
    descripcion: "Sabor en cada detalle.",
    precio: 6500,
    imagen: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    nombre: "Repostería tradicional",
    descripcion: "El acompañamiento perfecto.",
    precio: 5800,
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    nombre: "Platos locales",
    descripcion: "El sabor de nuestra tierra.",
    precio: 8500,
    imagen: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
  }
];

const sedesDemo = [
  {
    id: 1,
    nombre: "La Alpujarra",
    descripcion: "Estación del Ferrocarril de Antioquia",
    imagen: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    nombre: "La Floresta",
    descripcion: "Barrio tradicional",
    imagen: "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    nombre: "Conquistadores",
    descripcion: "Ambiente natural y acogedor",
    imagen: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
  }
];

function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function renderCategorias(items) {
  document.getElementById("menuCategorias").innerHTML = items.map(item => `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="menu-category">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div class="menu-category-body">
          <h5>${item.nombre}</h5>
          <p>${item.descripcion}</p>
        </div>
      </article>
    </div>
  `).join("");
}

function renderMenuCompleto(items) {
  const container = document.getElementById("menuCompleto");

  container.innerHTML = items.map(item => `
    <div class="col-12 col-md-6 col-lg-3">
      <article class="menu-card">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div class="menu-card-body">
          <h5>${item.nombre}</h5>
          <p class="small text-secondary">${item.descripcion}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="menu-price">${money(item.precio)}</span>
            <button class="btn btn-sm btn-outline-coffee btnAgregar" data-id="${item.id}">
              Agregar
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join("");

  container.classList.remove("d-none");
}

function renderSedes(items) {
  document.getElementById("sedesContainer").innerHTML = items.map(sede => `
    <div class="col-md-6 col-lg-4">
      <article class="location-card">
        <img src="${sede.imagen}" alt="${sede.nombre}">
        <div class="location-content">
          <h4>${sede.nombre}</h4>
          <p class="mb-0">${sede.descripcion}</p>
        </div>
      </article>
    </div>
  `).join("");

  document.getElementById("reservaSede").innerHTML = items.map(sede =>
    `<option value="${sede.id}">${sede.nombre}</option>`
  ).join("");
}

async function cargarDatosIniciales() {
  renderCategorias(menuDemo);
  renderSedes(sedesDemo);

  try {
    const [menu, sedes] = await Promise.all([API.menu(), API.sedes()]);

    if (Array.isArray(menu) && menu.length) {
      renderCategorias(menu.slice(0, 4));
      renderMenuCompleto(menu);
    }

    if (Array.isArray(sedes) && sedes.length) renderSedes(sedes);
  } catch (error) {
    console.info("Backend todavía no disponible:", error.message);
  }
}

document.getElementById("btnMostrarMenuCompleto").addEventListener("click", async () => {
  try {
    const menu = await API.menu();
    renderMenuCompleto(Array.isArray(menu) && menu.length ? menu : menuDemo);
  } catch (_) {
    renderMenuCompleto(menuDemo);
  }
});

document.getElementById("btnCargarMenu").addEventListener("click", () => {
  document.getElementById("btnMostrarMenuCompleto").click();
  document.getElementById("menuCompleto").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btnSedes").addEventListener("click", () => {
  document.getElementById("sedes").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btnNosotros").addEventListener("click", async () => {
  try {
    const data = await API.nosotros();
    Swal.fire({
      title: data?.titulo || "Nuestra historia",
      text: data?.descripcion || "Conoce la historia de Café Torbellino.",
      confirmButtonColor: "#3e2a1f"
    });
  } catch (_) {
    Swal.fire({
      title: "Nuestra historia",
      text: "Café Torbellino nace de una tradición familiar ligada al café y a la cultura antioqueña.",
      confirmButtonColor: "#3e2a1f"
    });
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".btnAgregar");
  if (!button) return;

  const item = menuDemo.find(x => x.id === Number(button.dataset.id));

  Swal.fire({
    icon: "success",
    title: "Producto seleccionado",
    text: `${item?.nombre || "Producto"} fue seleccionado.`,
    confirmButtonColor: "#3e2a1f"
  });
});

document.getElementById("reservaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target).entries());
  data.personas = Number(data.personas);
  data.sedeId = Number(data.sedeId);

  try {
    await API.reserva(data);

    bootstrap.Modal.getInstance(document.getElementById("reservaModal")).hide();
    event.target.reset();

    Swal.fire({
      icon: "success",
      title: "Reserva recibida",
      text: "Tu solicitud de reserva fue enviada correctamente.",
      confirmButtonColor: "#3e2a1f"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible reservar",
      text: error.message,
      confirmButtonColor: "#3e2a1f"
    });
  }
});

document.getElementById("contactForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());

  try {
    await API.contacto(data);
    event.target.reset();

    Swal.fire({
      icon: "success",
      title: "Mensaje enviado",
      text: "Gracias por escribirnos.",
      confirmButtonColor: "#3e2a1f"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible enviar el mensaje",
      text: error.message,
      confirmButtonColor: "#3e2a1f"
    });
  }
});

document.getElementById("newsletterForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());

  try {
    await API.newsletter(data);
    event.target.reset();

    Swal.fire({
      icon: "success",
      title: "¡Suscripción realizada!",
      text: "Recibirás nuestras novedades.",
      confirmButtonColor: "#3e2a1f"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible suscribirte",
      text: error.message,
      confirmButtonColor: "#3e2a1f"
    });
  }
});

cargarDatosIniciales();
