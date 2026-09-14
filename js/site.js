
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

function faceSrc(file) {
  const img = document.querySelector("[data-layer-face]");
  if (!img) return "images/" + file;
  const src = img.getAttribute("src") || "";
  const prefix = src.includes("../images/") ? "../images/" : "images/";
  return prefix + file;
}

function applyLayer(id, syncHash) {
  const layer = LAYERS[id];
  if (!layer) return;
  document.querySelectorAll("[data-layer]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-layer") === id));
  });
  const img = document.querySelector("[data-layer-face]");
  const caption = document.querySelector("[data-layer-caption]");
  if (img) { img.src = faceSrc(layer.face); img.alt = layer.alt; }
  if (caption) caption.textContent = layer.caption;
  if (syncHash) {
    const next = "#" + id;
    if (window.location.hash !== next) history.replaceState(null, "", next);
  }
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
