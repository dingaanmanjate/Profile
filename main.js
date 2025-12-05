document.addEventListener('DOMContentLoaded', () => {

    // --- Accordion Logic ---
    const headers = document.querySelectorAll('.accordion-header');

    // Function to calculate and set explicit height for animation
    const setHeight = (element) => {
        const content = element.nextElementSibling;
        content.style.height = content.scrollHeight + 'px';
    };

    const clearHeight = (element) => {
        const content = element.nextElementSibling;
        content.style.height = '0';
    };

    // Initialize the active section
    const activeSection = document.querySelector('.accordion-section.active');
    if (activeSection) {
        const header = activeSection.querySelector('.accordion-header');
        setHeight(header);
    }

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentSection = header.parentElement;
            const isCurrentlyActive = currentSection.classList.contains('active');

            // Close all sections first
            document.querySelectorAll('.accordion-section').forEach(section => {
                section.classList.remove('active');
                clearHeight(section.querySelector('.accordion-header'));
            });

            // If it wasn't active before, open it now
            if (!isCurrentlyActive) {
                currentSection.classList.add('active');
                setHeight(header);
            }
        });
    });

    // Handle resize to auto-adjust heights of active section
    window.addEventListener('resize', () => {
        const active = document.querySelector('.accordion-section.active .accordion-header');
        if (active) setHeight(active);
    });


    // --- Hero Background Animation (Canvas) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const initCanvas = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5; // Faster movement
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 3 + 1; // Larger particles
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Brighter dots
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            const count = Math.floor(width * height / 6000); // 2x Density
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - dist / 120})`; // Much brighter connections
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        };

        initCanvas();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            initCanvas();
            createParticles();
        });
    }

    // --- Cert Details Logic (Inline Dropdown) ---
    // REMOVED - Converted to direct links with tooltips per user request.
});
