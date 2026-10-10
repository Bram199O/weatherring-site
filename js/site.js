
const LAYERS = {
  all: { caption: "The ring is one day, from midnight to midnight, with midnight at the bottom. Its color is the temperature. The hand shows the time now.", face: "read-all.jpg", alt: "Example WeatherRing face with every layer on: temperature colours, night, sky glow, rain, snow, thunder, fog and wind arrows" },
  now: { caption: "The part from midnight to the hand is the time that has already passed today. The thin inner and outer lines show the same.", face: "read-now.jpg", alt: "Example WeatherRing face highlighting the now hand and elapsed hours" },
  temperature: { caption: "Cool hours are blue or violet, warm hours orange or red. For colors that are easier to tell apart with color blindness: Look tab, under Display.", face: "read-temperature.jpg", alt: "Example WeatherRing face showing temperature colour around the rim" },
  night: { caption: "The darker part is night. It lifts at sunrise (about 07) and returns at sunset (about 19). To make it lighter or darker: Look tab, under Sky, Night veil.", face: "read-night.jpg", alt: "Example WeatherRing face with the night veil on the rim" },
  sky: { caption: "The glow inside the ring is the sky: gold for sun, pale for overcast. Patchy cloud mixes the two. Gold fades after sunset. To change or turn it off: Look tab, under Sky, Sky glow.", face: "read-sky.jpg", alt: "Example WeatherRing face with sky glow inside the ring" },
  rain: { caption: "Streaks on that hour. Longer means more rain, gaps mean patchy rain. Settings: Look tab, under Weather, Rain.", face: "read-rain.jpg", alt: "Example WeatherRing face with rain streaks on the rim" },
  snow: { caption: "Soft white ticks mean snow or ice, not rain. Settings: Look tab, under Weather, Snow.", face: "read-snow.jpg", alt: "Example WeatherRing face with snow ticks on the rim" },
  thunder: { caption: "Bolts when thunder is in the forecast, even if the rain is light. Settings: Look tab, under Weather, Thunderstorm.", face: "read-thunder.jpg", alt: "Example WeatherRing face with lightning bolts on the rim" },
  fog: { caption: "A milky band on the inside means fog or dense mist. Thicker means heavier. Settings: Look tab, under Weather, Fog.", face: "read-fog.jpg", alt: "Example WeatherRing face with a milky fog band" },
  wind: { caption: "Black arrows point where the wind blows to (north is up). A bigger arrow means stronger wind. Calmer hours get no arrow: by default arrows start at Beaufort 4, a clearly noticeable wind. A magenta edge means gusts of 75 km/h or more. To change this: Look tab, under Weather, Wind.", face: "read-wind.jpg", alt: "Example WeatherRing face with black wind arrows on the ring, some with a magenta gust edge" },
  nextdays: { caption: "To see the coming days, turn on Next days in the Look tab. The bottom half of the ring then shows tomorrow, or the next two days. Tomorrow starts on the right. The two letters are the weekday in your phone's language (for example MO, TU), with that day's low and high beside them. You can change all of this in the Look tab, under Next days.", face: "read-nextdays.jpg", alt: "Example WeatherRing face with Next days on: today in the top half, Saturday in the bottom half with a low of 3° and a high of 24°" }
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
