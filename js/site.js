
const LAYERS = {
  all: { caption: "Midnight to midnight, with midnight at the bottom of the ring and noon at the top. Color shows temperature, and the hand points to the current hour.", face: "read-all.jpg", alt: "Example WeatherRing face with every layer on, 11:00 on Friday 20 March" },
  now: { caption: "From midnight to the hand is time that has already passed today. The inner and outer lines are the same mark.", face: "read-now.jpg", alt: "Example WeatherRing face highlighting the now hand and elapsed hours" },
  temperature: { caption: "Cool hours sit toward blue and violet. Warm hours sit toward orange and red.", face: "read-temperature.jpg", alt: "Example WeatherRing face showing temperature colour around the rim" },
  night: { caption: "The darker arc is night. It lifts at sunrise and returns at sunset.", face: "read-night.jpg", alt: "Example WeatherRing face with the night veil on the rim" },
  sky: { caption: "The glow inside the ring is the sky: gold for sun, pale for overcast.", face: "read-sky.jpg", alt: "Example WeatherRing face with sky glow inside the ring" },
  rain: { caption: "Streaks on that hour. Longer streaks mean more rain, gaps mean patchy showers.", face: "read-rain.jpg", alt: "Example WeatherRing face with rain streaks on the rim" },
  snow: { caption: "Soft white ticks mean snow or ice, not rain.", face: "read-snow.jpg", alt: "Example WeatherRing face with snow ticks on the rim" },
  thunder: { caption: "Lightning bolts show when thunder is in the forecast, even if the rain is light.", face: "read-thunder.jpg", alt: "Example WeatherRing face with lightning bolts on the rim" },
  fog: { caption: "A milky band just inside the ring means fog or dense mist. A thicker band means heavier fog.", face: "read-fog.jpg", alt: "Example WeatherRing face with a milky fog band" },
  nextdays: { caption: "With Next days on, today fills the top half of the ring and the bottom half shows tomorrow or the next two days. Two letters mark each weekday, with that day's low and high beside them.", face: "read-nextdays.jpg", alt: "Example WeatherRing face with Next days on: today in the top half, Friday in the bottom half with its low and high" }
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

let preloaded = false;
function preloadOnce() {
  if (preloaded) return;
  preloaded = true;
  preloadLayerFaces();
}
if (layerFace && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      preloadOnce();
    }
  }, { rootMargin: "300px" });
  io.observe(layerFace);
} else if (layerFace) {
  preloadOnce();
}
document.querySelectorAll("[data-layer]").forEach((btn) => {
  ["pointerenter", "focus"].forEach((ev) => btn.addEventListener(ev, preloadOnce, { once: true }));
});

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
