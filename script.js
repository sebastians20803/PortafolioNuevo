document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in, .project-card');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                
                // Si es un contador, inicializarlo
                if(entry.target.classList.contains('counter')) {
                    startCounter(entry.target);
                }
                
                // Si es una barra de habilidad, animarla
                if(entry.target.classList.contains('bar-fill')) {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                }

                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Observar también barras de progreso y contadores específicamente
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
        bar.setAttribute('data-width', bar.style.width); // Guardar el width original
        bar.style.width = '0%'; // Empezar en 0
        appearOnScroll.observe(bar);
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => appearOnScroll.observe(counter));

    // 2. Función de contador animado
    function startCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + (counter.getAttribute('data-suffix') || '');
            }
        };
        updateCounter();
    }

    // 3. Highlight Active Link on Scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#header_opciones a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active-link");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active-link");
            }
        });
        
        // Sticky Header Effect
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Contact Form Interaction
    const form = document.getElementById('form-contact');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>&#10003;</span> Mensaje Enviado';
            btn.style.backgroundColor = '#2c3e50';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                form.reset();
            }, 3000);
        });
    }
});
