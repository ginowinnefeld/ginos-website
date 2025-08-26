// Simple Portfolio JavaScript - Lindy-inspired
(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeAnimations();
        initializeCounters();
        initializeSmoothScrolling();
    });

    // Intersection Observer for fade-in animations
    function initializeAnimations() {
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver(
            function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all sections for animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Counter animations for metrics
    function initializeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver(
            function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    // Animate individual counter
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = prefersReducedMotion ? 100 : 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeProgress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Smooth scrolling for anchor links
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Add hover effects to cards
    function addCardEffects() {
        const cards = document.querySelectorAll('.metric-card, .service-card, .methodology-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!prefersReducedMotion) {
                    this.style.transform = 'translateY(-5px)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize card effects when DOM is loaded
    document.addEventListener('DOMContentLoaded', addCardEffects);

    // Handle window resize for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Add any resize-specific logic here if needed
        }, 250);
    });

    // Error handling
    window.addEventListener('error', function(e) {
        console.warn('Portfolio JS Error:', e.message);
    });

    // Simple performance logging
    window.addEventListener('load', function() {
        if (window.performance && window.performance.now) {
            const loadTime = Math.round(window.performance.now());
            console.log(`Portfolio loaded in ${loadTime}ms`);
        }
    });

})();