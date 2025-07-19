let cart = [];

function getQty(id) {
  return parseInt(document.getElementById(`qty-${id}`)?.textContent) || 1;
}

function increaseQty(id) {
  const el = document.getElementById(`qty-${id}`);
  if (el) el.textContent++;
}

function decreaseQty(id) {
  const el = document.getElementById(`qty-${id}`);
  if (el && parseInt(el.textContent) > 1) el.textContent--;
}

// ✨ حركة طيران إلى السلة
function flyToCart(button) {
  const cartIcon = document.getElementById("cart-fab");
  if (!cartIcon || !button) return;

  const clone = button.cloneNode(true);
  const rect = button.getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.zIndex = 9999;
  clone.style.transition = "all 0.6s ease";
  clone.style.transform = "scale(1.4)";
  clone.style.opacity = "0.8";
  document.body.appendChild(clone);

  const cartRect = cartIcon.getBoundingClientRect();
  setTimeout(() => {
    clone.style.left = `${cartRect.left + 10}px`;
    clone.style.top = `${cartRect.top + 10}px`;
    clone.style.transform = "scale(0.3)";
    clone.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    document.body.removeChild(clone);
  }, 800);
}

// 🛒 إضافة عنصر إلى السلة
function addToCart(item, button = null) {
  if (!item || !item.name || item.qty < 1) return;

  const existing = cart.find((i) => i.name === item.name);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  if (button) flyToCart(button);
  updateCartDisplay();
  document.getElementById("cart-container")?.classList.add("show");

}

// ❌ إزالة عنصر من السلة
function removeFromCart(name) {
  cart = cart.filter((i) => i.name !== name);
  updateCartDisplay();
}

// 🔄 تحديث واجهة السلة
function updateCartDisplay() {
  const box = document.getElementById("cart-container");
  const body = box?.querySelector(".cart-body");
  if (!body) return;

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const counter = document.getElementById("cart-counter");
  if (counter) counter.textContent = totalQty;

  if (cart.length === 0) {
    body.innerHTML = `<p>السلة فارغة</p>`;
    return;
  }

  body.innerHTML =
    cart
      .map(
        (i) => `
      <div class="cart-item">
        <span>${i.name} × ${i.qty} = ${i.qty * i.price} ل.س</span>
        <button onclick="removeFromCart('${i.name}')">❌</button>
      </div>
    `
      )
      .join("") +
    `<p><strong>المجموع: ${totalPrice} ل.س</strong><br/><small>  </small></p>`;
}

// 📦 تبديل عرض السلة (اختياري إذا بدك تفعليه)
function toggleCart() {
  const el = document.getElementById("cart-container");
  if (el) el.classList.toggle("show");
}

// 📤 إرسال الطلب
async function submitOrder() {
  const table = document.getElementById("table")?.value;
  const now = new Date().toLocaleString();

  if (!table) return alert("يرجى إدخال رقم الطاولة");

  for (const item of cart) {
    const body = {
      "رقم الطاولة": table,
      الصنف: item.name,
      الكمية: item.qty,
      الوقت: now,
      الحالة: "قيد التحضير",
    };

    await fetch(SHEET_API, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
document.addEventListener("DOMContentLoaded", () => {
  // 🔍 التحقق من وجود رقم طاولة بالباركود (بالرابط)
  const params = new URLSearchParams(window.location.search);
  const tableNum = params.get("table");

  if (tableNum) {
    // ✅ تم الدخول عبر باركود فيه الرقم
    document.getElementById("table").value = tableNum;
    console.log(`🚀 رقم الطاولة تم التقاطه من الرابط: ${tableNum}`);
  } else {
    // ❌ الزبون فتح الموقع بدون باركود → نطلب منه إدخال الرقم
    alert("يرجى إدخال رقم الطاولة قبل إتمام الطلب 🙏");
  }
});

  alert("✅ تم إرسال الطلب!");
  cart = [];
  updateCartDisplay();
}

// 📍 تفعيل السحب إلى القسم المحدد
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
document.getElementById("cart-fab").onclick = () => {
  document.getElementById("cart-container").classList.toggle("show");
};
function toggleSectionMenu() {
  document.getElementById("section-menu").classList.toggle("hidden");
}

function selectSection(sectionName) {
  const sectionId = getSectionId(sectionName);
  if (sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  } else {
    console.log("❌ القسم غير معرف:", sectionName);
  }
  toggleSectionMenu();
}window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 600) {
    document.getElementById("cart-container")?.classList.add("show");
  }
});
