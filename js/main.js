// Initialize
document.addEventListener('DOMContentLoaded', () => {
    injectComponents();
    initCursor();
    initRobot();
    initFirebase();

    // Page Specific Loaders
    const path = window.location.pathname;
    if (path.includes('members')) loadMembers();
    if (path.includes('programs')) loadEvents();
    if (path.includes('gallery')) loadGallery();
    if (path.includes('index') || path === '/') initThreeJS();
    else initCanvasStars(); // Lightweight stars for inner pages

    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
});

// 1. COMPONENT INJECTION (Nav & Footer)
function injectComponents() {
    const links = [
        { n: 'Home', u: 'index.html' }, { n: 'About', u: 'about.html' },
        { n: 'Members', u: 'members.html' }, { n: 'Programs', u: 'programs.html' },
        { n: 'Gallery', u: 'gallery.html' }, { n: 'Contact', u: 'contact.html' }
    ];
    const active = window.location.pathname.split('/').pop() || 'index.html';
    const activeNormalized = (active === '' || active === '/') ? 'index.html' : active;

    // Nav
    const navHTML = `
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <i class="fas fa-meteor text-white"></i>
            </div>
            <span class="text-2xl font-bold tracking-wider text-white font-heading">AstroSoc</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
            ${links.map(l => `<a href="${l.u}" class="nav-link ${activeNormalized.includes(l.u) ? 'active' : ''}">${l.n}</a>`).join('')}
        </div>
        <button class="md:hidden text-white text-2xl mobile-toggle"><i class="fas fa-bars"></i></button>
    </div>
    <div class="mobile-menu hidden absolute top-20 left-0 w-full bg-black/95 p-6 text-center border-b border-white/10">
        ${links.map(l => `<a href="${l.u}" class="block py-3 text-white hover:text-cyan-400 mobile-menu-link">${l.n}</a>`).join('')}
    </div>`;

    const nav = document.createElement('nav');
    nav.innerHTML = navHTML;
    document.body.prepend(nav);

    // Mobile Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    const openMenu = () => {
        if (!menu) return;
        menu.classList.remove('hidden');
        menu.classList.add('active');
    };
    const closeMenu = () => {
        if (!menu) return;
        menu.classList.remove('active');
        menu.classList.add('hidden');
    };
    const toggleMenu = () => {
        if (!menu) return;
        if (menu.classList.contains('hidden')) openMenu();
        else closeMenu();
    };

    toggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu on link click
    document.querySelectorAll('.mobile-menu-link').forEach(a => {
        a.addEventListener('click', () => closeMenu());
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!menu || menu.classList.contains('hidden')) return;
        if (menu.contains(e.target) || toggleBtn?.contains(e.target)) return;
        closeMenu();
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) closeMenu();
    });

    // Footer (skip on admin)
    if (!activeNormalized.includes('admin')) {
        const foot = document.createElement('footer');
        foot.className = "relative z-50 bg-[#02040a] border-t border-white/10 pt-20 pb-10 mt-20 overflow-hidden";
        foot.innerHTML = `
            <!-- Decorative Top Glow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_var(--cyan-glow)]"></div>

            <div class="container mx-auto px-6">
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    <!-- Column 1: Brand Info -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <i class="fas fa-meteor text-white"></i>
                            </div>
                            <span class="text-2xl font-bold tracking-wider text-white" style="font-family: 'Orbitron', sans-serif;">AstroSoc</span>
                        </div>
                        <p class="text-gray-400 leading-relaxed">
                            Exploring the infinite cosmos, one star at a time. Join our mission to decode the universe through observation and research.
                        </p>
                    </div>

                    <!-- Column 2: Navigation -->
                    <div>
                        <h3 class="text-lg font-bold text-white mb-6 tracking-widest uppercase" style="font-family: 'Orbitron', sans-serif;">Mission Links</h3>
                        <ul class="space-y-4">
                            <li><a href="index.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> Home</a></li>
                            <li><a href="about.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> About Us</a></li>
                            <li><a href="members.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> The Team</a></li>
                            <li><a href="programs.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> Programs</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Resources / Gallery -->
                    <div>
                        <h3 class="text-lg font-bold text-white mb-6 tracking-widest uppercase" style="font-family: 'Orbitron', sans-serif;">Discover</h3>
                        <ul class="space-y-4">
                            <li><a href="gallery.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> Deep Space Gallery</a></li>
                            <li><a href="contact.html" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> Contact Support</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"><i class="fas fa-chevron-right text-xs text-purple-500"></i> Privacy Policy</a></li>
                        </ul>
                    </div>

                    <!-- Column 4: Connect -->
                    <div>
                        <h3 class="text-lg font-bold text-white mb-6 tracking-widest uppercase" style="font-family: 'Orbitron', sans-serif;">Signal Us</h3>
                        
                        <!-- Social Links -->
                        <div class="space-y-4">
                            <a href="https://whatsapp.com/channel/0029Vb6VSoc3GJOwXYCnfi10" target="_blank" class="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300">
                                <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition">
                                    <i class="fab fa-whatsapp text-green-400 group-hover:text-white"></i>
                                </div>
                                <span class="text-gray-300 group-hover:text-white">WhatsApp Channel</span>
                            </a>

                            <a href="https://www.instagram.com/aditya_taywade123" target="_blank" class="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300">
                                <div class="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition">
                                    <i class="fab fa-instagram text-pink-400 group-hover:text-white"></i>
                                </div>
                                <span class="text-gray-300 group-hover:text-white">Instagram</span>
                            </a>

                            <a href="https://www.linkedin.com/in/aditya-taywade-b514b4331" target="_blank" class="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300">
                                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition">
                                    <i class="fab fa-linkedin-in text-blue-400 group-hover:text-white"></i>
                                </div>
                                <span class="text-gray-300 group-hover:text-white">LinkedIn</span>
                            </a>
                        </div>

                        <div class="mt-6 flex items-center gap-2 text-sm text-gray-500">
                            <i class="fas fa-envelope text-cyan-500"></i>
                            <span>adityataywadeofficial@gmail.com</span>
                        </div>
                    </div>
                </div>

                <!-- Copyright Bar -->
                <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-gray-500 text-sm">
                        &copy; ${new Date().getFullYear()} Astronomy & Astrophysics Society. All rights reserved.
                    </p>
                    <p class="text-gray-600 text-xs uppercase tracking-widest">
                        Designed for the Stars
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(foot);
    }
}

// 2. ROBOT LOGIC
function initRobot() {
    const head = document.querySelector('.bot-head');
    const eyes = document.querySelectorAll('.eye');
    if (!head) return;
    document.addEventListener('mousemove', (e) => {
        const rect = head.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / 30;
        const y = (e.clientY - (rect.top + rect.height / 2)) / 30;
        head.style.transform = `rotateX(${-Math.max(-20, Math.min(20, y))}deg) rotateY(${Math.max(-20, Math.min(20, x))}deg)`;
        eyes.forEach(eye => eye.style.transform = `translate(${x / 2}px, ${y / 2}px)`);
    });
}

// 3. CURSOR TRAIL
function initCursor() {
    const cvs = document.createElement('canvas');
    cvs.id = 'cursor-canvas';
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    let points = [], mouse = { x: 0, y: 0 };

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const animate = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        points.push({ x: mouse.x, y: mouse.y, age: 0 });
        if (points.length > 25) points.shift();

        ctx.beginPath();
        if (points.length > 1) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                ctx.lineTo(p.x, p.y);
                p.age++;
            }
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f2fe';
        ctx.strokeStyle = ctx.createLinearGradient(0, 0, cvs.width, cvs.height);
        ctx.strokeStyle.addColorStop(0, '#764ba2');
        ctx.strokeStyle.addColorStop(1, '#00f2fe');
        ctx.stroke();
        requestAnimationFrame(animate);
    };
    animate();
}

// 4. THREE.JS PLANET (Homepage Only)
function initThreeJS() {
    const container = document.getElementById('bg-canvas');
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geo = new THREE.BufferGeometry();
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 10;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.02, color: 0x00f2fe });
    const sphere = new THREE.Points(geo, mat);
    scene.add(sphere);
    camera.position.z = 2;

    const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        renderer.render(scene, camera);
    };
    animate();
}

// 5. CANVAS STARS (Inner Pages)
function initCanvasStars() {
    let cvs = document.getElementById('bg-canvas');
    if (!cvs) {
        cvs = document.createElement('canvas');
        cvs.id = 'bg-canvas';
        document.body.appendChild(cvs);
    }
    if (cvs.tagName.toLowerCase() !== 'canvas') {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        cvs.replaceWith(canvas);
        cvs = canvas;
    }
    const ctx = cvs.getContext('2d');
    let stars = [];
    const resize = () => {
        cvs.width = window.innerWidth; cvs.height = window.innerHeight;
        stars = Array(100).fill().map(() => ({
            x: Math.random() * cvs.width, y: Math.random() * cvs.height, r: Math.random() * 2, s: Math.random() * 0.5
        }));
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "white";
        stars.forEach(s => {
            s.y -= s.s;
            if (s.y < 0) s.y = cvs.height;
            ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animate);
    };
    animate();
}

// 6. FIREBASE DATA LOADING
let db;
function initFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(CONFIG.firebase);
        db = firebase.database();
    }
}

function loadMembers() {
    if (!db) return;
    db.ref('members').once('value', snap => {
        const data = snap.val() || {};
        const grid = document.getElementById('membersGrid');
        if (grid) {
            grid.innerHTML = Object.values(data).map(m => `
                <div class="holo-card p-6 text-center group">
                    <div class="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600 mb-4">
                        <img src="${m.image}" class="w-full h-full object-cover rounded-full border-4 border-black">
                    </div>
                    <h3 class="text-xl font-bold text-white">${m.name}</h3>
                    <p class="text-cyan-400 text-sm mb-2">${m.role}</p>
                    <p class="text-gray-400 text-xs">${m.branch} • ${m.year}</p>
                </div>
            `).join('');
        }
    });
}

function loadEvents() {
    if (!db) return;
    db.ref('events').once('value', snap => {
        const data = snap.val() || {};
        const grid = document.getElementById('eventsGrid');
        if (grid) {
            grid.innerHTML = Object.values(data).map(e => `
                <div class="holo-card group overflow-hidden">
                    <div class="h-48 overflow-hidden">
                        <img src="${e.image}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                    </div>
                    <div class="p-6">
                        <span class="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">${e.category}</span>
                        <h3 class="text-xl font-bold mt-2 mb-2">${e.title}</h3>
                        <p class="text-gray-400 text-sm mb-4 line-clamp-2">${e.shortDesc}</p>
                        <div class="flex justify-between text-xs text-cyan-400">
                            <span><i class="far fa-calendar mr-1"></i>${e.date}</span>
                            <span><i class="fas fa-map-marker-alt mr-1"></i>${e.location}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    });
}

function loadGallery() {
    if (!db) return;
    db.ref('gallery').once('value', snap => {
        const data = snap.val() || {};
        const grid = document.getElementById('galleryGrid');
        if (grid) {
            grid.innerHTML = Object.values(data).map(g => `
                <div class="holo-card overflow-hidden cursor-pointer group relative h-64">
                    <img src="${g.url}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                        <p class="text-white font-bold">${g.caption}</p>
                    </div>
                </div>
            `).join('');
        }
    });
}