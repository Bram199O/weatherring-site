
const LAYERS = {
  all: { caption: "Midnight → midnight. Colour is temperature. The hand is now.", face: "read-all.jpg", alt: "Example WeatherRing face with every layer on, 11:00 on Friday 20 March" },
  now: { caption: "From midnight to the hand is time already passed today. The inner and outer lines are the same mark.", face: "read-now.jpg", alt: "Example WeatherRing face highlighting the now hand and elapsed hours" },
  temperature: { caption: "Cool hours sit toward blue/violet. Warm hours sit toward orange/red.", face: "read-temperature.jpg", alt: "Example WeatherRing face showing temperature colour around the rim" },
  night: { caption: "Darker arc is night. It lifts at sunrise (~07) and returns at sunset (~19).", face: "read-night.jpg", alt: "Example WeatherRing face with the night veil on the rim" },
  sky: { caption: "Inner glow: yellow = clearer, white/grey = cloud or overcast.", face: "read-sky.jpg", alt: "Example WeatherRing face with sky glow inside the ring" },
  rain: { caption: "Streaks on that hour. Longer = more rain. Gaps = patchy.", face: "read-rain.jpg", alt: "Example WeatherRing face with rain streaks on the rim" },
  snow: { caption: "Soft white ticks — snow or ice, not rain.", face: "read-snow.jpg", alt: "Example WeatherRing face with snow ticks on the rim" },
  thunder: { caption: "Bolts when thunder is in the forecast, even if rain is light.", face: "read-thunder.jpg", alt: "Example WeatherRing face with lightning bolts on the rim" },
  fog: { caption: "Milky inner band — fog or dense mist. Thicker = heavier.", face: "read-fog.jpg", alt: "Example WeatherRing face with a milky fog band" }
};

const preferWebp = (() => {
  try {
    return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } catch (e) {
    return false;
  }
})();

const layerFace = document.querySelector("[data-layer-face]");
const imagePrefix = (() => {
  if (!layerFace) return "images/";
  const src = layerFace.getAttribute("src") || "";
  return src.includes("../images/") ? "../images/" : "images/";
})();

function faceSrc(file) {
  const name = preferWebp && file.endsWith(".jpg") ? file.replace(/\.jpg$/, ".webp") : file;
  return imagePrefix + name;
}

const decodedFaces = new Map();

function preloadLayerFaces() {
  Object.values(LAYERS).forEach((layer) => {
    const src = faceSrc(layer.face);
    const el = new Image();
    el.decoding = "async";
    el.src = src;
    const done = el.decode ? el.decode() : Promise.resolve();
    decodedFaces.set(src, done.catch(() => {}));
  });
}

function applyLayer(id, syncHash) {
  const layer = LAYERS[id];
  if (!layer) return;
  document.querySelectorAll("[data-layer]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-layer") === id));
  });
  const img = document.querySelector("[data-layer-face]");
  const caption = document.querySelector("[data-layer-caption]");
  if (caption) caption.textContent = layer.caption;
  if (syncHash) {
    const next = "#" + id;
    if (window.location.hash !== next) history.replaceState(null, "", next);
  }
  if (!img) return;
  img.alt = layer.alt;
  const nextSrc = faceSrc(layer.face);
  const applySrc = () => {
    if (img.getAttribute("src") !== nextSrc) img.src = nextSrc;
  };
  const ready = decodedFaces.get(nextSrc);
  if (ready) {
    ready.then(applySrc);
    return;
  }
  const probe = new Image();
  probe.src = nextSrc;
  const decode = probe.decode ? probe.decode() : Promise.resolve();
  decodedFaces.set(nextSrc, decode.catch(() => {}));
  decode.then(applySrc).catch(applySrc);
}

preloadLayerFaces();

if (layerFace && preferWebp) {
  const src = layerFace.getAttribute("src") || "";
  if (src.endsWith(".jpg")) layerFace.src = src.replace(/\.jpg$/, ".webp");
}

const syncHash = window.location.pathname.indexOf("how-to-read") !== -1;
document.querySelectorAll("[data-layer]").forEach((btn) => {
  btn.addEventListener("click", () => applyLayer(btn.getAttribute("data-layer"), syncHash));
});
if (syncHash) {
  const fromHash = window.location.hash.replace(/^#/, "");
  if (LAYERS[fromHash]) applyLayer(fromHash, false);
}

const toggle = document.querySelector("[data-nav-toggle]");
const mobile = document.getElementById("mobile-nav");
if (toggle && mobile) {
  toggle.addEventListener("click", () => {
    const open = mobile.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}
