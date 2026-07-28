const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav nav");

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

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
