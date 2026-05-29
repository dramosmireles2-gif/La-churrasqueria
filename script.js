const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const currentYear = document.getElementById("current-year");
const toast = document.getElementById("toast");
const reservationForm = document.getElementById("reservation-form");

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3400);
};

const updateHeaderState = () => {
  if (!header) return;
  const scrolled = window.scrollY > 12;
  const wrapper = header.querySelector("div > div");
  if (!wrapper) return;

  wrapper.classList.toggle("bg-black/65", scrolled);
  wrapper.classList.toggle("border-gold/15", scrolled);
  wrapper.classList.toggle("shadow-velvet", scrolled);
};

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(reservationForm);
    const telefono = String(reservationForm.dataset.whatsapp || "").replace(/\D/g, "");
    const nombre = data.get("nombre") || "Sin nombre";
    const contacto = data.get("telefono") || "Sin teléfono";
    const fecha = data.get("fecha") || "Por confirmar";
    const hora = data.get("hora") || "Por confirmar";
    const ocasion = data.get("ocasion") || "Reservación general";
    const personas = data.get("personas") || "Por confirmar";
    const mensaje = data.get("mensaje") || "Sin mensaje adicional";

    const text = [
      "Hola, quiero solicitar una reservación en La Churrascaria Do Brasil Culiacán.",
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${contacto}`,
      `Fecha: ${fecha}`,
      `Hora: ${hora}`,
      `Personas: ${personas}`,
      `Ocasión: ${ocasion}`,
      `Mensaje: ${mensaje}`
    ].join("\n");

    showToast("Preparando tu solicitud para WhatsApp...");

    window.setTimeout(() => {
      window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }, 280);
  });
}
