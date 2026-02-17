document.addEventListener('DOMContentLoaded', () => {

    // --- Accordion Logic ---
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentSection = header.parentElement;
            const isCurrentlyActive = currentSection.classList.contains('active');

            // Close all sections first
            document.querySelectorAll('.accordion-section').forEach(section => {
                if (section !== currentSection) {
                    section.classList.remove('active');
                }
            });

            // Toggle the current one
            currentSection.classList.toggle('active');

            // If opening, scroll into view
            if (!isCurrentlyActive) {
                setTimeout(() => {
                    currentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }

            // Lock body/html scroll if any section is active
            const anyActive = document.querySelector('.accordion-section.active');
            if (anyActive) {
                document.documentElement.classList.add('no-scroll');
                document.body.classList.add('no-scroll');
            } else {
                document.documentElement.classList.remove('no-scroll');
                document.body.classList.remove('no-scroll');
            }
        });
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
            desc: "Advanced preparation for the AWS SAA-C03 exam, covering secure, resilient, high-performing, and cost-optimized architectures.",
            link: "https://coursera.org/verify/DY6ZEG0LDSU7"
        },
        "Architecting AWS": {
            title: "Architecting Solutions on AWS",
            desc: "In-depth knowledge of AWS services and how they fit into cloud-based solutions to meet business needs.",
            link: "https://coursera.org/verify/H0KU2SE7IGGH"
        },
        "Cloud Design": {
            title: "Cloud Architecture Design Patterns",
            desc: "Focuses on scalable, reliable, and maintainable cloud-native application designs using industry-standard patterns.",
            link: "https://coursera.org/verify/TJRLFI9A57QH"
        },
        "DevOps AWS": {
            title: "DevOps on AWS: Code, Build, and Test",
            desc: "Expertise in CI/CD pipelines, automating infrastructure with AWS tools, and improving developer productivity.",
            link: "https://coursera.org/verify/OBZNTW61990N"
        },
        "Containers": {
            title: "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
            desc: "Building and deploying containerized applications across various cloud platforms using standard orchestration tools.",
            link: "https://coursera.org/verify/TZV4EM4A3CGD"
        },
        "Data Lakes": {
            title: "Building Data Lakes on AWS",
            desc: "Designing and implementing scalable data lake solutions on AWS for big data and analytics workloads.",
            link: "https://coursera.org/verify/YNR4QGTLK8VF"
        },
        "Git": {
            title: "Version Control with Git",
            desc: "Mastery of Git workflows, branching strategies, and collaboration techniques for modern software development.",
            link: "https://coursera.org/verify/5OFOQ29ISPPA"
        },
        "Jira": {
            title: "Agile with Atlassian Jira",
            desc: "Applying Agile methodologies (Scrum/Kanban) and optimizing project workflows using the Atlassian ecosystem.",
            link: "https://coursera.org/verify/CCM1A74OX7LA"
        },
        "AWS Essentials": {
            title: "AWS Cloud Technical Essentials",
            desc: "Foundational technical knowledge of AWS compute, network, storage, and database services.",
            link: "https://coursera.org/verify/VJVT6MZ87NUG"
        },
        "GenAI LLM": {
            title: "Generative AI with Large Language Models",
            desc: "Developing and fine-tuning GenAI applications using state-of-the-art LLMs and AWS infrastructure.",
            link: "https://coursera.org/verify/TY55QEZUMR4P"
        },
        "Time Mgmt": {
            title: "Work Smarter, Not Harder: Time Management",
            desc: "Optimizing personal and professional productivity through effective prioritization and resource management.",
            link: "https://coursera.org/verify/CJ3XWR5CH6T1"
        },
        "EQ": {
            title: "Emotional Intelligence",
            desc: "Harnessing soft skills for effective leadership, collaboration, and high-performance in technical environments.",
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
        eduCard.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const timeline = eduCard.querySelector('.education-timeline');
            timeline.classList.toggle('hidden');
            eduCard.classList.toggle('expanded');
        });
    }

    // --- Sticky Header & Footer Logic ---
    const hero = document.getElementById('hero');
    const footer = document.querySelector('footer');
    const body = document.body;

    if (hero) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                if (!hero.classList.contains('sticky-header')) {
                    const heroHeight = hero.offsetHeight;
                    hero.classList.add('sticky-header');
                    body.classList.add('header-fixed');
                    body.style.paddingTop = heroHeight + 'px';
                }
                if (footer && !footer.classList.contains('footer-shrink')) {
                    footer.classList.add('footer-shrink');
                }
            } else {
                if (hero.classList.contains('sticky-header')) {
                    hero.classList.remove('sticky-header');
                    body.classList.remove('header-fixed');
                    body.style.paddingTop = '';
                }
                if (footer && footer.classList.contains('footer-shrink')) {
                    footer.classList.remove('footer-shrink');
                }
            }
        });
    }
});
