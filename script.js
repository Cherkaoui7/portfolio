// ===============================
// PREMIUM PORTFOLIO - JAVASCRIPT
// ===============================

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Check for saved theme preference or default to system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Set theme
function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme on page load
setTheme(getPreferredTheme());

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===== PROJECT DATA =====
const projects = [
        {
        title: "React Jobs - Job Board",
        description: "Full-stack job listing platform for React developers with an interactive help assistant.",
        fullDescription: "A robust MERN stack application designed to connect React developers with employers. It features dynamic job listings, detailed job views, and a custom-built, rule-based ChatBot that provides instant answers to common user queries features. The project demonstrates confident handling of CRUD operations, state management, and modern UI libraries.",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Framer Motion"],
        gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", 
        liveUrl: "https://platform-jobs-ch.vercel.app/",
        features: [
            "Interactive FAQ ChatBot with suggestion chips",
            "Browse, filter, and view job details",
            "RESTful API with MongoDB integration",
            "Responsive design with Tailwind CSS",
            "CRUD operations for job listings"
        ]
    },
    
    {
        title: "Aurora - E-Commerce Platform",
        description: "Complete MERN-based e-commerce application with modern storefront and admin dashboard. Features product management, cart logic, REST APIs, and scalable backend architecture.",
        fullDescription: "A comprehensive full-stack e-commerce solution built with the MERN stack, featuring a customer-facing storefront and an administrative dashboard. The application implements modern e-commerce features including product catalog management, shopping cart functionality, secure checkout process, and order tracking. The backend utilizes RESTful API architecture with Express.js and MongoDB for data persistence, while the frontend delivers a responsive user experience with React.",
        technologies: ["React", "Node.js", "Express", "MongoDB", "JWT"],
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        liveUrl: "https://aurorastore-six.vercel.app/",
        features: [
            "Product catalog with search and filtering",
            "Shopping cart with real-time updates",
            "Secure user authentication with JWT",
            "Admin dashboard for inventory management",
            "Order processing and tracking system",
            "Responsive design for all devices"
        ]
    },
    {
        title: "NexusCart - Full-Stack E-Commerce Platform",
        description: "Full-stack e-commerce platform with React SPA frontend and Laravel API backend, built for secure customer flows and practical admin operations.",
        fullDescription: "NexusCart is a full-stack e-commerce system composed of a React 19 + TypeScript + Vite SPA and a Laravel 12 API. It delivers secure and coherent shopping flows, robust admin tooling for products/orders/users, and production-focused operations including observability, reproducible setup, and CI-ready structure. The frontend uses context providers for auth/cart/wishlist/comparison/notifications, Axios with Bearer token interceptor, and React Query. The backend is secured with Sanctum, role-based admin middleware, request tracing via X-Request-Id, and modular business domains such as products, categories, orders, invoices, coupons, reviews, analytics, and product history.",
        technologies: ["React 19", "TypeScript", "Vite", "Laravel 12", "Sanctum", "MySQL/PostgreSQL/SQLite"],
        gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        liveUrl: "https://ecommerce-cherkaoui.vercel.app/",
        features: [
            "React SPA with dedicated client and admin experiences",
            "Secure API auth with Laravel Sanctum Bearer tokens",
            "Role-based admin authorization via middleware",
            "Commerce modules: products, categories, orders, invoices, coupons, reviews",
            "Observability with request IDs and optional structured HTTP logs",
            "Caching layer with tag invalidation and indexed fallback strategy"
        ]
    },
    {
        title: "Advanced File Management System",
        description: "Full-stack application with role-based access control and real-time collaboration features (similar to Google Docs). Designed with scalability, security, and teamwork in mind.",
        fullDescription: "An advanced file management system with real-time collaboration capabilities, implementing role-based access control (RBAC) for secure document sharing and editing. The application features WebSocket-based real-time synchronization, allowing multiple users to collaborate simultaneously. Built with security and scalability as core principles, it includes user authentication, permission management, and audit logging.",
        technologies: ["React", "Node.js", "MongoDB", "WebSocket", "Auth"],
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        liveUrl: "https://file-sys-phi.vercel.app/",
        features: [
            "Real-time collaborative editing",
            "Role-based access control (RBAC)",
            "WebSocket for live synchronization",
            "Document version history",
            "Secure file sharing and permissions",
            "Activity tracking and audit logs"
        ]
    },
    {
        title: "CRUD Management Application",
        description: "Reusable CRUD system demonstrating form handling, validation, component separation, and scalable frontend architecture. Foundation for enterprise data management systems.",
        fullDescription: "A reusable CRUD (Create, Read, Update, Delete) management system built with React, showcasing best practices in form handling, data validation, and component architecture. The application serves as a foundation for enterprise-level data management systems, demonstrating proper separation of concerns, state management, and API integration patterns.",
        technologies: ["React", "JavaScript", "REST APIs", "CSS"],
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        features: [
            "Complete CRUD operations",
            "Form validation and error handling",
            "Reusable component architecture",
            "RESTful API integration",
            "Responsive data tables",
            "Search and filter functionality"
        ]
    },
    {
        title: "Modern To-Do Application",
        description: "Task management application with CRUD functionality, filtering, and clean UI/UX, following real-world frontend best practices.",
        fullDescription: "A modern task management application built with React and Tailwind CSS, implementing clean architecture and best practices for frontend development. Features include task creation, editing, deletion, status tracking, and advanced filtering options. The application demonstrates proper state management, component composition, and responsive design principles.",
        technologies: ["React", "JavaScript", "Tailwind CSS"],
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        features: [
            "Task creation and management",
            "Status tracking (todo, in-progress, done)",
            "Filter by status and priority",
            "Clean and intuitive UI/UX",
            "LocalStorage persistence",
            "Fully responsive design"
        ]
    },
    {
        title: "Futuristic Portfolio Website",
        description: "Personal portfolio with futuristic design, animations, and interactive elements showcasing projects and technical skills.",
        fullDescription: "An innovative personal portfolio website featuring cutting-edge design with Three.js 3D elements, GSAP animations, and modern CSS techniques. The portfolio showcases projects through interactive demonstrations and implements smooth scrolling, particle effects, and dynamic content loading. Built to impress with both technical execution and visual aesthetics.",
        technologies: ["React", "Three.js", "GSAP", "CSS Animations"],
        gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        features: [
            "3D interactive elements with Three.js",
            "Smooth scroll animations with GSAP",
            "Particle background effects",
            "Dynamic content loading",
            "Modern glassmorphism design",
            "Optimized performance"
        ]
    },
    {
        title: "Advanced Calculator",
        description: "Modern, mobile-friendly calculator with standard and advanced modes, focusing on premium UI/UX and performance.",
        fullDescription: "A feature-rich calculator application with both standard and scientific modes, built with React and focused on premium user experience. The calculator handles complex mathematical operations, features keyboard support, and implements a clean, intuitive interface with smooth animations. Optimized for both desktop and mobile use.",
        technologies: ["React", "JavaScript", "CSS"],
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        liveUrl: "https://advancedcalcul.netlify.app/",
        features: [
            "Standard and scientific modes",
            "Keyboard input support",
            "History of calculations",
            "Responsive touch-friendly UI",
            "Clean, modern design",
            "Error handling and validation"
        ]
    },
    {
        title: "ArchivePro - Employee Management",
        description: "Progressive web application for HR departments and SMEs, offering complete employee record management with offline capabilities and advanced features.",
        fullDescription: "ArchivePro is a modern progressive web application designed for HR departments and small/medium enterprises. It provides a complete solution for managing employee records with advanced features including offline functionality, making it reliable even without an internet connection. Built with a focus on usability, performance, and data security, ArchivePro streamlines HR workflows and enhances productivity.",
        technologies: ["React", "PWA", "JavaScript", "CSS"],
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        liveUrl: "https://archivesemp.netlify.app/",
        features: [
            "Complete employee record management",
            "Offline-capable progressive web app",
            "Advanced search and filtering",
            "Responsive design for all devices",
            "Data export and reporting",
            "Secure data handling"
        ]
    },
    {
        title: "Assurances Cherkaoui - Insurance Agency",
        description: "Full-Stack MERN application for an insurance agency featuring a dynamic quote simulator, email notifications, and a secure admin dashboard.",
        fullDescription: "A comprehensive full-stack application built with Next.js, Node.js, and MongoDB for an insurance brokerage agency. The platform features a dynamic quote simulator that allows clients to get instant insurance estimates, an integrated email notification system for seamless communication, and a secure admin dashboard for managing policies, clients, and business operations. Designed with a professional, trust-inspiring interface tailored to the insurance industry.",
        technologies: ["Next.js", "Node.js", "MongoDB", "Email API"],
        gradient: "linear-gradient(135deg, #0061ff 0%, #60efff 100%)",
        liveUrl: "https://assurances-cherkaoui.vercel.app/",
        features: [
            "Dynamic insurance quote simulator",
            "Email notification system",
            "Secure admin dashboard",
            "Client and policy management",
            "Responsive professional design",
            "Full-stack MERN architecture"
        ]
    }
];

//===== BLOG DATA =====
const blogPosts = [
    {
        title: "Building Scalable REST APIs with Node.js and Express",
        excerpt: "Learn how to architect and build production-ready RESTful APIs using Node.js, Express, and MongoDB with best practices for security and performance.",
        category: "Backend",
        date: "2025-01-10",
        readTime: "8 min read",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
        title: "React Performance Optimization Techniques",
        excerpt: "Discover advanced techniques to optimize your React applications including code splitting, lazy loading, memoization, and proper state management.",
        category: "Frontend",
        date: "2024-12-28",
        readTime: "6 min read",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        title: "Modern Authentication Patterns in Web Apps",
        excerpt: "A comprehensive guide to implementing secure authentication in modern web applications using JWT, OAuth 2.0, and session management best practices.",
        category: "Security",
        date: "2024-12-15",
        readTime: "10 min read",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
        title: "Full-Stack Development with the MERN Stack",
        excerpt: "A complete guide to building modern full-stack applications using MongoDB, Express, React, and Node.js. From database design to deployment.",
        category: "Full-Stack",
        date: "2025-01-05",
        readTime: "12 min read",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
];

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const navLinks = document.querySelectorAll('.navbar-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections between nearby particles
    particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach(particleB => {
            const dx = particleA.x - particleB.x;
            const dy = particleA.y - particleB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleA.x, particleA.y);
                ctx.lineTo(particleB.x, particleB.y);
                ctx.stroke();
            }
        });
    });

    animationFrameId = requestAnimationFrame(animateParticles);
}

// Initialize particles
resizeCanvas();
initParticles();
animateParticles();

// Resize handler
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ===== STATISTICS COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Observe stat cards for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.textContent === '0') {
            animateCounter(entry.target);
        }
    });
}, {
    threshold: 0.5
});

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ===== RENDER PROJECTS =====
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card reveal';

        projectCard.innerHTML = `
      <div class="project-image" style="background: ${project.gradient}; display: flex; align-items: center; justify-content: center;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary project-live-btn" onclick="event.stopPropagation();">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Live Demo
        </a>` : ''}
      </div>
    `;

        // Add click event to open modal
        projectCard.addEventListener('click', () => openProjectModal(project));

        projectsGrid.appendChild(projectCard);

        // Observe the new project card for reveal animation
        revealObserver.observe(projectCard);
    });
}

// Initialize projects
renderProjects();

// ===== PROJECT MODAL =====
const modal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');

function openProjectModal(project) {
    modalBody.innerHTML = `
        <h2 class="modal-title">${project.title}</h2>
        <div class="modal-tech-tags">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <p class="modal-description">${project.fullDescription}</p>
        <div class="modal-features">
            <h4>Key Features</h4>
            <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        ${project.liveUrl ? `<div style="margin-top: var(--space-lg); text-align: center;">
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                View Live Project
            </a>
        </div>` : ''}
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Modal close events
modalClose.addEventListener('click', closeProjectModal);
modalOverlay.addEventListener('click', closeProjectModal);

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProjectModal();
    }
});

// ===== RENDER BLOG =====
function renderBlog() {
    const blogGrid = document.getElementById('blog-grid');

    blogPosts.forEach((post, index) => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card reveal';

        blogCard.innerHTML = `
            <div class="blog-image" style="background: ${post.gradient}; display: flex; align-items: center; justify-content: center;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span>${post.readTime}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="blog-read-more">
                    Read More
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        `;

        blogGrid.appendChild(blogCard);

        // Observe for reveal animation
        revealObserver.observe(blogCard);
    });
}

// Initialize blog
renderBlog();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Create mailto link (in a real application, you'd send this to a backend)
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:cherkaouiabdessamad9@gmail.com?subject=${subject}&body=${body}`;

    // Success message
    alert('Thank you for your message! Opening your email client...');

    // Open email client
    window.location.href = mailtoLink;

    // Reset form
    contactForm.reset();
});

// ===== TYPING ANIMATION FOR HERO (Optional Enhancement) =====
// Uncomment below if you want a typing effect on the hero title

/*
const heroTitle = document.querySelector('.hero-title');
const titleText = "Hi, I'm Abdessamad Cherkaoui";
const gradientText = "Abdessamad Cherkaoui";
let charIndex = 0;

function typeText() {
  if (charIndex < titleText.length) {
    const currentText = titleText.substring(0, charIndex + 1);
    
    if (currentText.includes("Abdessamad Cherkaoui")) {
      const [before, name] = currentText.split("Abdessamad Cherkaoui");
      heroTitle.innerHTML = `${before}<span class="gradient-text">Abdessamad Cherkaoui</span>`;
    } else {
      heroTitle.textContent = currentText;
    }
    
    charIndex++;
    setTimeout(typeText, 50);
  }
}

// Start typing animation after page load
window.addEventListener('load', () => {
  setTimeout(typeText, 500);
});
*/

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== CURSOR EFFECT (Optional Premium Feature) =====
// Uncomment below for a custom cursor effect


const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;

    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add CSS for cursor
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  .custom-cursor {
    width: 10px;
    height: 10px;
    background: var(--color-accent-cyan);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  
  .cursor-follower {
    width: 30px;
    height: 30px;
    border: 2px solid var(--color-accent-purple);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    opacity: 0.5;
  }
`;
document.head.appendChild(cursorStyle);


// ===== THREE.JS 3D ELEMENT =====
if (typeof THREE !== 'undefined') {
    const container = document.getElementById('three-container');

    if (container) {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create torus knot geometry
        const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            shininess: 100,
            specular: 0x00f2fe,
            wireframe: false
        });

        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00f2fe, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0x667eea, 0.6);
        directionalLight2.position.set(-5, -5, -5);
        scene.add(directionalLight2);

        camera.position.z = 5;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation
        function animateThreeJS() {
            requestAnimationFrame(animateThreeJS);

            // Rotate the torus knot
            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.005;

            // Mouse interaction - smooth follow
            torusKnot.rotation.y += (mouseX * 0.5 - torusKnot.rotation.y) * 0.05;
            torusKnot.rotation.x += (mouseY * 0.5 - torusKnot.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }

        animateThreeJS();

        // Handle resize
        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }
}

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 14px; color: #00f2fe;');
console.log('%cInterested in working together? Let\'s connect!', 'font-size: 14px; color: #f093fb;');
console.log('%c📧 cherkaouiabdessamad9@gmail.com', 'font-size: 14px; color: #b4b4c8;');
