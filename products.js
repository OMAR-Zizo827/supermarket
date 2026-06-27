/* ===========================================================
   PRODUCT CATALOG
   Categories mirror real market "stalls": Produce, Dairy & Eggs,
   Bakery, Meat & Poultry, Pantry, Beverages, Snacks, Household
   =========================================================== */

const CATEGORIES = [
  { id: "deals",     label: "Deals",            emoji: "🔥" },
  { id: "produce",   label: "Produce",          emoji: "🥬" },
  { id: "dairy",     label: "Dairy & Eggs",     emoji: "🥚" },
  { id: "bakery",    label: "Bakery",           emoji: "🍞" },
  { id: "meat",      label: "Meat & Poultry",   emoji: "🍗" },
  { id: "pantry",    label: "Pantry",           emoji: "🫙" },
  { id: "beverages", label: "Beverages",        emoji: "🧃" },
  { id: "snacks",    label: "Snacks",           emoji: "🍪" },
  { id: "household", label: "Household",        emoji: "🧴" },
];

// Generate a lightweight inline SVG placeholder so every product image renders
// instantly with zero network dependency — tinted by category, icon by item.
const CAT_COLORS = {
  produce:   { bg: "#E7EFE1", fg: "#1F3D2B" },
  dairy:     { bg: "#FFF6E8", fg: "#C99A3B" },
  bakery:    { bg: "#FBEFE3", fg: "#B5651D" },
  meat:      { bg: "#FBEAE8", fg: "#D63B2F" },
  pantry:    { bg: "#F3ECDC", fg: "#8A6A2F" },
  beverages: { bg: "#E8F1F7", fg: "#2C6E8E" },
  snacks:    { bg: "#F6E9E0", fg: "#C2622B" },
  household: { bg: "#EDEAF6", fg: "#5C4D9E" },
};

function img(cat, emoji) {
  const c = CAT_COLORS[cat] || { bg: "#E7EFE1", fg: "#1F3D2B" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${c.bg}"/>
    <circle cx="200" cy="120" r="64" fill="${c.fg}" opacity="0.12"/>
    <text x="200" y="148" font-size="72" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const PRODUCTS = [
  // ---------------- PRODUCE ----------------
  { id: "p1", cat: "produce", name: "Vine Tomatoes", unit: "1 kg", price: 28, oldPrice: null, img: img("produce","🍅"), tag: null, desc: "Sun-ripened vine tomatoes, hand-picked this morning. Great for salads, sauces, or just slicing with a pinch of salt." , stock: 42},
  { id: "p2", cat: "produce", name: "Baladi Cucumbers", unit: "1 kg", price: 18, oldPrice: 24, img: img("produce","🥒"), tag: "sale", desc: "Crisp local cucumbers, perfect for salads or pickling.", stock: 35},
  { id: "p3", cat: "produce", name: "Ripe Bananas", unit: "1 kg", price: 22, oldPrice: null, img: img("produce","🍌"), tag: null, desc: "Naturally ripened bananas, sweet and ready to eat.", stock: 60},
  { id: "p4", cat: "produce", name: "Red Onions", unit: "1 kg", price: 15, oldPrice: null, img: img("produce","🧅"), tag: null, desc: "Firm red onions with a mild sweetness, ideal for salads and cooking.", stock: 50},
  { id: "p5", cat: "produce", name: "Baby Spinach", unit: "200 g", price: 19, oldPrice: null, img: img("produce","🥬"), tag: "new", desc: "Washed and ready baby spinach leaves — tender enough for salads, sturdy enough for sautéing.", stock: 24},
  { id: "p6", cat: "produce", name: "Egyptian Lemons", unit: "500 g", price: 14, oldPrice: null, img: img("produce","🍋"), tag: null, desc: "Juicy lemons, fragrant zest, freshly harvested.", stock: 40},
  { id: "p7", cat: "produce", name: "Bell Peppers Mix", unit: "500 g", price: 26, oldPrice: 32, img: img("produce","🫑"), tag: "sale", desc: "A colourful mix of red, yellow and green peppers.", stock: 30},
  { id: "p8", cat: "produce", name: "Avocados", unit: "2 pcs", price: 45, oldPrice: null, img: img("produce","🥑"), tag: "new", desc: "Creamy hass avocados, picked at the perfect ripeness window.", stock: 22},
  { id: "p9", cat: "produce", name: "Garlic Bulbs", unit: "250 g", price: 16, oldPrice: null, img: img("produce","🧄"), tag: null, desc: "Plump, aromatic garlic bulbs.", stock: 38},
  { id: "p10", cat: "produce", name: "Strawberries", unit: "250 g", price: 35, oldPrice: 42, img: img("produce","🍓"), tag: "sale", desc: "Sweet, fragrant strawberries — great on their own or in a smoothie.", stock: 18},

  // ---------------- DAIRY & EGGS ----------------
  { id: "d1", cat: "dairy", name: "Full Cream Milk", unit: "1 L", price: 32, oldPrice: null, img: img("dairy","🥛"), tag: null, desc: "Pasteurised full cream milk, rich and creamy.", stock: 50},
  { id: "d2", cat: "dairy", name: "Farm Fresh Eggs", unit: "30 pcs", price: 95, oldPrice: 110, img: img("dairy","🥚"), tag: "sale", desc: "Free-range eggs, tray of 30, sourced from local farms.", stock: 26},
  { id: "d3", cat: "dairy", name: "White Labneh", unit: "500 g", price: 48, oldPrice: null, img: img("dairy","🧈"), tag: null, desc: "Thick, tangy strained yoghurt — a breakfast staple.", stock: 20},
  { id: "d4", cat: "dairy", name: "Halloumi Cheese", unit: "250 g", price: 65, oldPrice: null, img: img("dairy","🧀"), tag: "new", desc: "Salty, springy halloumi — fries up beautifully golden.", stock: 16},
  { id: "d5", cat: "dairy", name: "Greek Yoghurt", unit: "400 g", price: 38, oldPrice: null, img: img("dairy","🥣"), tag: null, desc: "Thick and creamy, high in protein, mild tang.", stock: 28},
  { id: "d6", cat: "dairy", name: "Salted Butter", unit: "200 g", price: 42, oldPrice: 50, img: img("dairy","🧈"), tag: "sale", desc: "Creamy churned butter for baking and spreading.", stock: 24},

  // ---------------- BAKERY ----------------
  { id: "b1", cat: "bakery", name: "Fino Bread", unit: "5 pcs", price: 12, oldPrice: null, img: img("bakery","🥖"), tag: null, desc: "Soft fino rolls, baked this morning.", stock: 45},
  { id: "b2", cat: "bakery", name: "Whole Wheat Baladi", unit: "5 pcs", price: 8, oldPrice: null, img: img("bakery","🫓"), tag: null, desc: "Traditional whole wheat flatbread.", stock: 50},
  { id: "b3", cat: "bakery", name: "Croissants", unit: "4 pcs", price: 56, oldPrice: 64, img: img("bakery","🥐"), tag: "sale", desc: "Buttery, flaky croissants baked fresh daily.", stock: 14},
  { id: "b4", cat: "bakery", name: "Sourdough Loaf", unit: "1 loaf", price: 49, oldPrice: null, img: img("bakery","🍞"), tag: "new", desc: "Naturally leavened sourdough with a crisp crust.", stock: 12},
  { id: "b5", cat: "bakery", name: "Cinnamon Rolls", unit: "3 pcs", price: 60, oldPrice: null, img: img("bakery","🍩"), tag: null, desc: "Soft, gooey cinnamon rolls with a sweet glaze.", stock: 10},

  // ---------------- MEAT & POULTRY ----------------
  { id: "m1", cat: "meat", name: "Chicken Breast", unit: "1 kg", price: 145, oldPrice: 165, img: img("meat","🍗"), tag: "sale", desc: "Boneless, skinless chicken breast, trimmed and ready to cook.", stock: 20},
  { id: "m2", cat: "meat", name: "Minced Beef", unit: "500 g", price: 120, oldPrice: null, img: img("meat","🥩"), tag: null, desc: "Freshly minced beef, 85% lean.", stock: 18},
  { id: "m3", cat: "meat", name: "Lamb Chops", unit: "1 kg", price: 280, oldPrice: null, img: img("meat","🍖"), tag: "new", desc: "Tender lamb chops, trimmed and ready for the grill.", stock: 8},
  { id: "m4", cat: "meat", name: "Whole Chicken", unit: "1.4 kg avg", price: 130, oldPrice: null, img: img("meat","🐔"), tag: null, desc: "Whole farm-raised chicken, cleaned and ready.", stock: 15},

  // ---------------- PANTRY ----------------
  { id: "pa1", cat: "pantry", name: "Egyptian Rice", unit: "2 kg", price: 58, oldPrice: null, img: img("pantry","🍚"), tag: null, desc: "Short-grain rice, the kitchen staple.", stock: 40},
  { id: "pa2", cat: "pantry", name: "Extra Virgin Olive Oil", unit: "1 L", price: 175, oldPrice: 195, img: img("pantry","🫒"), tag: "sale", desc: "Cold-pressed extra virgin olive oil.", stock: 22},
  { id: "pa3", cat: "pantry", name: "Red Lentils", unit: "1 kg", price: 45, oldPrice: null, img: img("pantry","🫘"), tag: null, desc: "Split red lentils, perfect for soups.", stock: 35},
  { id: "pa4", cat: "pantry", name: "Pasta Penne", unit: "500 g", price: 22, oldPrice: null, img: img("pantry","🍝"), tag: null, desc: "Durum wheat penne pasta.", stock: 50},
  { id: "pa5", cat: "pantry", name: "Tahini", unit: "400 g", price: 55, oldPrice: null, img: img("pantry","🫙"), tag: "new", desc: "Stone-ground sesame tahini, smooth and nutty.", stock: 19},
  { id: "pa6", cat: "pantry", name: "Honey", unit: "500 g", price: 95, oldPrice: 115, img: img("pantry","🍯"), tag: "sale", desc: "Raw, unfiltered honey.", stock: 14},

  // ---------------- BEVERAGES ----------------
  { id: "bv1", cat: "beverages", name: "Orange Juice", unit: "1 L", price: 38, oldPrice: null, img: img("beverages","🧃"), tag: null, desc: "Freshly squeezed, no added sugar.", stock: 30},
  { id: "bv2", cat: "beverages", name: "Sparkling Water", unit: "6x330ml", price: 48, oldPrice: 56, img: img("beverages","💧"), tag: "sale", desc: "Crisp sparkling water, pack of 6.", stock: 26},
  { id: "bv3", cat: "beverages", name: "Arabic Coffee", unit: "250 g", price: 68, oldPrice: null, img: img("beverages","☕"), tag: null, desc: "Finely ground coffee with a hint of cardamom.", stock: 22},
  { id: "bv4", cat: "beverages", name: "Mint Tea Bags", unit: "25 bags", price: 30, oldPrice: null, img: img("beverages","🍵"), tag: null, desc: "Black tea blended with spearmint.", stock: 34},

  // ---------------- SNACKS ----------------
  { id: "s1", cat: "snacks", name: "Mixed Nuts", unit: "300 g", price: 85, oldPrice: null, img: img("snacks","🥜"), tag: null, desc: "Roasted almonds, cashews and pistachios.", stock: 20},
  { id: "s2", cat: "snacks", name: "Potato Chips", unit: "150 g", price: 25, oldPrice: 30, img: img("snacks","🍟"), tag: "sale", desc: "Crispy salted potato chips.", stock: 40},
  { id: "s3", cat: "snacks", name: "Dark Chocolate", unit: "100 g", price: 48, oldPrice: null, img: img("snacks","🍫"), tag: "new", desc: "70% cocoa dark chocolate bar.", stock: 25},
  { id: "s4", cat: "snacks", name: "Dates", unit: "500 g", price: 60, oldPrice: null, img: img("snacks","🌴"), tag: null, desc: "Soft, sweet Medjool-style dates.", stock: 28},

  // ---------------- HOUSEHOLD ----------------
  { id: "h1", cat: "household", name: "Dish Soap", unit: "750 ml", price: 35, oldPrice: null, img: img("household","🧴"), tag: null, desc: "Grease-cutting dish soap, lemon scent.", stock: 30},
  { id: "h2", cat: "household", name: "Paper Towels", unit: "4 rolls", price: 58, oldPrice: 68, img: img("household","🧻"), tag: "sale", desc: "Absorbent, tear-resistant paper towels.", stock: 24},
  { id: "h3", cat: "household", name: "Laundry Detergent", unit: "3 kg", price: 145, oldPrice: null, img: img("household","🧼"), tag: null, desc: "Powder detergent for everyday laundry.", stock: 18},
  { id: "h4", cat: "household", name: "Trash Bags", unit: "30 pcs", price: 28, oldPrice: null, img: img("household","🗑️"), tag: null, desc: "Heavy-duty trash bags, medium size.", stock: 32},
];

// Convenience: deals = anything with oldPrice or tag "sale"
function getDeals() {
  return PRODUCTS.filter(p => p.oldPrice || p.tag === "sale");
}
