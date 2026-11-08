/* =====================================================
   EDIT THESE FIRST
   ===================================================== */
const CONFIG = {
  restaurantName: "Mama's Soul Kitchen",
  phoneDisplay: "(555) 555-0123",
  phoneDial: "+15555550123",            // digits for tel: links
  messengerPage: "YOUR_PAGE_NAME",      // from facebook.com/YOUR_PAGE_NAME -> m.me/YOUR_PAGE_NAME
  currency: "$"
};

/* =====================================================
   MENU DATA (edit names, prices and descriptions)
   ===================================================== */
const MENU = [
  {
    id: "mains", title: "Mains", icon: "🍗", color: "#fde3c4",
    items: [
      ["Fried Chicken", "Seasoned and fried golden and crisp.", 13.99, "🍗"],
      ["Smothered Pork Chops", "Tender chops simmered in onion gravy.", 14.99, "🥩"],
      ["Smothered Chicken", "Fried chicken smothered in rich gravy.", 14.49, "🍗"],
      ["Fried Catfish", "Cornmeal-crusted, served hot.", 14.99, "🐟"],
      ["Oxtails", "Slow-braised until fall-off-the-bone.", 21.99, "🍖"],
      ["Meatloaf", "Homestyle meatloaf with brown gravy.", 12.99, "🍖"],
      ["Baked Chicken", "Herb-seasoned and oven roasted.", 12.99, "🍗"],
      ["Turkey Wings", "Smoky, slow-baked and tender.", 13.99, "🦃"],
      ["BBQ Ribs", "Fall-apart ribs in house barbecue sauce.", 17.99, "🍖"],
      ["Chitterlings", "Traditional, slow-cooked. Weekend special.", 15.99, "🥘"]
    ]
  },
  {
    id: "sides", title: "Sides", icon: "🥬", color: "#d9eccf",
    items: [
      ["Collard Greens", "Simmered with smoked turkey.", 4.49, "🥬"],
      ["Mac & Cheese", "Baked, creamy and cheesy.", 4.99, "🧀"],
      ["Candied Yams", "Sweet, buttery and spiced.", 4.49, "🍠"],
      ["Black-Eyed Peas", "Slow-cooked with seasoning.", 3.99, "🫘"],
      ["Red Beans", "Savory and hearty.", 3.99, "🫘"],
      ["Lima Beans", "Buttery and tender.", 3.99, "🫛"],
      ["Cornbread", "Warm, golden and slightly sweet.", 2.49, "🌽"],
      ["Rice & Gravy", "Fluffy rice smothered in gravy.", 3.99, "🍚"],
      ["Cabbage", "Southern-style, with smoked seasoning.", 3.99, "🥬"],
      ["Fried Okra", "Crispy cornmeal-battered okra.", 4.49, "🥒"],
      ["Fried Green Tomatoes", "Tangy, crunchy and golden.", 4.99, "🍅"],
      ["Potato Salad", "Creamy, classic and cold.", 3.99, "🥔"],
      ["Mashed Potatoes", "Whipped smooth with gravy.", 3.99, "🥔"],
      ["Green Beans", "Slow-simmered with onion.", 3.99, "🫛"]
    ]
  },
  {
    id: "breakfast", title: "Breakfast", icon: "🍳", color: "#fff0b8",
    items: [
      ["Chicken & Waffles", "Crispy chicken on a fluffy waffle.", 13.99, "🧇"],
      ["Shrimp & Grits", "Seasoned shrimp over creamy grits.", 14.99, "🍤"],
      ["Salmon Croquettes", "Pan-fried patties with eggs.", 11.99, "🐟"],
      ["Grits", "Stone-ground and buttery.", 3.99, "🥣"],
      ["Biscuits", "Flaky, buttery, served warm.", 3.49, "🥐"],
      ["Catfish & Eggs", "Fried catfish with eggs and grits.", 13.99, "🍳"]
    ]
  },
  {
    id: "desserts", title: "Desserts", icon: "🍑", color: "#fbd3dc",
    items: [
      ["Peach Cobbler", "Warm, spiced and topped with crust.", 5.99, "🍑"],
      ["Banana Pudding", "Layered with vanilla wafers.", 4.99, "🍌"],
      ["Sweet Potato Pie", "Silky and perfectly spiced.", 4.99, "🥧"],
      ["Red Velvet Cake", "With cream cheese frosting.", 5.99, "🍰"],
      ["Pound Cake", "Buttery, dense and golden.", 4.49, "🍰"]
    ]
  },
  {
    id: "drinks", title: "Drinks", icon: "🥤", color: "#d3e6fb",
    items: [
      ["Sweet Tea", "Southern-style, ice cold.", 2.49, "🧋"],
      ["Red Drink", "Classic red punch.", 2.49, "🥤"],
      ["Kool-Aid", "Fruity and cold.", 2.29, "🥤"]
    ]
  }
];

/* =====================================================
   STATE
   ===================================================== */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  }
};

let mode = store.get("mode", "Delivery");
let cart = store.get("cart", {});   // { itemKey: { name, price, qty } }

const money = n => CONFIG.currency + n.toFixed(2);
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const keyOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/* =====================================================
   RENDER MENU
   ===================================================== */
function renderMenu() {
  const menu = $("#menu");
  const nav = $("#sectionNav");
  menu.innerHTML = "";
  nav.innerHTML = "";

  MENU.forEach(section => {
    const link = document.createElement("a");
    link.href = "#" + section.id;
    link.textContent = section.icon + " " + section.title;
    nav.appendChild(link);

    const sec = document.createElement("section");
    sec.className = "menu-section";
    sec.id = section.id;

    sec.innerHTML = `
      <div class="section-head">
        <h2><span>${section.icon}</span>${section.title}</h2>
        <div class="scroll-ctrls">
          <button type="button" data-dir="-1" aria-label="Scroll ${section.title} left">&#8249;</button>
          <button type="button" data-dir="1" aria-label="Scroll ${section.title} right">&#8250;</button>
        </div>
      </div>
      <div class="row"></div>`;

    const row = sec.querySelector(".row");

    section.items.forEach(([name, desc, price, emoji]) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-img" style="background:${section.color}" aria-hidden="true">${emoji}</div>
        <div class="card-body">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="card-foot">
            <span class="price">${money(price)}</span>
            <button class="order-btn" type="button"
              data-name="${name.replace(/"/g, "&quot;")}" data-price="${price}">Order</button>
          </div>
        </div>`;
      row.appendChild(card);
    });

    sec.querySelectorAll(".scroll-ctrls button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.scrollBy({ left: Number(btn.dataset.dir) * 480, behavior: "smooth" });
      });
    });

    menu.appendChild(sec);
  });
}

/* =====================================================
   CART
   ===================================================== */
function addToCart(name, price) {
  const key = keyOf(name);
  if (!cart[key]) cart[key] = { name, price, qty: 0 };
  cart[key].qty += 1;
  saveCart();
  renderCart();
  toast(`${name} added`);
}

function changeQty(key, delta) {
  if (!cart[key]) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) delete cart[key];
  saveCart();
  renderCart();
}

function saveCart() { store.set("cart", cart); }

function cartTotal() {
  return Object.values(cart).reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const list = $("#cartList");
  const items = Object.entries(cart);
  list.innerHTML = "";

  items.forEach(([key, item]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="name">${item.name}</span>
      <span class="line-price">${money(item.price * item.qty)}</span>
      <div class="qty">
        <button type="button" data-key="${key}" data-d="-1" aria-label="Remove one">&minus;</button>
        <span>${item.qty}</span>
        <button type="button" data-key="${key}" data-d="1" aria-label="Add one">+</button>
      </div>`;
    list.appendChild(li);
  });

  const count = items.reduce((n, [, i]) => n + i.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(cartTotal());
  $("#cartEmpty").hidden = items.length > 0;
}

/* =====================================================
   DELIVERY / PICKUP
   ===================================================== */
function setMode(newMode) {
  mode = newMode;
  store.set("mode", mode);

  $$(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $$(".mode-label").forEach(el => (el.textContent = mode));

  const isDelivery = mode === "Delivery";
  $("#addressLabel").textContent = isDelivery ? "Delivery address" : "Pickup name / time (optional)";
  $("#custAddress").placeholder = isDelivery ? "Street, apt, city" : "e.g. ready by 6:30pm";
  $("#custAddress").autocomplete = isDelivery ? "street-address" : "off";
}

/* =====================================================
   MESSENGER ORDER
   ===================================================== */
function messengerUrl() {
  return "https://m.me/" + encodeURIComponent(CONFIG.messengerPage);
}

function buildOrderText() {
  const name = $("#custName").value.trim();
  const addr = $("#custAddress").value.trim();
  const notes = $("#custNotes").value.trim();

  const lines = [];
  lines.push(`New ${mode.toUpperCase()} order - ${CONFIG.restaurantName}`);
  lines.push("");
  Object.values(cart).forEach(i => {
    lines.push(`${i.qty} x ${i.name} - ${money(i.price * i.qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${money(cartTotal())}`);
  if (name) lines.push(`Name: ${name}`);
  if (addr) lines.push(mode === "Delivery" ? `Address: ${addr}` : `Pickup note: ${addr}`);
  if (notes) lines.push(`Notes: ${notes}`);
  return lines.join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
}

async function sendOnMessenger() {
  if (!Object.keys(cart).length) {
    toast("Add something to your order first");
    return;
  }
  if (mode === "Delivery" && !$("#custAddress").value.trim()) {
    toast("Please add your delivery address");
    $("#custAddress").focus();
    return;
  }

  const text = buildOrderText();
  const copied = await copyText(text);

  $("#hint").textContent = copied
    ? "Order copied. Paste it into Messenger and press send."
    : "Couldn't copy automatically. Please type your order in Messenger.";
  toast(copied ? "Order copied. Paste it in Messenger." : "Opening Messenger...");

  // Small delay so the person sees the toast before the new tab opens
  setTimeout(() => window.open(messengerUrl(), "_blank", "noopener"), 600);
}

/* =====================================================
   DRAWER + TOAST
   ===================================================== */
function openCart() {
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.style.overflow = "";
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* =====================================================
   INIT
   ===================================================== */
function applyConfig() {
  const tel = "tel:" + CONFIG.phoneDial;
  ["#phoneLink", "#phoneFooter", "#callBtn", "#mobileCall"].forEach(s => { $(s).href = tel; });
  $("#phoneText").textContent = CONFIG.phoneDisplay;
  $("#phoneFooter").textContent = CONFIG.phoneDisplay;

  ["#messengerTop", "#messengerHero", "#mobileMsg"].forEach(s => { $(s).href = messengerUrl(); });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderMenu();
  setMode(mode);
  renderCart();

  // Order buttons (event delegation)
  $("#menu").addEventListener("click", e => {
    const btn = e.target.closest(".order-btn");
    if (!btn) return;
    addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
    btn.classList.add("added");
    btn.textContent = "Added \u2713";
    setTimeout(() => { btn.classList.remove("added"); btn.textContent = "Order"; }, 900);
  });

  // Delivery / pickup
  $$(".mode-btn").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));

  // Cart controls
  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

  $("#cartList").addEventListener("click", e => {
    const b = e.target.closest("button[data-key]");
    if (b) changeQty(b.dataset.key, Number(b.dataset.d));
  });

  $("#clearCart").addEventListener("click", () => {
    cart = {};
    saveCart();
    renderCart();
  });

  $("#sendMessenger").addEventListener("click", sendOnMessenger);
});
