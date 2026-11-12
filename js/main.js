/* Twisted Loops — shared UI behavior */

document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // Newsletter form
  document.querySelectorAll("form.newsletter-form").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = f.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      // In production, POST this to Mailchimp / ConvertKit / your backend.
      // For now, fake-success.
      const note = f.parentElement.querySelector(".form-note");
      if (note) note.textContent = "thanks — you're on the list ✓";
      f.reset();
    });
  });

  // Footer year
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
