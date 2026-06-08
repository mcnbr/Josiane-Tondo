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
       6. Interatividade da Foto de Perfil (Suporte para Mobile Touch)
       ========================================================================== */
    const profileContainer = document.getElementById('profile-interactive-container');
    
    if (profileContainer) {
        // Alterna a classe 'active' ao tocar no smartphone para acionar o efeito hover-like
        profileContainer.addEventListener('click', (e) => {
            profileContainer.classList.toggle('active');
        });
        
        // Remove a classe 'active' caso o usuário toque fora do contêiner da foto
        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target)) {
                profileContainer.classList.remove('active');
            }
        });
    }

});
