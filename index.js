document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header Dinâmico (Scroll State)
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    // Executa uma vez no início caso a página seja recarregada já com scroll
    handleHeaderScroll();


    /* ==========================================================================
       2. Menu Mobile (Hamburguer)
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        
        // Troca o ícone (fa-bars <-> fa-xmark)
        const icon = menuToggle.querySelector('i');
        if (isActive) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fecha o menu ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       3. FAQ Accordion (Acessível)
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Fecha outros itens abertos (opcional, melhora a experiência de acordeão clássico)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    const otherBody = otherItem.querySelector('.accordion-body');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherBody.setAttribute('hidden', '');
                }
            });
            
            // Alterna o estado do item atual
            item.classList.toggle('active');
            header.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                body.setAttribute('hidden', '');
            } else {
                body.removeAttribute('hidden');
            }
        });
    });


    /* ==========================================================================
       4. Animação de Scroll (Intersection Observer)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.animate-fade-in');
    
    const observerOptions = {
        root: null, // viewport do navegador
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    };
    
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Para de observar depois que o elemento aparece
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        elementObserver.observe(element);
    });


    /* ==========================================================================
       5. Scroll Suave para Links de Âncora (Fallback)
       ========================================================================== */
    // A propriedade CSS scroll-behavior: smooth já resolve na maioria dos navegadores modernos,
    // mas este trecho garante comportamento uniforme em links internos.
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    
    allInternalLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Apenas para links internos que não sejam vazios
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerOffset = 90; // Compensação da altura do header fixo
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* ==========================================================================
       6. Interatividade da Foto de Perfil (Revelação por Pintura Estilo Ink Spreading)
       ========================================================================== */
    const profileContainer = document.getElementById('profile-interactive-container');
    
    if (profileContainer) {
        const circles = [
            { id: 'clip-circle-1', maxR: 0.9, delay: 0 },
            { id: 'clip-circle-2', maxR: 0.7, delay: 80 },
            { id: 'clip-circle-3', maxR: 0.8, delay: 160 },
            { id: 'clip-circle-4', maxR: 0.75, delay: 240 },
            { id: 'clip-circle-5', maxR: 0.7, delay: 120 },
            { id: 'clip-circle-6', maxR: 0.65, delay: 200 },
            { id: 'clip-circle-7', maxR: 0.6, delay: 280 }
        ];

        const triggerPaint = () => {
            if (profileContainer.classList.contains('painted')) return;
            
            profileContainer.classList.add('painted');
            
            circles.forEach(c => {
                const el = document.getElementById(c.id);
                if (el) {
                    setTimeout(() => {
                        let start = null;
                        const duration = 1200; // ms
                        
                        function step(timestamp) {
                            if (!start) start = timestamp;
                            const progress = Math.min((timestamp - start) / duration, 1);
                            
                            // Efeito de facilitação easeOutCubic para a expansão do fluido
                            const easeProgress = 1 - Math.pow(1 - progress, 3);
                            el.setAttribute('r', easeProgress * c.maxR);
                            
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            }
                        }
                        requestAnimationFrame(step);
                    }, c.delay);
                }
            });
        };

        // Dispara ao passar o mouse (desktop) ou ao clicar/tocar (mobile e fallback)
        profileContainer.addEventListener('mouseenter', triggerPaint);
        profileContainer.addEventListener('click', triggerPaint);
    }

});
