
const LAYERS = {
  all: { label: "All", city: "Lincoln", caption: "Midnight → midnight. Colour is temperature. The hand is now.", face: "lincoln", alt: "WeatherRing in Lincoln, the full 24-hour ring" },
  now: { label: "Now", city: "Cairo", caption: "From midnight to the hand is time already passed today. The inner and outer lines are the same mark.", face: "cairo", alt: "WeatherRing in Cairo, the hand marking now" },
  temperature: { label: "Temperature", city: "Lincoln", caption: "Cool hours sit toward blue/violet. Warm hours sit toward orange/red.", face: "lincoln", alt: "WeatherRing in Lincoln, temperature scale around the rim" },
  night: { label: "Night", city: "Eureka", caption: "Darker arc is night. It lifts at sunrise and returns at sunset.", face: "eureka", alt: "WeatherRing in Eureka, night veil on the rim" },
  sky: { label: "Sky", city: "Eureka", caption: "Inner glow: yellow = clearer, white/grey = cloud or overcast.", face: "eureka", alt: "WeatherRing in Eureka, sky glow inside the ring" },
  rain: { label: "Rain", city: "São Paulo", caption: "Streaks on that hour. Longer = more rain. Gaps = patchy.", face: "saopaulo", alt: "WeatherRing in São Paulo, rain streaks on the rim" },
  snow: { label: "Snow", city: "Ushuaia", caption: "Soft white ticks — snow or ice, not rain.", face: "ushuaia", alt: "WeatherRing in Ushuaia, snow on the rim" },
  thunder: { label: "Thunder", city: "Yangon", caption: "Bolts when thunder is in the forecast, even if rain is light.", face: "yangon", alt: "WeatherRing in Yangon, lightning bolts on the rim" },
  fog: { label: "Fog", city: "Eureka", caption: "Milky inner band — fog or dense mist. Thicker = heavier.", face: "eureka", alt: "WeatherRing in Eureka, fog on the rim" }
};

function faceSrc(name) {
  const img = document.querySelector("[data-layer-face]");
  if (!img) return "images/face-" + name + ".png";
  const src = img.getAttribute("src") || "";
  const prefix = src.includes("../images/") ? "../images/" : "images/";
  return prefix + "face-" + name + ".png";
}

document.querySelectorAll("[data-layer]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const layer = LAYERS[btn.getAttribute("data-layer")];
    if (!layer) return;
    document.querySelectorAll("[data-layer]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const img = document.querySelector("[data-layer-face]");
    const city = document.querySelector("[data-layer-city]");
    const label = document.querySelector("[data-layer-label]");
    const caption = document.querySelector("[data-layer-caption]");
    if (img) { img.src = faceSrc(layer.face); img.alt = layer.alt; }
    if (city) city.textContent = layer.city;
    if (label) label.textContent = layer.label;
    if (caption) caption.textContent = layer.caption;
  });
});

const toggle = document.querySelector("[data-nav-toggle]");
const mobile = document.getElementById("mobile-nav");
if (toggle && mobile) {
  toggle.addEventListener("click", () => {
    const open = mobile.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

document.querySelectorAll("[data-waitlist]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input[type=email]");
    const email = (input && input.value || "").trim();
    if (!email || !email.includes("@")) return;
    const subject = encodeURIComponent("WeatherRing waitlist");
    const body = encodeURIComponent("Please add this address to the WeatherRing waitlist:\n\n" + email + "\n");
    window.location.href = "mailto:weatherring@protoart.net?subject=" + subject + "&body=" + body;
  });
});
