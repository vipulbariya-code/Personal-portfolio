const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* Theme switcher */
const themeToggle = document.getElementById('themeToggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // Handle restricted storage environments
    }
    if (themeColor) {
        themeColor.setAttribute('content', theme === 'light' ? '#f7f8fc' : '#0a0c12');
    }
    if (themeToggle) {
        const isLight = theme === 'light';
        themeToggle.setAttribute('aria-pressed', String(isLight));
        themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    }
}

if (themeToggle) {
    let currentTheme = 'dark';
    try {
        currentTheme = localStorage.getItem('theme') || document.documentElement.dataset.theme || 'dark';
    } catch (e) {
        currentTheme = document.documentElement.dataset.theme || 'dark';
    }
    setTheme(currentTheme);
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });
}

/* Loader */
(function () {
    const loader = document.getElementById('loader');

    function hideLoader() {
        if (!loader || loader.dataset.hidden === "true") return;
        loader.dataset.hidden = "true";
        loader.classList.add('hide');

        setTimeout(() => {
            loader.style.display = "none";
        }, 800); /* matches the .8s fade-out transition defined in CSS */
    }

    if (loader) {
        if (document.readyState === 'complete') {
            setTimeout(hideLoader, 300);
        } else {
            window.addEventListener('load', () => setTimeout(hideLoader, 300));
            document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1200));
        }
        /* Safety net: guarantees loader hides even if network or external assets hang */
        setTimeout(hideLoader, 2500);
    }
})();

/* Scroll reveal animation */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        /* Fallback for browsers without IntersectionObserver */
        revealEls.forEach(el => el.classList.add('in'));
    }
}

/* Project filters */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectGrid .pcard, #projectGrid .project-card-enhanced');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
                b.setAttribute('aria-selected', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (card.classList.contains('legacy')) return;
                const cat = card.getAttribute('data-cat');
                const show = filter === 'all' || cat === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });
}

/* Typing effect cursor (editor code block) */
const typedTail = document.getElementById('typedTail');
if (typedTail) {
    typedTail.innerHTML = '<span class="typed-cursor">&nbsp;</span>';
}

/* Custom cursor */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const glow = document.getElementById('cursorGlow');

if (dot && ring && glow && window.matchMedia('(hover: hover)').matches) {
    let rx = -100, ry = -100, gx = -100, gy = -100, mx = -100, my = -100;
    let initialized = false;

    window.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        if (!initialized) {
            rx = mx;
            ry = my;
            gx = mx;
            gy = my;
            dot.style.opacity = '1';
            ring.style.opacity = '1';
            glow.style.opacity = '1';
            initialized = true;
        }
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function loop() {
        if (initialized) {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            gx += (mx - gx) * 0.09;
            gy += (my - gy) * 0.09;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            glow.style.left = gx + 'px';
            glow.style.top = gy + 'px';
        }
        requestAnimationFrame(loop);
    }

    loop();

    document.querySelectorAll('a, button, input, textarea, select, label').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
}

/* Header & Back to Top */
const header = document.getElementById('siteHeader');
const backtotop = document.getElementById('backtotop');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
}

if (backtotop) {
    window.addEventListener('scroll', () => {
        backtotop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    backtotop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Scroll Progress Bar */
const progressBar = document.getElementById('progressBar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }, { passive: true });
}

/* Mobile Menu */
const hamburger = document.getElementById('hamburgerBtn');
const mmenu = document.getElementById('mobile-menu');

if (hamburger && mmenu) {
    function closeMobileMenu() {
        mmenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const open = mmenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    mmenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mmenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
}

/* Active Navigation Highlighting */
(function() {
    const desktopLinks = document.querySelectorAll('nav[aria-label="Primary"] a');
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    const allNavLinks = [...desktopLinks, ...mobileLinks];

    const sectionIds = ['top', 'about', 'skills', 'work', 'certifications', 'services', 'timeline', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    function setActiveLink(activeId) {
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${activeId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    if (sections.length) {
        function updateActiveByScroll() {
            const scrollPos = window.scrollY + 220;
            const scrollBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

            if (scrollBottom) {
                setActiveLink('contact');
                return;
            }

            if (window.scrollY < 120) {
                setActiveLink('top');
                return;
            }

            let currentSectionId = 'top';
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                if (scrollPos >= section.offsetTop) {
                    currentSectionId = section.getAttribute('id');
                }
            }
            setActiveLink(currentSectionId);
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveByScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial invocation
        updateActiveByScroll();
    }
})();

/* Contact */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            status.style.color = "#f43f5e";
            status.textContent = "Please complete all required fields with a valid email address.";
            return;
        }

        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        const email = (data.get('email') || '').trim();
        const subject = (data.get('subject') || '').trim() || 'Portfolio / Internship Inquiry';
        const message = (data.get('message') || '').trim();

        const fullMessage = [
            `From: ${name}`,
            `Email: ${email}`,
            '',
            `Message:`,
            message
        ].join('\n');

        const mailto = `mailto:vipulvbariya31@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullMessage)}`;

        status.style.color = "var(--teal, #5eead4)";
        status.textContent = "Opening your default email application to send the message...";
        window.location.href = mailto;
        form.reset();
    });
}

/* Enhanced Project Card Image Lazy Loading */
const projectImages = document.querySelectorAll('.project-image');

function markImageLoaded(img) {
    img.classList.add('loaded');
    const container = img.closest('.project-image-container');
    if (container) {
        const loader = container.querySelector('.image-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

projectImages.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
        markImageLoaded(img);
    } else {
        img.addEventListener('load', () => markImageLoaded(img));
        img.addEventListener('error', () => markImageLoaded(img));
    }
});

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                if (img.complete && img.naturalWidth !== 0) {
                    markImageLoaded(img);
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });

    projectImages.forEach(img => imageObserver.observe(img));
}
