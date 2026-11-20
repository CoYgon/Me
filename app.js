(() => {
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll(".theme-btn[data-set-theme]"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-chip[data-filter]"));
  const projectCards = Array.from(document.querySelectorAll("#projects-grid .project-card"));
  const tiltCards = Array.from(document.querySelectorAll(".tilt-card"));
  const cursorRing = document.getElementById("cursor-ring");
  const yearLabel = document.getElementById("year-label");

  if (yearLabel) {
    yearLabel.textContent = `© ${new Date().getFullYear()}`;
  }

  const validThemes = ["navy", "bw", "yw"];

  function applyTheme(theme) {
    const chosen = validThemes.includes(theme) ? theme : "navy";
    root.setAttribute("data-theme", chosen);
    try {
      localStorage.setItem("coygon_port_theme", chosen);
    } catch (_) {}
    themeButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-theme") === chosen);
    });
  }

  let saved = "navy";
  try {
    saved = localStorage.getItem("coygon_port_theme") || "navy";
  } catch (_) {}
  applyTheme(saved);

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTheme(btn.getAttribute("data-set-theme") || "navy");
    });
  });

  // Kategori filtreleme
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      projectCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        card.classList.toggle("is-hidden", target !== "all" && cat !== target);
      });
    });
  });

  // Fare hareketine duyarlı ortam ışığı ve halka
  window.addEventListener(
    "pointermove",
    (e) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      if (cursorRing) {
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
      }
    },
    { passive: true }
  );

  // Kartlarda hafif fare eğimi (tilt)
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      card.style.setProperty("--ry", `${nx * 7}deg`);
      card.style.setProperty("--rx", `${-ny * 7}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();