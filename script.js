const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

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
}, {threshold:.10});
$$(".reveal").forEach(el => revealObserver.observe(el));

/* Scroll progress + nav state + decors */
const progress = $("#progress");
const nav = $("#nav");
const decorPlane = $("#decorPlane");
const decorNet1 = $("#decorNetwork1");
const decorNet2 = $("#decorNetwork2");

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  progress.style.width = `${p * 100}%`;
  nav.style.background = scrollY > 30 ? "color-mix(in srgb, var(--bg) 82%, transparent)" : "transparent";
  nav.style.backdropFilter = scrollY > 30 ? "blur(12px)" : "none";
  
  if(decorPlane) decorPlane.style.transform = `translateY(${p * (innerHeight + 100)}px) rotate(${15 + p * 35}deg)`;
  if(decorNet1) decorNet1.style.transform = `translateY(${-(p * (innerHeight + 200))}px) rotate(${p * 20}deg)`;
  if(decorNet2) decorNet2.style.transform = `translateY(${-(p * (innerHeight + 400))}px) rotate(${-p * 30}deg)`;
}, {passive:true});

/* Magnetic links */
$$(".magnetic").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * .18;
    const y = (e.clientY - r.top - r.height/2) * .18;
    el.style.transform = `translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave", () => el.style.transform = "");
});

/* Cursor */
const dot = $(".cursor-dot"), ring = $(".cursor-ring");
if (matchMedia("(pointer:fine)").matches) {
  document.body.classList.add("cursor-ready");
  let mx=0,my=0,rx=0,ry=0;
  addEventListener("pointermove", e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+"px"; dot.style.top=my+"px"; });
  function cursorLoop() {
    rx += (mx-rx)*.14; ry += (my-ry)*.14;
    ring.style.left=rx+"px"; ring.style.top=ry+"px";
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  $$("a,button,.project,.skill").forEach(el => {
    el.addEventListener("mouseenter",()=>document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("cursor-hover"));
  });
}

/* Lightweight 3D tilt — disabled on touch screens */
if (matchMedia("(pointer:fine)").matches) {
  $$(".tilt").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });
}

/* Hero parallax */
const heroVisual = $("#heroVisual");
if (heroVisual && matchMedia("(pointer:fine)").matches) {
  addEventListener("pointermove", e => {
    const x=(e.clientX-innerWidth/2)/innerWidth;
    const y=(e.clientY-innerHeight/2)/innerHeight;
    heroVisual.style.transform=`translate(${x*8}px,${y*6}px)`;
  });
}

/* Count-up metrics */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el=entry.target, target=Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let start=0, t0=performance.now();
    const tick=t=>{
      const p=Math.min((t-t0)/900,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(start+(target-start)*eased) + suffix;
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
},{threshold:.6});
$$("[data-count]").forEach(el=>countObserver.observe(el));

/* Active nav link */
const sections = $$("section[id]");
const navAnchors = $$(".nav-links a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href")==="#"+entry.target.id));
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>sectionObserver.observe(s));

/* =========================================================
   MIND MAP RESIZE LOGIC
========================================================== */
function resizeMindmapScene() {
    const scene = document.querySelector(".scene");
    const wrapper = document.querySelector(".mindmap-wrapper");
    if (!scene || !wrapper) return;

    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;
    
    // Original design dimensions
    const DESIGN_WIDTH = 1536;
    const DESIGN_HEIGHT = 1024;

    const scaleX = wrapperWidth / DESIGN_WIDTH;
    const scaleY = wrapperHeight / DESIGN_HEIGHT;

    // Use 95% of max possible scale to add a slight internal padding
    const scale = Math.min(scaleX, scaleY) * 0.95;

    scene.style.transform = `scale(${scale})`;
}

resizeMindmapScene();
window.addEventListener("resize", resizeMindmapScene, { passive: true });

/* =========================================================
   LANGUAGE TOGGLE & I18N
========================================================== */
let currentLang = localStorage.getItem("cherkaoui-lang") || "en";
const langToggleBtn = document.getElementById("langToggle");

function updateTranslations() {
  const t = translations[currentLang];
  if (!t) return;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
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
  if (currentLine >= codeLines.length) {
    const cursorDiv = document.createElement('div');
    cursorDiv.className = 'terminal-cursor';
    cursorDiv.innerHTML = `<i>${padZero(currentLine + 1)}</i><span></span>`;
    heroCode.appendChild(cursorDiv);
    return;
  }

  const lineText = codeLines[currentLine];
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
    if(cursorInline) cursorInline.remove();
    
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
    codeLines = codeTranslations[currentLang] || codeTranslations['en'];
    typewriterTimeout = setTimeout(typeNextChar, 600);
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

  const ctx = canvas.getContext("2d");
  const wrapper = canvas.closest(".neural-network-wrapper");
  if (!wrapper) return;

  let width = 0;
  let height = 0;
  const dpr = window.devicePixelRatio || 1;
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
    width = rect.width;
    height = rect.height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    if (particles.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }
  }

  window.addEventListener("resize", resize);

  let pulseTimer = 0;

  function render() {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
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
      isVisible = entry.isIntersecting;
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
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;
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
      animationFrameId = requestAnimationFrame(render);
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
      isVisible = entry.isIntersecting;
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
        "assets/CV professionnel Full-stack Abdessamad Cherkaoui.pdf",
        "CV professionnel Full-stack Abdessamad Cherkaoui.pdf",
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
