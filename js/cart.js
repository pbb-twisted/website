/* Twisted Loops — cart + checkout
   - Cart is persisted in localStorage.
   - Checkout uses Razorpay Standard Checkout (test mode by default).
   - Replace RAZORPAY_KEY_ID in js/config.js with your own Key ID.
   - For real orders, you'll also want a tiny backend to create orders
     with your Key Secret. See README.md.
*/

(function () {
  const STORAGE_KEY = "twistedloops.cart.v1";

  const state = {
    items: load(),
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }

  function findProduct(id) {
    return (window.PRODUCTS || []).find((p) => p.id === id);
  }

  function addItem(id) {
    const existing = state.items.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else state.items.push({ id, qty: 1 });
    save();
    render();
    openCart();
    toast("added to bag");
  }
  function removeItem(id) {
    state.items = state.items.filter((i) => i.id !== id);
    save();
    render();
  }
  function setQty(id, qty) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    save();
    render();
  }
  function totalCount() {
    return state.items.reduce((n, i) => n + i.qty, 0);
  }
  function totalAmount() {
    return state.items.reduce((sum, i) => {
      const p = findProduct(i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  }

  function openCart() {
    const d = document.querySelector(".cart-drawer");
    const b = document.querySelector(".cart-backdrop");
    if (d) d.classList.add("open");
    if (b) b.classList.add("open");
  }
  function closeCart() {
    const d = document.querySelector(".cart-drawer");
    const b = document.querySelector(".cart-backdrop");
    if (d) d.classList.remove("open");
    if (b) b.classList.remove("open");
  }

  function render() {
    // count badge in header(s)
    document.querySelectorAll(".nav-cart .count").forEach((el) => {
      el.textContent = totalCount();
    });

    const body = document.querySelector(".cart-body");
    const totalEl = document.querySelector(".cart-total .amount");
    const checkoutBtn = document.querySelector(".cart-checkout");
    if (!body) return;

    if (state.items.length === 0) {
      body.innerHTML = '<div class="cart-empty">your bag is empty.<br>start adding some handmade goodness.</div>';
      if (totalEl) totalEl.textContent = window.formatINR(0);
      if (checkoutBtn) checkoutBtn.setAttribute("disabled", "disabled");
      return;
    }

    body.innerHTML = state.items.map((it) => {
      const p = findProduct(it.id);
      if (!p) return "";
      const line = p.price * it.qty;
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="thumb" style="background-image:url('${p.image}')"></div>
          <div>
            <div class="name">${p.name}</div>
            <div class="meta">
              <span class="qty">
                <button data-action="dec" aria-label="decrease">−</button>
                <span>${it.qty}</span>
                <button data-action="inc" aria-label="increase">+</button>
              </span>
              <button class="remove" data-action="remove">remove</button>
            </div>
          </div>
          <div class="line-total">${window.formatINR(line)}</div>
        </div>`;
    }).join("");

    if (totalEl) totalEl.textContent = window.formatINR(totalAmount());
    if (checkoutBtn) checkoutBtn.removeAttribute("disabled");
  }

  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1600);
  }

  /* ---------------- Razorpay checkout ---------------- */

  function openCheckout() {
    if (state.items.length === 0) return;
    const amountINR = totalAmount();
    const key = (window.TL_CONFIG && window.TL_CONFIG.razorpayKeyId) || "";

    if (!key) {
      alert(
        "Payment isn't configured yet.\n\n" +
        "Add your Razorpay Key ID in js/config.js (window.TL_CONFIG.razorpayKeyId).\n\n" +
        "For now, your order would have been: " + window.formatINR(amountINR)
      );
      return;
    }

    // Razorpay Standard Checkout in "amount mode" — works without a backend,
    // but for real production you should create an Order on your server using
    // your Key Secret and pass order_id here. See README.md.
    const options = {
      key: key,
      amount: amountINR * 100, // paise
      currency: "INR",
      name: "Twisted Loops",
      description: "Handmade crochet goods",
      image: "", // optional logo URL
      handler: function (response) {
        // success
        state.items = [];
        save();
        render();
        closeCart();
        toast("payment received — thank you!");
        console.log("Razorpay payment id:", response.razorpay_payment_id);
      },
      prefill: {},
      notes: {
        items: state.items.map((i) => `${i.qty}x ${i.id}`).join(", "),
      },
      theme: { color: "#4e5a3a" },
      modal: {
        ondismiss: function () { toast("checkout closed"); }
      }
    };

    if (typeof Razorpay === "undefined") {
      alert("Razorpay script didn't load. Check your internet connection.");
      return;
    }
    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (r) {
      console.warn("payment failed", r);
      toast("payment failed, try again");
    });
    rzp.open();
  }

  /* ---------------- Event wiring ---------------- */

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      e.preventDefault();
      addItem(addBtn.getAttribute("data-add"));
      return;
    }

    if (e.target.closest(".nav-cart")) { e.preventDefault(); openCart(); return; }
    if (e.target.closest(".cart-close") || e.target.classList.contains("cart-backdrop")) {
      closeCart(); return;
    }

    const itemEl = e.target.closest(".cart-item");
    if (itemEl) {
      const id = itemEl.getAttribute("data-id");
      const action = e.target.getAttribute("data-action");
      if (action === "remove") { removeItem(id); return; }
      if (action === "inc" || action === "dec") {
        const current = state.items.find((i) => i.id === id);
        if (!current) return;
        setQty(id, current.qty + (action === "inc" ? 1 : -1));
        return;
      }
    }

    if (e.target.closest(".cart-checkout")) {
      e.preventDefault();
      openCheckout();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  document.addEventListener("DOMContentLoaded", render);

  // expose minimal API
  window.TL_CART = { add: addItem, open: openCart, close: closeCart };
})();
