/* Twisted Loops — shop page rendering + filters */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".product-grid");
  const controls = document.querySelector(".shop-controls");
  if (!grid || !window.PRODUCTS) return;

  // Build category list
  const categories = ["all", ...Array.from(new Set(window.PRODUCTS.map((p) => p.category)))];
  if (controls) {
    controls.innerHTML = categories.map((c, i) => `
      <button class="filter-btn ${i === 0 ? "active" : ""}" data-filter="${c}">${c}</button>
    `).join("");
  }

  function render(filter) {
    const items = window.PRODUCTS.filter((p) => filter === "all" || p.category === filter);
    grid.innerHTML = items.map((p) => `
      <article class="product" data-id="${p.id}">
        <div class="product-media" style="background-image:url('${p.image}')">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        </div>
        <h3>${p.name}</h3>
        <div class="price">${window.formatINR(p.price)}</div>
        <button class="add" data-add="${p.id}">add to bag</button>
      </article>
    `).join("");
  }

  render("all");

  if (controls) {
    controls.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      controls.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.getAttribute("data-filter"));
    });
  }
});
