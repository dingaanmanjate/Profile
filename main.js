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


    // --- Particle Animation (Reusable) ---
    const initParticleSystem = (canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

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
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 3 + 1;
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
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            const count = Math.floor(width * height / 6000);
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
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - dist / 120})`;
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
    };

    // Initialize for Hero and Footer
    initParticleSystem('hero-canvas');
    initParticleSystem('footer-canvas');

    // --- Cert Details Logic (Inline Dropdown) ---
    const certIcons = document.querySelectorAll('.cert-icon-badge');
    const detailsPanel = document.getElementById('cert-details-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailLink = document.getElementById('detail-link');

    // Certificate Data Dictionary
    const certData = {
        "AWS SAA": {
            title: "AWS Certified Solutions Architect Associate (Exam Prep)",
            desc: "Validated expertise in designing distributed systems on AWS, focusing on scalability, security, and cost-optimization.",
            link: "https://coursera.org/verify/DY6ZEG0LDSU7"
        },
        "GenAI LLM": {
            title: "Generative AI with Large Language Models",
            desc: "Expert-level validation of designing and managing robust, secure, and scalable Google Cloud architectures.",
            link: "https://coursera.org/verify/TY55QEZUMR4P"
        },
        "Kubernetes": {
            title: "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
            desc: "Demonstrated competence in installation, configuration, and management of production-grade Kubernetes clusters.",
            link: "https://coursera.org/verify/TZV4EM4A3CGD"
        },
        "DevOps AWS": {
            title: "DevOps on AWS: Code, Build, and Test",
            desc: "Global certification validating baseline skills for core security functions and pursuing an IT security career.",
            link: "https://coursera.org/verify/OBZNTW61990N"
        },
        "Cloud Arch": {
            title: "Cloud Architecture Design Patterns",
            desc: "Advanced security certification proving effective design, implementation, and management of cybersecurity programs.",
            link: "https://coursera.org/verify/TJRLFI9A57QH"
        },
        "Data Lakes": {
            title: "Building Data Lakes on AWS",
            desc: "Understand and know how to look for weaknesses and vulnerabilities in target systems using the same knowledge and tools as a malicious hacker.",
            link: "https://coursera.org/verify/YNR4QGTLK8VF"
        },
        "Jira Agile": {
            title: "Agile with Atlassian Jira",
            desc: "The gold standard in project management, validating competence to lead and direct projects and teams.",
            link: "https://coursera.org/verify/CCM1A74OX7LA"
        },
        "Git": {
            title: "Version Control with Git",
            desc: "Understanding of the Scrum framework and how to help teams use it to increase the likelihood of the project's overall success.",
            link: "https://coursera.org/verify/5OFOQ29ISPPA"
        },
        "AWS Essentials": {
            title: "AWS Cloud Technical Essentials",
            desc: "Understanding the ITIL framework for IT Service Management and how to align IT services with business needs.",
            link: "https://coursera.org/verify/VJVT6MZ87NUG"
        },
        "Google AI": {
            title: "Google Cloud: Introduction to Generative AI",
            desc: "Validates skillset with Docker Enterprise Edition and Docker Swarm for container orchestration.",
            link: "https://coursera.org/verify/JJNL8UCUV4NB"
        },
        "Time Mgmt": {
            title: "Work Smarter, Not Harder: Time Management",
            desc: "Cloud engineering skills in infrastructure automation using HashiCorp Terraform.",
            link: "https://coursera.org/verify/CJ3XWR5CH6T1"
        },
        "EQ": {
            title: "Emotional Intelligence",
            desc: "Foundational knowledge of the Linux operating system and open source command line tools.",
            link: "https://coursera.org/verify/7Q2ZYPX4QDGW"
        }
    };

    let activeCert = null;

    certIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const key = icon.getAttribute('data-title');
            const data = certData[key];

            if (!data) return;

            // Toggle Logic
            if (activeCert === key && detailsPanel.classList.contains('visible')) {
                // Close if clicking same icon
                detailsPanel.classList.remove('visible');
                icon.classList.remove('active');
                activeCert = null;
            } else {
                // Open or Switch
                // Remove active class from all
                certIcons.forEach(i => i.classList.remove('active'));

                // Set Content
                detailTitle.textContent = data.title;
                detailDesc.textContent = data.desc;
                detailLink.href = data.link;

                // Show Panel
                detailsPanel.classList.add('visible');
                icon.classList.add('active');
                activeCert = key;
            }
        });
    });

    // --- Education Timeline Toggle ---
    const eduCard = document.getElementById('edu-card-unisa');
    if (eduCard) {
        // Helper to smoothly resize parent accordion
        const resizeAccordion = () => {
            const accordionContent = eduCard.closest('.accordion-content');
            if (accordionContent && accordionContent.parentElement.classList.contains('active')) {
                // 1. Get current height
                const startHeight = accordionContent.offsetHeight;

                // 2. Set to auto to measure new natural height
                accordionContent.style.height = 'auto';
                const endHeight = accordionContent.scrollHeight;

                // 3. Restore start height immediately
                accordionContent.style.height = startHeight + 'px';

                // 4. Force reflow
                accordionContent.offsetHeight;

                // 5. Animate to new height
                accordionContent.style.height = endHeight + 'px';
            }
        };

        eduCard.addEventListener('click', (e) => {
            // Prevent if clicking a link/button within card if any (future proofing)
            if (e.target.tagName === 'A') return;

            const timeline = eduCard.querySelector('.education-timeline');
            timeline.classList.toggle('hidden');

            resizeAccordion();
        });

        // Click Outside to Close
        document.addEventListener('click', (e) => {
            const timeline = eduCard.querySelector('.education-timeline');
            if (eduCard && !eduCard.contains(e.target) && timeline && !timeline.classList.contains('hidden')) {
                timeline.classList.add('hidden');
                resizeAccordion();
            }
        });
    }

    // --- Sticky Header & Footer Logic ---
    const hero = document.getElementById('hero');
    const footer = document.querySelector('footer');
    const body = document.body;

    if (hero) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                // Add fixed class
                if (!hero.classList.contains('sticky-header')) {
                    const heroHeight = hero.offsetHeight; // Capture height before change
                    hero.classList.add('sticky-header');
                    body.classList.add('header-fixed');
                    body.style.paddingTop = heroHeight + 'px'; // Apply exact padding
                }

                // Shrink Footer
                if (footer && !footer.classList.contains('footer-shrink')) {
                    footer.classList.add('footer-shrink');
                }
            } else {
                // Remove fixed class
                if (hero.classList.contains('sticky-header')) {
                    hero.classList.remove('sticky-header');
                    body.classList.remove('header-fixed');
                    body.style.paddingTop = ''; // Clear inline padding

                    // Close all accordions when back at hero
                    const activeAccordions = document.querySelectorAll('.accordion-section.active');
                    activeAccordions.forEach(acc => {
                        acc.classList.remove('active');
                        const content = acc.querySelector('.accordion-content');
                        if (content) content.style.height = null;

                        // Also reset any nested education timelines
                        const timelines = acc.querySelectorAll('.education-timeline');
                        timelines.forEach(tl => tl.classList.add('hidden'));
                    });
                }

                // Expand Footer
                if (footer && footer.classList.contains('footer-shrink')) {
                    footer.classList.remove('footer-shrink');
                }
            }
        });
    }
});
