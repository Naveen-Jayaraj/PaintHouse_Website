/* =========================================
   1. DATA SOURCE
   ========================================= */
const projects = [
    {
        id: "green-villa",
        name: "Green Villa Restoration",
        type: "exterior",
        thumb: "https://images.unsplash.com/photo-1600596542815-e495d9159f8e?auto=format&fit=crop&q=80&w=600",
        hero: "https://images.unsplash.com/photo-1600596542815-e495d9159f8e?auto=format&fit=crop&q=80&w=1200",
        desc: "We breathed new life into this classic hillside villa. The owners wanted a look that respected tradition but felt modern. We used a custom mix of weather-resistant paints.",
        location: "Hillside Ave, Metro City",
        highlights: ["Color Matching: Heritage Green", "Full Sanding & Priming", "5-Year Weather Warranty"]
    },
    {
        id: "downtown-office",
        name: "Tech Hub Office",
        type: "commercial",
        thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
        hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
        desc: "A high-energy startup needed a workspace to match their ambition. We used energetic teals and calming greys to create productivity zones.",
        location: "Downtown District",
        highlights: ["Low-VOC Eco Paints", "Weekend Execution", "Geometric Accent Walls"]
    },
    {
        id: "modern-apt",
        name: "Lakeside Minimalist",
        type: "interior",
        thumb: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
        hero: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
        desc: "Less is more. A complete interior refresh using warm whites and soft beiges to maximize natural light.",
        location: "Lakeside",
        highlights: ["Matte Finish Walls", "Cabinet Refinishing", "Trim & Molding Detail"]
    },
    {
        id: "retail-shop",
        name: "Neon Boutique",
        type: "commercial",
        thumb: "https://images.unsplash.com/photo-1556740758-90de2929e507?auto=format&fit=crop&q=80&w=600",
        hero: "https://images.unsplash.com/photo-1556740758-90de2929e507?auto=format&fit=crop&q=80&w=1200",
        desc: "A bold statement for a bold brand. High-gloss facade painting to attract customers and stand out on the street.",
        location: "Main Street",
        highlights: ["High-Gloss Finish", "Graffiti-Resistant Coating", "Custom Stencil Work"]
    }
];

const blogPosts = [
    {
        slug: "choosing-colors",
        title: "Psychology of Color",
        date: "Oct 15, 2024",
        excerpt: "Why does blue make you calm and red make you hungry? A guide to picking the perfect palette...",
        content: "<p>Choosing paint colors is about lighting, mood, and existing furniture. Always test samples on your wall at different times of the day.</p><p>For small rooms, lighter colors make the space feel bigger. For cozy vibes, go dark.</p>"
    },
    {
        slug: "matte-vs-gloss",
        title: "Matte vs. Gloss Guide",
        date: "Sep 22, 2024",
        excerpt: "Understanding paint finishes is key to durability and aesthetics.",
        content: "<p><strong>Matte:</strong> Hides imperfections but is harder to clean. Great for ceilings.</p><p><strong>Gloss:</strong> Durable and shiny. Perfect for trim and doors.</p>"
    }
];

/* =========================================
   2. INITIALIZATION & HELPERS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderCarousel();
    renderProjects('all');
    renderBlog();
    initIntersectionObserver();
    initContactForm();
    initTypeWriter();
    initFanDeck(); 
});

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================
   3. NAVIGATION
   ========================================= */
function initNavigation() {
    const mobileBtn = $('.mobile-menu-btn');
    const nav = $('.main-nav');
    const body = document.body;
    
    // Toggle Menu
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        mobileBtn.classList.toggle('active'); // Add animation class to hamburger
        
        // Prevent background scrolling when menu is open
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });

    // Close on Link Click
    $$('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileBtn.classList.remove('active');
            body.style.overflow = 'auto'; // Restore scroll
        });
    });

    // Close on Click Outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileBtn.contains(e.target)) {
            nav.classList.remove('active');
            mobileBtn.classList.remove('active');
            body.style.overflow = 'auto'; // Restore scroll
        }
    });
}

/* =========================================
   4. CAROUSEL
   ========================================= */
function renderCarousel() {
    const track = $('.carousel-track');
    projects.forEach(p => {
        const slide = document.createElement('div');
        slide.className = 'carousel-item';
        slide.innerHTML = `<img src="${p.thumb}" alt="${p.name}"><div class="carousel-caption">${p.name}</div>`;
        slide.addEventListener('click', () => openProjectModal(p.id));
        track.appendChild(slide);
    });
}

/* =========================================
   5. PROJECT GRID
   ========================================= */
function renderProjects(filter) {
    const grid = $('#project-grid');
    grid.innerHTML = ''; 
    const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        card.innerHTML = `
            <div class="card-img"><img src="${p.thumb}" alt="${p.name}"></div>
            <div class="card-body"><div class="card-tag">${p.type}</div><h3>${p.name}</h3></div>
        `;
        card.addEventListener('click', () => openProjectModal(p.id));
        grid.appendChild(card);
    });
    initIntersectionObserver();
}

$$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProjects(e.target.dataset.filter);
    });
});

/* =========================================
   6. FAN DECK & CALCULATOR
   ========================================= */
let deckPages = []; 

function initFanDeck() {
    // 1. Initialize Toggle Button Logic
    const toggleBtn = document.getElementById('deck-toggle-btn');
    const content = document.getElementById('deck-collapsible');
    
    if(toggleBtn && content) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = content.classList.contains('is-open');
            if(isOpen) {
                content.classList.remove('is-open');
                toggleBtn.innerHTML = `<span>🎨</span> Open Color Studio`;
            } else {
                content.classList.add('is-open');
                toggleBtn.innerHTML = `<span>✕</span> Close Studio`;
            }
        });
    }

    // 2. Existing Generation Logic
    const grid = document.getElementById('fan-deck-grid');
    if (!grid) return;

    // Define the "Pages" of the fan deck
    const pageDefinitions = [
        { family: 'neutral', hue: 210, sat: 5, startLight: 98, name: "Pure Whites" },
        { family: 'neutral', hue: 40, sat: 15, startLight: 95, name: "Warm Beiges" },
        { family: 'neutral', hue: 200, sat: 10, startLight: 90, name: "Cool Greys" },
        { family: 'red', hue: 350, sat: 70, startLight: 95, name: "Blush Pinks" },
        { family: 'red', hue: 0, sat: 80, startLight: 90, name: "True Reds" },
        { family: 'red', hue: 10, sat: 75, startLight: 92, name: "Terracottas" },
        { family: 'orange', hue: 25, sat: 85, startLight: 95, name: "Peaches" },
        { family: 'orange', hue: 45, sat: 80, startLight: 90, name: "Ambers" },
        { family: 'yellow', hue: 50, sat: 90, startLight: 95, name: "Lemons" },
        { family: 'yellow', hue: 55, sat: 85, startLight: 92, name: "Golds" },
        { family: 'green', hue: 90, sat: 50, startLight: 95, name: "Sages" },
        { family: 'green', hue: 150, sat: 70, startLight: 90, name: "Emeralds" },
        { family: 'blue', hue: 210, sat: 70, startLight: 92, name: "Skies" },
        { family: 'blue', hue: 240, sat: 50, startLight: 85, name: "Navies" },
        { family: 'purple', hue: 260, sat: 60, startLight: 95, name: "Lavenders" },
        { family: 'purple', hue: 280, sat: 65, startLight: 92, name: "Violets" }
    ];

    // Generate Data
    deckPages = pageDefinitions.map((def, index) => {
        const colors = [];
        for (let i = 0; i < 6; i++) {
            let l = def.startLight - (i * 12); 
            if(l < 10) l = 10;
            const hex = hslToHex(def.hue, def.sat, l);
            const textColor = l > 60 ? '#1e293b' : '#ffffff';
            colors.push({
                name: `${def.name} ${i+1}`,
                hex: hex,
                textColor: textColor,
                code: `${def.family.charAt(0).toUpperCase()}${index}-${100 + (i*10)}`
            });
        }
        return { id: index, family: def.family, title: def.name, code: `PG-${index+1}`, colors: colors };
    });

    renderDeck(deckPages);

    // Filters
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            $$('.cat-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const fam = e.target.dataset.family;
            if (fam === 'all') renderDeck(deckPages);
            else renderDeck(deckPages.filter(p => p.family === fam));
        });
    });
}

function renderDeck(pages) {
    const grid = document.getElementById('fan-deck-grid');
    grid.innerHTML = '';
    
    pages.forEach(page => {
        const card = document.createElement('div');
        card.className = 'strip-card fade-in';
        let bandsHtml = '';
        page.colors.forEach(c => { bandsHtml += `<div class="mini-band" style="background-color: ${c.hex}"></div>`; });

        card.innerHTML = `
            <div class="strip-preview-bands">${bandsHtml}</div>
            <div class="strip-footer">
                <span class="strip-name">${page.title}</span>
                <span class="strip-code">${page.code}</span>
            </div>
        `;
        card.addEventListener('click', () => openStripModal(page));
        grid.appendChild(card);
    });
    initIntersectionObserver();
}

function openStripModal(page) {
    const modalList = document.getElementById('modal-strip-list');
    document.getElementById('modal-strip-id').innerText = page.code;
    document.getElementById('modal-strip-name').innerText = page.title;
    modalList.innerHTML = '';
    
    page.colors.forEach(c => {
        const bar = document.createElement('div');
        bar.className = 'color-bar';
        bar.style.backgroundColor = c.hex;
        bar.style.color = c.textColor; 
        bar.innerHTML = `<span class="cb-name">${c.name}</span><span class="cb-hex">${c.hex}</span><div class="copy-toast">Copied!</div>`;
        
        bar.addEventListener('click', (e) => {
            navigator.clipboard.writeText(c.hex);
            const toast = bar.querySelector('.copy-toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1500);
        });
        modalList.appendChild(bar);
    });
    openModal('strip-modal');
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function calculatePaint() {
    const width = parseFloat(document.getElementById('calc-width').value) || 0;
    const height = parseFloat(document.getElementById('calc-height').value) || 0;
    const coats = parseInt(document.getElementById('calc-coats').value) || 2;
    const gallons = ((width * height * coats) / 350).toFixed(1);
    document.getElementById('gallons').innerText = gallons;
}

/* =========================================
   7. MODAL UTILITIES
   ========================================= */
function openProjectModal(id) {
    const p = projects.find(proj => proj.id === id);
    if (!p) return;
    const modalBody = $('#project-modal-body');
    const highlightsHtml = p.highlights.map(h => `<li><span style="color:var(--highlight)">✦</span> ${h}</li>`).join('');
    modalBody.innerHTML = `
        <img src="${p.hero}" class="modal-hero" alt="${p.name}">
        <div class="modal-body-content">
            <span class="modal-meta">${p.type.toUpperCase()} | ${p.location}</span>
            <h2>${p.name}</h2>
            <p style="font-size: 1.1rem; margin-bottom: 20px;">${p.desc}</p>
            <ul style="margin-bottom: 30px; font-weight: 700; color: #475569;">${highlightsHtml}</ul>
            <a href="#contact" class="btn btn-primary" onclick="closeModal('project-modal')">Request Quote</a>
        </div>
    `;
    openModal('project-modal');
}

function renderBlog() {
    const list = $('#blog-list');
    const search = $('#blog-search');
    const render = (query = '') => {
        list.innerHTML = '';
        const filtered = blogPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()));
        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card fade-in';
            card.innerHTML = `
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p style="color: #64748b; margin-bottom: 15px;">${post.excerpt}</p>
                <span style="color: var(--primary); font-weight: 800; font-size: 0.8rem;">Read Article &rarr;</span>
            `;
            card.addEventListener('click', () => openBlogModal(post));
            list.appendChild(card);
        });
        initIntersectionObserver();
    };
    render();
    search.addEventListener('input', (e) => render(e.target.value));
}

function openBlogModal(post) {
    const body = $('#blog-modal-body');
    body.innerHTML = `
        <div class="modal-body-content">
            <span class="modal-meta">${post.date}</span>
            <h2>${post.title}</h2>
            <hr style="margin: 20px 0; border:0; border-top:1px solid #e2e8f0;">
            <div class="blog-content" style="font-size: 1.1rem; color: #334155;">${post.content}</div>
        </div>
    `;
    openModal('blog-modal');
}

function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

$$('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) closeModal(modal.id);
    });
});

/* =========================================
   8. TYPING & ANIMATION
   ========================================= */
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        if (this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); } 
        else { this.txt = fullTxt.substring(0, this.txt.length + 1); }
        this.txtElement.innerHTML = `<span class="wrap">${this.txt}</span>`;
        let typeSpeed = 200;
        if (this.isDeleting) { typeSpeed /= 2; }
        if (!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; } 
        else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
        setTimeout(() => this.type(), typeSpeed);
    }
}
function initTypeWriter() {
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if(entry.target.querySelector('.counter')) {
                    const counter = entry.target.querySelector('.counter');
                    animateCounter(counter);
                    observer.unobserve(entry.target); 
                }
            }
        });
    }, { threshold: 0.1 });
    $$('.fade-in').forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    let current = 0;
    const increment = target / 50;
    const update = () => {
        current += increment;
        if (current < target) { el.innerText = Math.ceil(current) + "+"; requestAnimationFrame(update); } 
        else { el.innerText = target + "+"; }
    };
    update();
}

function initContactForm() {
    const form = $('#contact-form');
    const status = $('#form-status');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        status.innerText = "Sending...";
        status.style.color = "white";
        try {
            const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
                method: "POST", body: data, headers: { 'Accept': 'application/json' }
            });
            if (response.ok) { status.innerText = "Message sent!"; status.style.color = "#4ade80"; form.reset(); } 
            else { status.innerText = "Error sending."; status.style.color = "#f87171"; }
        } catch (error) { status.innerText = "Connection error."; status.style.color = "#f87171"; }
    });
}