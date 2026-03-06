/**
 * script.js
 * ============================================================
 * Main JavaScript — shared utilities + page-specific logic.
 * ============================================================
 */

/* ═══════════════════════════════════════════════════════════
   0. UTILITIES
══════════════════════════════════════════════════════════════ */

/** Format a number into a short human-readable string */
function formatNumber(n) {
    const num = parseInt(n, 10);
    if (isNaN(num)) return n;
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return n.toString();
}

/** Generate star rating HTML */
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < 5; i++) {
        if (i < full) html += '<i class="star full">★</i>';
        else if (i === full && half) html += '<i class="star half">★</i>';
        else html += '<i class="star empty">☆</i>';
    }
    return html;
}

/** Get URL query parameter */
function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

/** Throttle function */
function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= ms) { last = now; fn.apply(this, args); }
    };
}

/* ═══════════════════════════════════════════════════════════
   1. NAVIGATION — active link + mobile hamburger
══════════════════════════════════════════════════════════════ */

(function initNav() {
    const navLinks = document.querySelectorAll(".nav-link");
    const current = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        if (link.getAttribute("href") === current) link.classList.add("active");
    });

    // Hamburger
    const toggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (toggle && navMenu) {
        toggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            toggle.classList.toggle("open");
        });
        // Close on link click
        navMenu.querySelectorAll("a").forEach(a =>
            a.addEventListener("click", () => { navMenu.classList.remove("open"); toggle.classList.remove("open"); })
        );
    }

    // Scroll shrink
    window.addEventListener("scroll", throttle(() => {
        document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 60);
    }, 100));
})();

/* ═══════════════════════════════════════════════════════════
   2. LOADING SCREEN
══════════════════════════════════════════════════════════════ */

(function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("hide");
            setTimeout(() => loader.remove(), 600);
        }, 900);
    });
})();

/* ═══════════════════════════════════════════════════════════
   3. INTERSECTION OBSERVER — scroll-reveal
══════════════════════════════════════════════════════════════ */

(function initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   4. HOME PAGE — hero + featured apps
══════════════════════════════════════════════════════════════ */

(function initHomePage() {
    if (!document.getElementById("featured-apps-grid")) return;

    const grid = document.getElementById("featured-apps-grid");

    // Show up to 4 featured apps (or all if fewer)
    const featured = apps.slice(0, 4);

    featured.forEach((app, idx) => {
        const card = createAppCard(app);
        card.style.animationDelay = `${idx * 0.12}s`;
        grid.appendChild(card);
    });

    // Stats counter animation
    document.querySelectorAll(".stat-number[data-target]").forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + (el.dataset.suffix || "");
            if (current >= target) clearInterval(interval);
        }, 25);
    });
})();

/* ═══════════════════════════════════════════════════════════
   5. APPS PAGE — grid + search + filter
══════════════════════════════════════════════════════════════ */

(function initAppsPage() {
    const grid = document.getElementById("apps-grid");
    const searchInput = document.getElementById("search-input");
    const filterBar = document.getElementById("filter-bar");
    const countEl = document.getElementById("apps-count");

    if (!grid) return;

    let activeCategory = "All";
    let searchQuery = "";

    /* Build category chips */
    if (filterBar) {
        categories.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = "filter-chip" + (cat === "All" ? " active" : "");
            btn.textContent = cat;
            btn.setAttribute("aria-pressed", cat === "All" ? "true" : "false");
            btn.addEventListener("click", () => {
                document.querySelectorAll(".filter-chip").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
                btn.classList.add("active");
                btn.setAttribute("aria-pressed", "true");
                activeCategory = cat;
                renderGrid();
            });
            filterBar.appendChild(btn);
        });
    }

    /* Render matching apps */
    function renderGrid() {
        const filtered = apps.filter(app => {
            const matchCat = activeCategory === "All" || app.category === activeCategory;
            const matchSearch = !searchQuery ||
                app.name.toLowerCase().includes(searchQuery) ||
                app.description.toLowerCase().includes(searchQuery) ||
                (app.tags || []).some(t => t.toLowerCase().includes(searchQuery));
            return matchCat && matchSearch;
        });

        grid.innerHTML = "";

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="no-results"><p>😔 No apps found for "<strong>${searchQuery}</strong>"</p></div>`;
        } else {
            filtered.forEach((app, idx) => {
                const card = createAppCard(app);
                card.style.animationDelay = `${idx * 0.08}s`;
                grid.appendChild(card);
            });
        }

        if (countEl) countEl.textContent = `${filtered.length} app${filtered.length !== 1 ? "s" : ""}`;
    }

    /* Search */
    if (searchInput) {
        searchInput.addEventListener("input", throttle(() => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderGrid();
        }, 200));
    }

    renderGrid();
})();

/* ═══════════════════════════════════════════════════════════
   6. APP DETAILS PAGE
══════════════════════════════════════════════════════════════ */

(function initDetailsPage() {
    const container = document.getElementById("app-details-container");
    if (!container) return;

    const id = getParam("id");
    const app = apps.find(a => a.id === id);

    if (!app) {
        container.innerHTML = `<div class="not-found"><h2>App not found</h2><a href="apps.html" class="btn btn-primary">← Back to Apps</a></div>`;
        return;
    }

    // Set page title & meta
    document.title = `${app.name} — App Download`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", app.description);

    // Update back-link
    const backLink = document.getElementById("back-link");
    if (backLink) backLink.href = "apps.html";

    container.innerHTML = buildDetailsHTML(app);

    // Download button ripple + track
    container.querySelectorAll(".btn-download").forEach(btn => {
        btn.addEventListener("click", function (e) {
            rippleEffect(e, this);
        });
    });

    // Screenshots lightbox
    initLightbox();
})();

function buildDetailsHTML(app) {
    const featuresList = (app.features || []).map(f => `<li><span class="feature-icon">✦</span>${f}</li>`).join("");
    const tagsList = (app.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

    const screenshotSection = app.screenshots && app.screenshots.length > 0
        ? `<section class="screenshots-section">
         <h3 class="section-subtitle">Screenshots</h3>
         <div class="screenshots-strip">
           ${app.screenshots.map((s, i) => `<img src="${s}" alt="${app.name} screenshot ${i + 1}" class="screenshot-thumb" loading="lazy" onclick="openLightbox('${s}')">`).join("")}
         </div>
       </section>`
        : "";

    return `
    <div class="details-hero" style="--app-color:${app.color}">
      <div class="details-hero-glow" style="background:${app.color}"></div>

      <div class="details-hero-inner">
        <div class="details-app-icon-wrap">
          <img src="${app.icon}" alt="${app.name} icon" class="details-app-icon" onerror="this.src='images/default-icon.png'">
          <div class="details-icon-glow" style="background:${app.color}"></div>
        </div>

        <div class="details-app-meta">
          <h1 class="details-app-name">${app.name}</h1>
          <p class="details-app-tagline">${app.tagline}</p>

          <div class="details-meta-row">
            <div class="meta-item"><span class="meta-label">Version</span><span class="meta-value">${app.version}</span></div>
            <div class="meta-item"><span class="meta-label">Downloads</span><span class="meta-value">${app.downloads}</span></div>
            <div class="meta-item"><span class="meta-label">Rating</span><span class="meta-value">${renderStars(app.rating)} ${app.rating}</span></div>
            <div class="meta-item"><span class="meta-label">Category</span><span class="meta-value">${app.category}</span></div>
          </div>

          <div class="tags-row">${tagsList}</div>

          <div class="download-buttons-row">
            ${app.android 
              ? `<a href="${app.android}" download class="btn btn-download btn-android" aria-label="Download Android APK">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M2.979 8.25h18.042l-.87 9.565A2.25 2.25 0 0 1 17.91 20H6.09a2.25 2.25 0 0 1-2.241-2.185L2.979 8.25zM8.25 5.25a3.75 3.75 0 1 1 7.5 0H8.25z"/></svg>
                  <span><small>Download for</small>Android APK</span>
                </a>`
              : `<button class="btn btn-download btn-android" onclick="alert('Coming Soon! 🚀')" aria-label="Coming Soon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M2.979 8.25h18.042l-.87 9.565A2.25 2.25 0 0 1 17.91 20H6.09a2.25 2.25 0 0 1-2.241-2.185L2.979 8.25zM8.25 5.25a3.75 3.75 0 1 1 7.5 0H8.25z"/></svg>
                  <span><small>Coming Soon</small>Android APK</span>
                </button>`
            }
          </div>

          <div class="os-requirements">
            <span>🤖 ${app.minOS}</span>
            <span>📦 ${app.size}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="details-body">
      <div class="details-grid">
        <section class="description-section">
          <h3 class="section-subtitle">About This App</h3>
          <p class="app-description-long">${(app.longDescription || app.description).replace(/\n/g, "<br>")}</p>
        </section>

        <section class="features-section">
          <h3 class="section-subtitle">Key Features</h3>
          <ul class="features-list">${featuresList}</ul>
        </section>
      </div>

      ${screenshotSection}
    </div>

    <!-- Lightbox -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox()">
      <button class="lightbox-close" onclick="closeLightbox()">✕</button>
      <img id="lightbox-img" src="" alt="Screenshot">
    </div>
  `;
}

/* ─── Lightbox ─────────────────────── */
function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.classList.remove("active");
    document.body.style.overflow = "";
}
function initLightbox() {
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
}

/* ═══════════════════════════════════════════════════════════
   7. ABOUT PAGE
══════════════════════════════════════════════════════════════ */

(function initAboutPage() {
    const skillsGrid = document.getElementById("skills-grid");
    const projectsGrid = document.getElementById("projects-grid");

    /* Render skill pills */
    if (skillsGrid) {
        DEVELOPER.skills.forEach((skill, i) => {
            const pill = document.createElement("div");
            pill.className = "skill-pill reveal";
            pill.style.animationDelay = `${i * 0.07}s`;
            pill.textContent = skill;
            skillsGrid.appendChild(pill);
        });
    }

    /* Render app projects */
    if (projectsGrid) {
        apps.forEach((app, idx) => {
            const card = createAppCard(app);
            card.style.animationDelay = `${idx * 0.1}s`;
            projectsGrid.appendChild(card);
        });
    }
})();

/* ═══════════════════════════════════════════════════════════
   8. CONTACT PAGE
══════════════════════════════════════════════════════════════ */

(function initContactPage() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const btn = form.querySelector(".btn-submit");
        const status = document.getElementById("form-status");

        // Simulate send
        btn.textContent = "Sending…";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = "Send Message";
            btn.disabled = false;
            if (status) {
                status.textContent = "✅ Message sent! I'll get back to you soon.";
                status.className = "form-status success";
                status.style.display = "block";
            }
            form.reset();
            setTimeout(() => { if (status) status.style.display = "none"; }, 5000);
        }, 1600);
    });
})();

/* ═══════════════════════════════════════════════════════════
   9. SHARED — createAppCard
══════════════════════════════════════════════════════════════ */

function createAppCard(app) {
    const card = document.createElement("div");
    card.className = "app-card";
    card.style.setProperty("--card-color", app.color || "#00d4ff");

    card.innerHTML = `
    <div class="card-glow"></div>
    <div class="card-header">
      <img src="${app.icon}" alt="${app.name} icon" class="card-icon" loading="lazy" onerror="this.src='images/default-icon.png'">
      <div class="card-title-group">
        <h3 class="card-name">${app.name}</h3>
        <span class="card-category">${app.category}</span>
      </div>
      <div class="card-rating" title="Rating: ${app.rating}">${renderStars(app.rating)}</div>
    </div>
    <p class="card-description">${app.description}</p>
    <div class="card-tags">
      ${(app.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("")}
    </div>
    <div class="card-actions">
      <a href="app-details.html?id=${app.id}" class="btn btn-secondary btn-sm">Details</a>
      ${app.android 
        ? `<a href="${app.android}" download class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
            APK
          </a>`
        : `<button class="btn btn-primary btn-sm" onclick="alert('Coming Soon! 🚀')">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
            APK
          </button>`
      }
    </div>
  `;

    // 3D tilt on mouse move
    card.addEventListener("mousemove", handleCardTilt);
    card.addEventListener("mouseleave", resetCardTilt);

    return card;
}

function handleCardTilt(e) {
    const rect = this.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    this.style.transform = `perspective(600px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) translateY(-6px) scale(1.02)`;
    this.querySelector(".card-glow").style.opacity = "1";
    this.querySelector(".card-glow").style.left = `${(dx + 1) * 50}%`;
    this.querySelector(".card-glow").style.top = `${(dy + 1) * 50}%`;
}

function resetCardTilt() {
    this.style.transform = "";
    if (this.querySelector(".card-glow")) {
        this.querySelector(".card-glow").style.opacity = "";
    }
}

/* ═══════════════════════════════════════════════════════════
   10. RIPPLE EFFECT ON BUTTONS
══════════════════════════════════════════════════════════════ */

function rippleEffect(e, el) {
    const circle = document.createElement("span");
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    top:${e.clientY - rect.top - size / 2}px;
    left:${e.clientX - rect.left - size / 2}px;
    background:rgba(255,255,255,0.3);
    transform:scale(0);
    animation: ripple 0.6s linear;
  `;
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove());
}

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) { rippleEffect(e, this); });
});
