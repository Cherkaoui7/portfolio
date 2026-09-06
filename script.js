const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

/* Theme */
const saved = localStorage.getItem("cherkaoui-theme");
if (saved === "light") document.documentElement.dataset.theme = "light";
$("#themeToggle").addEventListener("click", () => {
  const light = document.documentElement.dataset.theme === "light";
  if (light) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = "light";
  localStorage.setItem("cherkaoui-theme", light ? "dark" : "light");
});

/* Scroll reveal */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .10 });
$$(".reveal").forEach(el => revealObserver.observe(el));

/* Scroll progress + nav state + decors */
const progress = $("#progress");
const nav = $("#nav");
const decorPlane = $("#decorPlane");
const decorNet1 = $("#decorNetwork1");
const decorNet2 = $("#decorNetwork2");

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      progress.style.width = `${p * 100}%`;
      nav.style.background = scrollY > 30 ? "color-mix(in srgb, var(--bg) 82%, transparent)" : "transparent";
      nav.style.backdropFilter = scrollY > 30 ? "blur(12px)" : "none";

      if (decorPlane) decorPlane.style.transform = `translateY(${p * (innerHeight + 100)}px) rotate(${15 + p * 35}deg)`;
      if (decorNet1) decorNet1.style.transform = `translateY(${-(p * (innerHeight + 200))}px) rotate(${p * 20}deg)`;
      if (decorNet2) decorNet2.style.transform = `translateY(${-(p * (innerHeight + 400))}px) rotate(${-p * 30}deg)`;
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* Magnetic links — only for fine pointers (mouse), disabled on touch devices */
if (matchMedia("(pointer:fine)").matches) {
  $$(".magnetic").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .18;
      const y = (e.clientY - r.top - r.height / 2) * .18;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave", () => el.style.transform = "");
  });
}

/* Back to top smooth navigation */
$$('a[href="#top"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* Cursor */
const dot = $(".cursor-dot"), ring = $(".cursor-ring");
if (matchMedia("(pointer:fine)").matches) {
  document.body.classList.add("cursor-ready");
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
  function cursorLoop() {
    rx += (mx - rx) * .14; ry += (my - ry) * .14;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  $$("a,button,.project,.skill").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

/* Lightweight 3D tilt — disabled on touch screens */
if (matchMedia("(pointer:fine)").matches) {
  $$(".tilt").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });
}

/* Hero parallax */
const heroVisual = $("#heroVisual");
if (heroVisual && matchMedia("(pointer:fine)").matches) {
  addEventListener("pointermove", e => {
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    heroVisual.style.transform = `translate(${x * 8}px,${y * 6}px)`;
  });
}

/* Count-up metrics */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let start = 0, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 900, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: .6 });
$$("[data-count]").forEach(el => countObserver.observe(el));

/* Active nav link */
const sections = $$("section[id]");
const navAnchors = $$(".nav-links a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(s => sectionObserver.observe(s));

/* =========================================================
   MIND MAP RESIZE & TOUCH EXPLORATION LOGIC
========================================================== */
function resizeMindmapScene() {
  const scene = document.querySelector(".mindmap-scene-desktop");
  const wrapper = document.querySelector(".mindmap-wrapper");
  if (!scene || !wrapper) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Mobile vertical layout active: reset wrapper height and avoid desktop transforms
    wrapper.style.height = "auto";
    return;
  }

  const wrapperWidth = wrapper.clientWidth;
  const wrapperHeight = wrapper.clientHeight || 700;
  const DESIGN_WIDTH = 1536;
  const DESIGN_HEIGHT = 1024;

  const scaleX = wrapperWidth / DESIGN_WIDTH;
  const scaleY = wrapperHeight / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY) * 0.95;

  scene.style.transform = `scale(${scale})`;
  scene.style.transformOrigin = "center center";
  wrapper.style.height = "";
}

function initMindmapScroll() {
  const wrapper = document.querySelector(".mindmap-wrapper");
  if (!wrapper) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  wrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    wrapper.style.cursor = "grabbing";
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    if (wrapper) wrapper.style.cursor = "grab";
  });

  wrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrapper.scrollLeft = scrollLeft - walk;
  });
}

resizeMindmapScene();
initMindmapScroll();
window.addEventListener("resize", resizeMindmapScene, { passive: true });


/* =========================================================
   LANGUAGE TOGGLE & I18N
========================================================== */
const VALID_LANGS = ["en", "fr"];
const storedLang = localStorage.getItem("cherkaoui-lang");
let currentLang = VALID_LANGS.includes(storedLang) ? storedLang : "en";
const langToggleBtn = document.getElementById("langToggle");

function updateTranslations() {
  if (!VALID_LANGS.includes(currentLang) || !Object.prototype.hasOwnProperty.call(translations, currentLang)) {
    currentLang = "en";
  }
  const t = translations[currentLang];
  if (!t) return;
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key && Object.prototype.hasOwnProperty.call(t, key)) {
      el.innerHTML = t[key];
    }
  });
  langToggleBtn.textContent = currentLang === "en" ? "FR" : "EN";
  startTypewriter();
}

langToggleBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fr" : "en";
  localStorage.setItem("cherkaoui-lang", currentLang);
  updateTranslations();
});

/* =========================================================
   TYPEWRITER EFFECT
========================================================== */
const heroCode = document.getElementById('hero-code');
let typewriterTimeout = null;
let currentLine = 0;
let currentChar = 0;
let codeLines = [];

function syntaxHighlight(text) {
  return text
    .replace(/\bconst\b/g, '<b>const</b>')
    .replace(/\bprofile\b/g, '<u>profile</u>')
    .replace(/\b(name|role|location|building|stack|nom|localisation|developpement)(\s*:)/g, '<s>$1</s>$2')
    .replace(/"([^"]*)("|$)/g, '<em>"$1$2</em>')
    .replace(/  /g, '&nbsp;&nbsp;');
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}

function typeNextChar() {
  if (!Array.isArray(codeLines) || currentLine >= codeLines.length) {
    const cursorDiv = document.createElement('div');
    cursorDiv.className = 'terminal-cursor';
    cursorDiv.innerHTML = `<i>${padZero(currentLine + 1)}</i><span></span>`;
    heroCode.appendChild(cursorDiv);
    return;
  }

  const lineText = codeLines[currentLine] || '';
  let lineDiv = document.getElementById('line-' + currentLine);

  if (!lineDiv) {
    lineDiv = document.createElement('div');
    lineDiv.id = 'line-' + currentLine;
    lineDiv.innerHTML = `<i>${padZero(currentLine + 1)}</i><span class="typing-content"></span><span class="terminal-cursor-inline" style="display:inline-block;width:6px;height:12px;background:var(--accent);margin-left:4px;vertical-align:middle;animation:blink 1s steps(1) infinite;"></span>`;
    heroCode.appendChild(lineDiv);
  }

  const contentSpan = lineDiv.querySelector('.typing-content');

  if (currentChar < lineText.length) {
    const currentPartial = lineText.substring(0, currentChar + 1);
    contentSpan.innerHTML = syntaxHighlight(currentPartial);
    currentChar++;
    typewriterTimeout = setTimeout(typeNextChar, Math.random() * 25 + 15);
  } else {
    const cursorInline = lineDiv.querySelector('.terminal-cursor-inline');
    if (cursorInline) cursorInline.remove();

    currentLine++;
    currentChar = 0;
    typewriterTimeout = setTimeout(typeNextChar, 120);
  }
}

function startTypewriter() {
  if (heroCode) {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    heroCode.innerHTML = '';
    currentLine = 0;
    currentChar = 0;
    const lines = Object.prototype.hasOwnProperty.call(codeTranslations, currentLang)
      ? codeTranslations[currentLang]
      : codeTranslations['en'];
    codeLines = Array.isArray(lines) ? lines : codeTranslations['en'];
    typewriterTimeout = setTimeout(typeNextChar, 80);
  }
}

// Initial language load
updateTranslations();

/* =========================================================
   LIVE NEURAL PLEXUS CONSTELLATION CANVAS
========================================================== */
(function initNeuralConstellation() {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;

  // Turn off on mobile to eliminate animation overhead and ensure instantaneous page loading
  if (window.innerWidth <= 768) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext("2d");
  const wrapper = canvas.closest(".neural-network-wrapper");
  if (!wrapper) return;

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;

  // Mouse tracking
  const mouse = { x: null, y: null, radius: 140 };

  wrapper.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  wrapper.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Hub positions (calculated dynamically from DOM)
  function getHubCoordinates() {
    const rect = canvas.getBoundingClientRect();
    const hub1 = wrapper.querySelector(".neural-hub.hub-1");
    const hub2 = wrapper.querySelector(".neural-hub.hub-2");
    const hubs = [];

    if (hub1 && window.getComputedStyle(hub1).display !== "none") {
      const r1 = hub1.getBoundingClientRect();
      hubs.push({
        x: r1.left + r1.width / 2 - rect.left,
        y: r1.top + r1.height / 2 - rect.top
      });
    }

    if (hub2 && window.getComputedStyle(hub2).display !== "none") {
      const r2 = hub2.getBoundingClientRect();
      hubs.push({
        x: r2.left + r2.width / 2 - rect.left,
        y: r2.top + r2.height / 2 - rect.top
      });
    }

    return hubs;
  }

  // Particle pool
  const PARTICLE_COUNT = 75;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * (width || 800) : (Math.random() > 0.5 ? 0 : width);
      this.y = Math.random() * (height || 500);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseRadius = Math.random() * 1.6 + 1.2;
      this.radius = this.baseRadius;
      this.alpha = Math.random() * 0.5 + 0.35;
      const colorRoll = Math.random();
      if (colorRoll > 0.35) {
        this.color = "rgba(163, 230, 53, ";
      } else if (colorRoll > 0.1) {
        this.color = "rgba(204, 255, 0, ";
      } else {
        this.color = "rgba(255, 255, 255, ";
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
          this.radius = this.baseRadius * 1.5;
        } else {
          this.radius = this.baseRadius;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.dataset.theme === "light";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(22, 163, 74, ${Math.min(1, this.alpha * 1.6)})` : (this.color + this.alpha + ")");
      ctx.shadowBlur = isLight ? 4 : 7;
      ctx.shadowColor = isLight ? "#16a34a" : "#a3e635";
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || (canvas.parentElement ? canvas.parentElement.clientWidth : 800);
    height = rect.height || 480;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (particles.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }
  }

  window.addEventListener("resize", resize, { passive: true });

  let pulseTimer = 0;

  function render() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);
    pulseTimer += 0.035;

    const isLight = document.documentElement.dataset.theme === "light";
    const hubs = getHubCoordinates();
    const maxDist = 110;
    const pCount = particles.length;

    // 1. Draw connections between nearby particles
    for (let i = 0; i < pCount; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < pCount; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = isLight ? `rgba(22, 163, 74, ${alpha * 1.6})` : `rgba(163, 230, 53, ${alpha})`;
          ctx.lineWidth = isLight ? 1 : 0.85;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isLight ? `rgba(21, 128, 61, ${alpha * 1.6})` : `rgba(204, 255, 0, ${alpha})`;
          ctx.lineWidth = isLight ? 1.2 : 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw intense glowing synaptic networks around hubs
    hubs.forEach((hub) => {
      particles.forEach((p) => {
        const dx = p.x - hub.x;
        const dy = p.y - hub.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 190) {
          const alpha = (1 - dist / 190) * 0.55;
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = isLight ? `rgba(21, 128, 61, ${alpha * 1.5})` : `rgba(204, 255, 0, ${alpha})`;
          ctx.lineWidth = isLight ? 1.2 : 1.1;
          ctx.stroke();
        }
      });

      // Starburst rays radiating from hub
      const spikeCount = 10;
      const baseR = 16 + Math.sin(pulseTimer) * 4;
      for (let s = 0; s < spikeCount; s++) {
        const angle = (s / spikeCount) * Math.PI * 2 + pulseTimer * 0.2;
        const length = baseR + ((s % 2 === 0) ? 22 : 12);
        const x2 = hub.x + Math.cos(angle) * length;
        const y2 = hub.y + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isLight ? "rgba(22, 163, 74, 0.6)" : "rgba(204, 255, 0, 0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Outer radial glow
      const glowGrad = ctx.createRadialGradient(hub.x, hub.y, 2, hub.x, hub.y, 48);
      if (isLight) {
        glowGrad.addColorStop(0, "rgba(22, 163, 74, 0.9)");
        glowGrad.addColorStop(0.25, "rgba(34, 197, 94, 0.5)");
        glowGrad.addColorStop(0.6, "rgba(22, 163, 74, 0.15)");
        glowGrad.addColorStop(1, "rgba(22, 163, 74, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        glowGrad.addColorStop(0.25, "rgba(204, 255, 0, 0.65)");
        glowGrad.addColorStop(0.6, "rgba(163, 230, 53, 0.18)");
        glowGrad.addColorStop(1, "rgba(163, 230, 53, 0)");
      }

      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 48, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (!wasVisible && isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(wrapper);

  setTimeout(() => {
    resize();
    render();
  }, 100);
})();

/* =========================================================
   TECH STACK MIND MAP - CYBER DIGITAL RAIN OF PARTICLES
========================================================== */
(function initMindmapCyberRain() {
  const canvas = document.getElementById("mindmapRainCanvas");
  if (!canvas) return;

  // Turn off on mobile to eliminate animation overhead and keep the site light and fast
  if (window.innerWidth <= 768) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext("2d");
  const wrapper = canvas.closest(".mindmap-wrapper");
  if (!wrapper) return;

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;

  // Track mouse within wrapper for interactive breeze
  const mouse = { x: null, y: null, active: false };
  wrapper.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  wrapper.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    const rect = wrapper.getBoundingClientRect();
    width = rect.width || wrapper.clientWidth || 1000;
    height = rect.height || 600;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });

  // 5 Theme branch color definitions
  const THEME_COLORS_DARK = [
    { rgb: "10, 186, 255" },  // Neon Cyan (Frontend)
    { rgb: "174, 80, 255" },  // Neon Purple (Backend)
    { rgb: "19, 217, 209" },  // Turquoise (Database)
    { rgb: "255, 159, 0" },   // Amber (Core)
    { rgb: "216, 255, 77" }   // Lime accent
  ];

  const THEME_COLORS_LIGHT = [
    { rgb: "2, 132, 199" },   // Ocean Blue (Frontend)
    { rgb: "147, 51, 234" },  // Royal Purple (Backend)
    { rgb: "5, 150, 105" },   // Emerald (Database)
    { rgb: "217, 119, 6" },   // Warm Amber (Core)
    { rgb: "22, 163, 74" }    // Forest Green accent
  ];

  const PARTICLE_COUNT = 75;
  const particles = [];

  class RainDrop {
    constructor(initRandomY = true) {
      this.reset(initRandomY);
    }

    reset(initRandomY = false) {
      this.x = Math.random() * (width + 120) - 60;
      this.y = initRandomY ? Math.random() * (height || 700) : -20 - Math.random() * 40;

      // Multi-layer depth (small = slow & dim, large = fast & bright)
      this.depth = Math.random(); // 0 (far) to 1 (near)
      this.size = 1.1 + this.depth * 1.5; // 1.1px to 2.6px
      this.vy = 2.0 + this.depth * 2.8; // 2.0 to 4.8 px/frame
      this.vx = 0.35 + this.depth * 0.45; // slight natural rain slant (~10-15 degrees)
      this.length = 10 + this.depth * 18; // length of streak tail (10px - 28px)
      this.baseAlpha = 0.28 + this.depth * 0.52; // 0.28 to 0.80
      this.colorIndex = Math.floor(Math.random() * 5);
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
      // Wind wobble
      this.wobble += this.wobbleSpeed;
      const windDrift = Math.sin(this.wobble) * 0.25;

      // Mouse interactive breeze / disturbance
      if (mouse.active && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 2.0;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force * 0.5;
        }
      }

      this.x += this.vx + windDrift;
      this.y += this.vy;

      // Loop back to top when off-screen
      if (this.y > height + 30 || this.x > width + 60) {
        this.reset(false);
      }
    }

    draw(isLight) {
      const palette = isLight ? THEME_COLORS_LIGHT : THEME_COLORS_DARK;
      const color = palette[this.colorIndex].rgb;
      const alpha = isLight ? this.baseAlpha * 0.7 : this.baseAlpha;

      // Tail end position
      const tailX = this.x - this.vx * (this.length / this.vy);
      const tailY = this.y - this.length;

      // Gradient streamer tail
      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, `rgba(${color}, 0)`);
      grad.addColorStop(0.65, `rgba(${color}, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${color}, ${alpha * 0.95})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.size * 0.9;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glowing head point
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${Math.min(alpha * 1.25, 1)})`;
      ctx.fill();

      // Ambient halo on nearest particles
      if (this.depth > 0.6) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.22})`;
        ctx.fill();
      }
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new RainDrop(true));
    }
  }

  function render() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.dataset.theme === "light";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw(isLight);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (!wasVisible && isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });
  }, { threshold: 0.05 });
  observer.observe(wrapper);

  setTimeout(() => {
    resize();
    initParticles();
    render();
  }, 100);
})();

/* =========================================================
   CV DOWNLOAD MODAL & TOAST ALERT NOTIFICATION
========================================================== */
(function initCvModalController() {
  const modalBackdrop = document.getElementById("cvModalBackdrop");
  const closeBtn = document.getElementById("cvModalClose");
  const cardFr = document.getElementById("cvCardFr");
  const cardEn = document.getElementById("cvCardEn");
  const toast = document.getElementById("cvToast");
  const toastTitle = document.getElementById("cvToastTitle");
  const toastDesc = document.getElementById("cvToastDesc");
  let toastTimer = null;

  if (!modalBackdrop) return;

  function openModal() {
    modalBackdrop.classList.add("active");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (typeof updateTranslations === "function") {
      updateTranslations();
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  window.openCvModal = openModal;
  window.closeCvModal = closeModal;

  function showToast(langChoice) {
    if (!toast) return;
    const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang] : {};

    if (toastTitle) {
      toastTitle.textContent = t.cv_toast_title || (currentLang === "fr" ? "Téléchargement lancé" : "Download Started");
    }

    if (toastDesc) {
      if (langChoice === "fr") {
        toastDesc.textContent = t.cv_toast_fr || (currentLang === "fr" ? "Téléchargement du CV en français..." : "Downloading French CV...");
      } else {
        toastDesc.textContent = t.cv_toast_en || (currentLang === "fr" ? "Téléchargement du CV en anglais..." : "Downloading English CV...");
      }
    }

    toast.classList.remove("show");
    void toast.offsetWidth; // Force DOM reflow to retrigger CSS animation
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3800);
  }

  function triggerDownload(filePath, fileName, langChoice) {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeModal();
    showToast(langChoice);
  }

  // Bind all download buttons / links
  const triggers = document.querySelectorAll(".cv-trigger, [data-cv-trigger], .nav-cv-link");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      openModal();
    });
  });

  // French choice
  if (cardFr) {
    cardFr.addEventListener("click", () => {
      triggerDownload(
        "assets/CV Abdessamad Cherkaoui – Développeur Web Full-Stack.pdf",
        "CV Abdessamad Cherkaoui – Développeur Web Full-Stack.pdf",
        "fr"
      );
    });
  }

  // English choice
  if (cardEn) {
    cardEn.addEventListener("click", () => {
      triggerDownload(
        "assets/Professional Full-Stack CV Abdessamad Cherkaoui.pdf",
        "Professional Full-Stack CV Abdessamad Cherkaoui.pdf",
        "en"
      );
    });
  }

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modalBackdrop.addEventListener("click", e => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
      closeModal();
    }
  });
})();

/* =========================================================
   BULLETPROOF TECH STACK ICON SELF-HEALING FALLBACK
   Guarantees all 18 technology badges render crisp vector
   icons even if external CDN or font fails to load.
========================================================== */
(function () {
  const svgMap = {
    'devicon-react-original': '<svg viewBox="-11.5 -10.2 23 20.4" width="22" height="22"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>',
    'devicon-nextjs-plain': '<svg viewBox="0 0 180 180" width="22" height="22"><circle cx="90" cy="90" r="90" fill="currentColor"/><path d="M149.5 157.4L69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.4z" fill="var(--surface, #16191e)"/><rect fill="var(--surface, #16191e)" height="72" width="12" x="115" y="54"/></svg>',
    'devicon-vuejs-plain': '<svg viewBox="0 0 256 221" width="22" height="22"><path d="M204.8 0H256L128 220.8 0 0h97.9L128 51.2 157.4 0z" fill="#41B883"/><path d="M50 0l78 132.5L206 0h-39.7L128 69.1 89.6 0z" fill="#35495E"/></svg>',
    'devicon-angularjs-plain': '<svg viewBox="0 0 250 250" width="22" height="22"><polygon points="125,30 31.9,63.2 46.1,186.3 125,230 203.9,186.3 218.1,63.2" fill="#DD0031"/><polygon points="125,30 125,52.2 125,153.4 125,230 203.9,186.3 218.1,63.2" fill="#C3002F"/><path d="M125,52.1L66.8,182.6H91.3L103.1,153.4H146.7L158.5,182.6H183.1L125,52.1ZM138.8,133.5H111.2L125,100.2L138.8,133.5Z" fill="#FFF"/></svg>',
    'devicon-javascript-plain': '<svg viewBox="0 0 630 630" width="22" height="22"><rect width="630" height="630" rx="60" fill="#F7DF1E"/><path d="m165.8 466.1 43.9-26.7c10.5 18.7 20.9 33.4 43.9 33.4 20.9 0 34.5-8.4 34.5-40.7V195h54.3v238.1c0 57.4-33.4 83.6-83.6 83.6-44.9 0-72-24-93-50.6zm181.8-13.6 43.8-25.6c12.5 20.9 29.2 36.5 59.5 36.5 26.1 0 42.8-13.6 42.8-32.4 0-23-17.7-31.3-49.1-44.9l-16.7-7.3c-49.1-20.9-80.4-47-80.4-101.3 0-50.1 38.6-88.8 98.2-88.8 42.8 0 74.1 15.7 95 53.3l-41.8 26.7c-9.4-16.7-21.9-24-49.1-24-24 0-38.6 12.5-38.6 29.2 0 20.9 13.6 29.3 43.9 42.9l16.7 7.3c58.5 25.1 87.7 51.2 87.7 103.4 0 59.5-47 93-104.4 93-57.5 0-94-28.2-106.6-62.9z" fill="#000"/></svg>',
    'devicon-bootstrap-plain': '<svg viewBox="0 0 16 16" width="22" height="22" fill="#7952b3"><path d="M8.537 12H5.072v-8h3.465c1.077 0 1.878.257 2.404.77.525.514.788 1.233.788 2.158 0 .611-.12 1.11-.36 1.498-.24.388-.58.68-1.02.875v.064c.582.137 1.03.447 1.344.93.315.483.472 1.092.472 1.826 0 .964-.282 1.713-.846 2.247-.564.534-1.378.802-2.442.802zm-1.89-6.62h1.705c.57 0 1.002-.122 1.296-.367.294-.244.441-.62.441-1.127 0-.52-.14-.9-.42-1.14-.28-.24-.712-.36-1.296-.36H6.647v3zm0 5.24h1.94c.642 0 1.132-.14 1.47-.42.338-.28.507-.714.507-1.303 0-.57-.17-.99-.51-1.26-.34-.27-.84-.405-1.5-.405H6.647v3.388z"/><path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1z"/></svg>',
    'devicon-html5-plain': '<svg viewBox="0 0 512 512" width="22" height="22"><path fill="#E34F26" d="M71 460L30 0h451l-41 460-185 52"/><path fill="#EF652A" d="M256 472l151-42 33-370H256"/><path fill="#EBEBEB" d="M256 208H181l-5-58h80V94H114l15 171h127zm0 147l-1-1-63-17-4-45h-56l7 89 116 32 1-.3z"/><path fill="#FFF" d="M255 208v57h70l-7 73-63 17v59l116-32 1-10 13-149 2-15H255zm0-114v56h142l5-56H255z"/></svg>',
    'devicon-css3-plain': '<svg viewBox="0 0 512 512" width="22" height="22"><path fill="#1572B6" d="M71 460L30 0h451l-41 460-185 52"/><path fill="#33A9DC" d="M256 472l151-42 33-370H256"/><path fill="#EBEBEB" d="M256 208H181l-5-58h80V94H114l15 171h127zm0 147l-1-1-63-17-4-45h-56l7 89 116 32 1-.3z"/><path fill="#FFF" d="M255 208v57h70l-7 73-63 17v59l116-32 1-10 13-149 2-15H255zm0-114v56h142l5-56H255z"/></svg>',
    'devicon-nodejs-plain': '<svg viewBox="0 0 32 32" width="22" height="22"><path fill="#339933" d="M16 3l13 7.5v15L16 33l-13-7.5v-15L16 3z"/><path fill="#FFF" d="M16 6.5l9.5 5.5v11L16 28.5 6.5 23v-11L16 6.5z"/></svg>',
    'devicon-php-plain': '<svg viewBox="0 0 256 135" width="24" height="18"><ellipse cx="128" cy="67.5" rx="120" ry="62" fill="#777BB4"/><path d="M68 97L82 41h23c10 0 16 2 18 6 2 4 1 10-1 17-3 10-8 17-15 21-6 4-13 6-22 6H75l-7 30H68zm18-50l-8 32h14c6 0 10-1 13-4 4-3 6-7 8-13 1-5 1-9-1-11-2-3-6-4-12-4H86zm54 50l14-56h9l-4 17c5-7 10-12 15-15 5-3 10-4 16-4 8 0 13 2 15 6 3 5 2 11-1 18-3 11-8 19-15 24-7 4-14 7-23 7h-9l-7 27h-9zm18-49l-6 24h13c6 0 11-2 15-5s6-7 8-12c2-5 1-8-1-10-2-2-6-3-11-3h-15zm60 49l14-56h23c10 0 16 2 18 6 2 4 1 10-1 17-3 10-8 17-15 21-6 4-13 6-22 6h-10l-7 30h-9zm18-50l-8 32h14c6 0 10-1 13-4 4-3 6-7 8-13 1-5 1-9-1-11-2-3-6-4-12-4h-14z" fill="#FFF"/></svg>',
    'devicon-laravel-original': '<svg viewBox="0 0 512 512" width="22" height="22" fill="#FF2D20"><path d="M495.9 180.2L358.3 101.4c-6.2-3.6-13.9-3.6-20.1 0L200.7 180.2c-6.2 3.6-10 10.2-10 17.3v157.6c0 7.2 3.8 13.8 10 17.3l137.5 78.8c3.1 1.8 6.6 2.7 10 2.7s6.9-.9 10-2.7l137.5-78.8c6.2-3.6 10-10.2 10-17.3V197.6c.3-7.2-3.5-13.8-9.8-17.4z"/></svg>',
    'devicon-python-plain': '<svg viewBox="0 0 128 128" width="22" height="22"><path fill="#3776AB" d="M63.7 3.2c-15.5 0-25.2 6.8-25.2 19.8v14.5h25.6v3.6H27.5C12 41.1 0 52.8 0 71.4c0 18.5 10.7 28.5 25.2 28.5h7.6V88.8c0-14.2 12.3-25.7 26.6-25.7h25.4v-3.6H49.5v-3.6h49.6c8.5 0 14.8-6.1 14.8-14.7V23c0-13-10.4-19.8-25.4-19.8H63.7zm-13 7.8c2.6 0 4.8 2.1 4.8 4.8s-2.2 4.8-4.8 4.8-4.8-2.1-4.8-4.8 2.2-4.8 4.8-4.8z"/><path fill="#FFD43B" d="M102.8 28.1v11.1c0 14.2-12.3 25.7-26.6 25.7H50.8v3.6h35.3v3.6H36.5c-8.5 0-14.8 6.1-14.8 14.7v18.1c0 13 10.4 19.8 25.4 19.8h24.8c15.5 0 25.2-6.8 25.2-19.8v-14.5H81.7v-3.6h36.6c15.5 0 27.5-11.7 27.5-30.3 0-18.5-10.7-28.5-25.2-28.5h-7.8zm-25.5 84.2c-2.6 0-4.8-2.1-4.8-4.8s2.2-4.8 4.8-4.8 4.8 2.1 4.8 4.8-2.2 4.8-4.8 4.8z"/></svg>',
    'devicon-mysql-plain': '<svg viewBox="0 0 24 24" width="22" height="22" fill="#00758F"><path d="M16.5 13.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm-9 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8 0-2.3 1-4.4 2.6-5.9l1.4 1.4C6.8 8.7 6 10.3 6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-1.7-.8-3.3-2-4.5l1.4-1.4C19 7.6 20 9.7 20 12c0 4.4-3.6 8-8 8z"/></svg>',
    'devicon-mongodb-plain': '<svg viewBox="0 0 24 24" width="22" height="22" fill="#47A248"><path d="M12 1.5C11.5 3 7 8 7 14c0 3.5 2 7 5 8.5 3-1.5 5-5 5-8.5 0-6-4.5-11-5-12.5zm0 19c-2-1.5-3.5-4-3.5-6.5 0-4 3-7.5 3.5-9 .5 1.5 3.5 5 3.5 9 0 2.5-1.5 5-3.5 6.5z"/></svg>',
    'devicon-sqlite-plain': '<svg viewBox="0 0 24 24" width="22" height="22" fill="#0f80cc"><path d="M12 2C6.5 2 2 3.8 2 6v12c0 2.2 4.5 4 10 4s10-1.8 10-4V6c0-2.2-4.5-4-10-4zm0 2c4.4 0 8 1.3 8 2s-3.6 2-8 2-8-1.3-8-2 3.6-2 8-2zm0 6c4.4 0 8 1.3 8 2v2c0 .7-3.6 2-8 2s-8-1.3-8-2v-2c0-.7 3.6-2 8-2zm0 6c4.4 0 8 1.3 8 2v2c0 .7-3.6 2-8 2s-8-1.3-8-2v-2c0-.7 3.6-2 8-2z"/></svg>',
    'devicon-git-plain': '<svg viewBox="0 0 24 24" width="22" height="22" fill="#F05032"><path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.7 4.7l2.8 2.8c.6-.2 1.3-.1 1.8.4.5.5.7 1.2.5 1.8l2.7 2.7c.6-.2 1.3-.1 1.8.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.7-1.3-.4-1.9L12.8 11v4.6c.2.1.4.3.5.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.4-.4.6-.5V10.8c-.2-.1-.4-.3-.6-.5-.5-.5-.7-1.3-.4-1.9L7.5 5.6 2.4 10.7c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.5.6-1.4.1-1.9z"/></svg>',
    'devicon-vitejs-plain': '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#41D1FF" d="M21.5 3.5L12.5 20.5 3.5 3.5h18z"/><path fill="#BD34FE" d="M17.5 2.5L12 13 8.5 6.5l3.5-4h5.5z"/></svg>',
    'devicon-figma-plain': '<svg viewBox="0 0 38 57" width="16" height="24" fill="none"><path d="M19 28.5C19 23.3 23.3 19 28.5 19s9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5-9.5-4.3-9.5-9.5z" fill="#1ABCFE"/><path d="M0 47.5C0 42.3 4.3 38 9.5 38H19v9.5c0 5.2-4.3 9.5-9.5 9.5S0 52.7 0 47.5z" fill="#0ACF83"/><path d="M19 0v19h9.5C33.7 19 38 14.7 38 9.5S33.7 0 28.5 0H19z" fill="#FF7262"/><path d="M0 9.5C0 14.7 4.3 19 9.5 19H19V0H9.5C4.3 0 0 4.3 0 9.5z" fill="#F24E1E"/><path d="M0 28.5C0 33.7 4.3 38 9.5 38H19V19H9.5C4.3 19 0 23.3 0 28.5z" fill="#A259FF"/></svg>'
  };

  function applySvgFallbacks() {
    Object.keys(svgMap).forEach(key => {
      document.querySelectorAll(`.${key}`).forEach(el => {
        if (!el.querySelector('svg')) {
          el.innerHTML = svgMap[key];
          el.style.display = 'inline-flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
        }
      });
    });
  }

  function verifyAndHealIcons() {
    const testIcon = document.querySelector('.devicon-react-original');
    const isFontLoaded = document.fonts ? document.fonts.check('16px devicon') : false;
    const isIconVisible = testIcon && testIcon.getBoundingClientRect().width > 2;

    if (!isFontLoaded && !isIconVisible) {
      applySvgFallbacks();
    }
  }

  // Check on document ready and after a short grace period
  if (document.readyState === 'complete') {
    setTimeout(verifyAndHealIcons, 600);
  } else {
    window.addEventListener('load', () => setTimeout(verifyAndHealIcons, 600));
  }
})();

/* =========================================================
   HIGH-SPEED SERVICE WORKER REGISTRATION (1MS CACHING)
========================================================== */
if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      // Background cache warming
      if (reg.installing) {
        console.log('[SW] Ultra-fast caching active');
      }
    }).catch(() => { });
  });
}
