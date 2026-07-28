const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav nav");

const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

const whatsappButton = document.createElement("a");
whatsappButton.className = "whatsapp-float";
whatsappButton.href =
  "https://wa.me/34614121568?text=Hola%20Doctor%20Play%2C%20quiero%20solicitar%20un%20diagn%C3%B3stico";
whatsappButton.target = "_blank";
whatsappButton.rel = "noreferrer";
whatsappButton.setAttribute("aria-label", "Contactar con Doctor Play por WhatsApp");
whatsappButton.innerHTML = `
  <span class="whatsapp-label">¿Te ayudamos?</span>
  <span class="whatsapp-icon" aria-hidden="true">
    <svg fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732.737 5.291 2.022 7.491l-.038-.07-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h.006c8.209-.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507zm-10.514 22.865h-.006c-2.319 0-4.489-.64-6.342-1.753l.056.031-.451-.267-4.675 1.227 1.247-4.559-.294-.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353zm6.776-9.251c-.371-.186-2.197-1.083-2.537-1.208-.341-.124-.589-.185-.837.187-.246.371-.958 1.207-1.175 1.455-.216.249-.434.279-.805.094-1.15-.466-2.138-1.087-2.997-1.852l.01.009c-.799-.74-1.484-1.587-2.037-2.521l-.028-.052c-.216-.371-.023-.572.162-.757.167-.166.372-.434.557-.65.146-.179.271-.384.366-.604l.006-.017a.657.657 0 0 0 .068-.296.68.68 0 0 0-.101-.357l.002.003c-.094-.186-.836-2.014-1.145-2.758-.302-.724-.609-.625-.836-.637-.216-.01-.464-.012-.712-.012a1.32 1.32 0 0 0-.988.463l-.001.002a4.17 4.17 0 0 0-1.3 3.023l.001.079c.131 1.467.681 2.784 1.527 3.857l-.012-.015c1.604 2.379 3.742 4.282 6.251 5.564l.094.043c.548.248 1.25.513 1.968.74l.149.041c.442.14.951.221 1.479.221.303 0 .601-.027.889-.078l-.031.004c1.069-.223 1.956-.868 2.497-1.749l.009-.017c.165-.366.261-.793.261-1.242 0-.185-.016-.366-.047-.542l.003.019c-.092-.155-.34-.247-.712-.434z"/>
    </svg>
  </span>`;
document.body.appendChild(whatsappButton);

document.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const problem = document.querySelector("#problem");
const diagnosticLink = document.querySelector("#diagnostic-link");
problem?.addEventListener("change", () => {
  const base = "https://wa.me/34614121568?text=";
  const message = problem.value
    ? `Hola Doctor Play, quiero solicitar un diagnóstico. Problema: ${problem.value}`
    : "Hola Doctor Play, quiero solicitar un diagnóstico";
  diagnosticLink.href = base + encodeURIComponent(message);
  diagnosticLink.classList.toggle("ready", Boolean(problem.value));
});

const animatedElements = document.querySelectorAll(
  ".reveal, .product-card, .case, .value-grid article, .mini-process article, .stats-band > div"
);

animatedElements.forEach((element) => element.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.12 }
);
animatedElements.forEach((element) => observer.observe(element));

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    detail.parentElement
      ?.querySelectorAll("details")
      .forEach((other) => other !== detail && other.removeAttribute("open"));
  });
});

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    document.querySelectorAll(".float-shot").forEach((shot, index) => {
      const factor = index % 2 ? -0.7 : 1;
      shot.style.translate = `${x * factor}px ${y * factor}px`;
    });
  });
}

document.querySelectorAll(".service-card, .product-card, .case, .service-feature").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const box = card.getBoundingClientRect();
    const rx = ((event.clientY - box.top) / box.height - 0.5) * -3;
    const ry = ((event.clientX - box.left) / box.width - 0.5) * 3;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
