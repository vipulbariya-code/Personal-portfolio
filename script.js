document.getElementById('year').textContent = new Date().getFullYear();

/* Theme switcher */
const themeToggle = document.getElementById('themeToggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (themeColor) themeColor.setAttribute('content', theme === 'light' ? '#f7f8fc' : '#0a0c12');
    if (themeToggle) {
        const isLight = theme === 'light';
        themeToggle.setAttribute('aria-pressed', String(isLight));
        themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    }
}

if (themeToggle) {
    setTheme(document.documentElement.dataset.theme || 'dark');
    themeToggle.addEventListener('click', () => {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
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

    function startLoaderTimer() {
        setTimeout(hideLoader, 300); /* show loader for 0.3 seconds */
    }

    if (loader) {
        if (document.readyState === 'complete') {
            startLoaderTimer();
        } else {
            window.addEventListener('load', startLoaderTimer);
        }
        /* Safety net: never let the loader get stuck on screen */
        window.addEventListener('load', () => setTimeout(hideLoader, 6000));
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
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));

    } else {
        /* Fallback for browsers without IntersectionObserver */
        revealEls.forEach(el => el.classList.add('in'));
    }
}

/* Skills bar animation */
const skillBars = document.querySelectorAll('.bar i[data-w]');

if (skillBars.length) {

    if ('IntersectionObserver' in window) {

        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-w') + '%';
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.4 });

        skillBars.forEach(bar => barObserver.observe(bar));

    } else {
        skillBars.forEach(bar => { bar.style.width = bar.getAttribute('data-w') + '%'; });
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
                b.setAttribute('aria-selected', 'false');
            });

            btn.classList.add('active');
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

    let rx = 0, ry = 0, gx = 0, gy = 0, mx = 0, my = 0;

    window.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function loop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        gx += (mx - gx) * 0.09;
        gy += (my - gy) * 0.09;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(loop);
    }

    loop();

    document.querySelectorAll('a, button, input, textarea, select, label').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
}

/* Header */
const header = document.getElementById('siteHeader');
const backtotop = document.getElementById('backtotop');

if (header && backtotop) {

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
        backtotop.classList.toggle('show', window.scrollY > 500);
    });

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
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

/* Mobile Menu */

const hamburger = document.getElementById('hamburgerBtn');
const mmenu = document.getElementById('mobile-menu');

if (hamburger && mmenu) {

    hamburger.addEventListener('click', () => {

        const open = mmenu.classList.toggle('open');

        hamburger.setAttribute('aria-expanded', open);

    });

    mmenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mmenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

}

/* Contact */

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            status.textContent = "Please complete all required fields with a valid email address.";
            return;
        }

        const data = new FormData(form);
        const subject = data.get('subject');
        const message = [
            `Name: ${data.get('name')}`,
            `Email: ${data.get('email')}`,
            '',
            data.get('message')
        ].join('
');
        const mailto = `mailto:vipulvbariya31@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

        status.textContent = "Opening your email app to send the message.";
        // Note: Using mailto: is a client-side solution. For more robust contact forms, a server-side script is recommended.
        window.location.href = mailto;
        form.reset();

    });

}

/* Enhanced Project Card Image Lazy Loading */
const projectImages = document.querySelectorAll('.project-image[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const loader = img.parentElement.querySelector('.image-loader');
                
                img.src = img.dataset.src || img.src; // Use data-src if available
                img.onload = () => {
                    img.classList.add('loaded');
                    if (loader) {
                       loader.style.display = 'none';
                    }
                };
                img.onerror = () => {
                    // Handle image load error if needed
                    if (loader) {
                       loader.style.display = 'none';
                    }
                };
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });

    projectImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for older browsers
    projectImages.forEach(img => {
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        const loader = img.parentElement.querySelector('.image-loader');
        if (loader) loader.style.display = 'none';
    });
}
