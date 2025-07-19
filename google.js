const SHEET_API = "https://script.google.com/macros/s/AKfycbyjFfu4qSG31ORKMGAtfSTD-jMS6sT6oTKyl_5J1abQJBPU5fF8rFL0TlLHV9SA59-pBw/exec";

// 🧭 الأقسام والـ id داخل الصفحة
function getSectionId(cat) {
  const map = {
    "عروض اليوم": "offers-section",
    "بيتزا": "pizza-section",
    "حلويات": "desserts-section",
    "كوكتيلات": "koktel-section",
    "فطور": "ftor-section",
    "سلطات": "salads-section",
    "شوربات": "soups-section",
    "مقبلات": "appetizers-section",
    "أطباق رئيسية": "main-dishes-section",
    "أراكيل": "arakeel-section",
    "مشروبات باردة": "cold-drinks-section",
    "مشروبات ساخنة": "hot-drinks-section"
  };
  return map[cat?.trim()] || null;
}

// 🎨 كلاس التصميم حسب القسم
function getCardClass(cat) {
  const map = {
    "عروض اليوم": "offers",
    "بيتزا": "pizza",
    "حلويات": "desserts",
    "كوكتيلات": "koktel",
    "فطور": "ftor",
    "سلطات": "salads",
    "شوربات": "soups",
    "مقبلات": "appetizers",
    "أطباق رئيسية": "main",
    "أراكيل": "arakeel",
    "مشروبات باردة": "cold",
    "مشروبات ساخنة": "hot"
  };
  return map[cat?.trim()] || "default";
}

// 🗓️ تنسيق التاريخ بالعربية السورية
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SY", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

// 🚀 تحميل البيانات وتجميعها حسب القسم
async function loadMenuAndGroup() {
  try {
    const res = await fetch(`${SHEET_API}?type=menu`);
    const items = await res.json();
    const grouped = {};

    items
      .filter((i) => {
        const cat = i["القسم"]?.trim();
        const validUntil = i["صالح حتى"];
        const active = i["فعال؟"]?.trim()?.toLowerCase();

        if (cat === "عروض اليوم") {
          if (!validUntil) {
            console.log("⚠️ عرض بدون تاريخ:", i["الاسم"]);
            return true;
          }
          const now = new Date();
          const expiry = new Date(validUntil);
          const isActive = expiry >= now;
          if (!isActive) {
            console.log("⏳ عرض منتهي:", i["الاسم"]);
          }
          return isActive;
        }

        return active === "yes";
      })
      .forEach((i) => {
        const cat = i["القسم"]?.trim() || "أخرى";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(i);
      });

    Object.keys(grouped).forEach((cat) => {
      const sectionId = getSectionId(cat);
      if (!sectionId) {
        console.log("❌ قسم غير معروف:", cat);
        return;
      }

      const section = document.getElementById(sectionId);
      const grid = section?.querySelector(".items-grid");
      if (!grid) return;

      grid.innerHTML = grouped[cat]
        .map((i) => {
          const cardClass = getCardClass(i["القسم"]?.trim());
          const name = i["الاسم"] || i["عنوان العرض"] || "بدون اسم";
          const desc = i["الوصف"] || i["التفاصيل"] || "";
          const price = i["السعر"] || 0;
          // const image = i["الصورة"];
          const validUntil = i["صالح حتى"]
            ? `<small>⏳ العرض ساري حتى: ${formatDate(i["صالح حتى"])}</small>`
            : "";

          return `
            <div class="item-card ${cardClass}">
              <h3>${name}</h3>
              <p>${desc}</p>
              <span>${price} ل.س</span>
              ${validUntil}
              <div class="counter">
                <button onclick="decreaseQty('${name}')">-</button>
                <span id="qty-${name}">1</span>
                <button onclick="increaseQty('${name}')">+</button>
              </div>
                            <div class="btn">

              <button onclick="addToCart({ name: '${name}', price: ${price}, qty: getQty('${name}') }, this)">
                🛒 أضف للسلة
              </button>
            </div>
            </div>
          `;
        })
        .join("");
    });
  } catch (err) {
    console.error("❌ خطأ في جلب البيانات:", err);
  }
}

// ⏱️ تشغيل عند بدء الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadMenuAndGroup();
});
// ⏱️ تحديث تلقائي كل 30 ثانية
setInterval(() => {
  console.log("🔄 تحديث القائمة التلقائي...");
  loadMenuAndGroup();
}, 30000); // ← 30 ألف ميلي ثانية = 30 ثانية