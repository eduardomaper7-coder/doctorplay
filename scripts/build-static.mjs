import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const assetFiles = [
  "logo.webp",
  "repair.jpg",
  "ps5.jpg",
  "xbox.jpg",
  "chip.jpg",
  "controller.jpg",
  "workbench.jpg",
  "thermal.jpg",
  "customer.jpg",
];

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

const [html, services, repairs, about, contact, css, js, hosting] = await Promise.all([
  readFile(resolve(root, "static/index.html"), "utf8"),
  readFile(resolve(root, "static/servicios.html"), "utf8"),
  readFile(resolve(root, "static/reparaciones.html"), "utf8"),
  readFile(resolve(root, "static/nosotros.html"), "utf8"),
  readFile(resolve(root, "static/contacto.html"), "utf8"),
  readFile(resolve(root, "static/style.css"), "utf8"),
  readFile(resolve(root, "static/script.js"), "utf8"),
  readFile(resolve(root, ".openai/hosting.json"), "utf8"),
]);

const assets = {};
for (const name of assetFiles) {
  const bytes = await readFile(resolve(root, "public/media", name));
  assets[`/media/${name}`] = bytes.toString("base64");
}

const worker = `
const html = ${JSON.stringify(html)};
const pages = ${JSON.stringify({
  "/servicios": services,
  "/reparaciones": repairs,
  "/nosotros": about,
  "/contacto": contact,
})};
const css = ${JSON.stringify(css)};
const js = ${JSON.stringify(js)};
const assets = ${JSON.stringify(assets)};
const types = {".webp":"image/webp",".jpg":"image/jpeg"};

function binary(base64) {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname === "/style.css") {
      return new Response(request.method === "HEAD" ? null : css, { headers: {"content-type":"text/css; charset=utf-8","cache-control":"public, max-age=3600"} });
    }
    if (url.pathname === "/script.js") {
      return new Response(request.method === "HEAD" ? null : js, { headers: {"content-type":"text/javascript; charset=utf-8","cache-control":"public, max-age=3600"} });
    }
    if (assets[url.pathname]) {
      const ext = url.pathname.slice(url.pathname.lastIndexOf("."));
      return new Response(request.method === "HEAD" ? null : binary(assets[url.pathname]), { headers: {"content-type":types[ext] || "application/octet-stream","cache-control":"public, max-age=31536000, immutable"} });
    }
    const normalized = url.pathname.length > 1 ? url.pathname.replace(/\\/$/, "") : url.pathname;
    if (pages[normalized]) {
      return new Response(request.method === "HEAD" ? null : pages[normalized], { headers: {"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=300"} });
    }
    if (normalized !== "/" && normalized !== "/index.html") {
      return new Response("Not found", { status: 404 });
    }
    return new Response(request.method === "HEAD" ? null : html, { headers: {"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=300"} });
  }
};
`;

await writeFile(resolve(dist, "server/index.js"), worker);
await writeFile(resolve(dist, ".openai/hosting.json"), hosting);
console.log("Static site built with embedded production assets.");
