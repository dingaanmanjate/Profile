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
    const certIcons = document.querySelectorAll('.cert-icon-badge');
    const detailsPanel = document.getElementById('cert-details-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailLink = document.getElementById('detail-link');

    // Certificate Data Dictionary
    const certData = {
        "AWS SA": {
            title: "AWS Certified Solutions Architect",
            desc: "Validated expertise in designing distributed systems on AWS, focusing on scalability, security, and cost-optimization.",
            link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
        },
        "Google PCA": {
            title: "Google Professional Cloud Architect",
            desc: "Expert-level validation of designing and managing robust, secure, and scalable Google Cloud architectures.",
            link: "https://cloud.google.com/learn/certification/cloud-architect"
        },
        "CKA": {
            title: "Certified Kubernetes Administrator",
            desc: "Demonstrated competence in installation, configuration, and management of production-grade Kubernetes clusters.",
            link: "https://www.cncf.io/certification/cka/"
        },
        "Security+": {
            title: "CompTIA Security+",
            desc: "Global certification validating baseline skills for core security functions and pursuing an IT security career.",
            link: "https://www.comptia.org/certifications/security"
        },
        "CISSP": {
            title: "Certified Information Systems Security Professional",
            desc: "Advanced security certification proving effective design, implementation, and management of cybersecurity programs.",
            link: "https://www.isc2.org/Certifications/CISSP"
        },
        "CEH": {
            title: "Certified Ethical Hacker",
            desc: "Understand and know how to look for weaknesses and vulnerabilities in target systems using the same knowledge and tools as a malicious hacker.",
            link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/"
        },
        "PMP": {
            title: "Project Management Professional",
            desc: "The gold standard in project management, validating competence to lead and direct projects and teams.",
            link: "https://www.pmi.org/certifications/project-management-pmp"
        },
        "Scrum": {
            title: "Certified Scrum Master",
            desc: "Understanding of the Scrum framework and how to help teams use it to increase the likelihood of the project's overall success.",
            link: "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster"
        },
        "ITIL": {
            title: "ITIL 4 Foundation",
            desc: "Understanding the ITIL framework for IT Service Management and how to align IT services with business needs.",
            link: "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation"
        },
        "Docker": {
            title: "Docker Certified Associate",
            desc: "Validates skillset with Docker Enterprise Edition and Docker Swarm for container orchestration.",
            link: "https://training.mirantis.com/dca-certification-exam/"
        },
        "Terraform": {
            title: "HashiCorp Certified: Terraform Associate",
            desc: "Cloud engineering skills in infrastructure automation using HashiCorp Terraform.",
            link: "https://www.hashicorp.com/certification/terraform-associate"
        },
        "Linux": {
            title: "LPI Linux Essentials",
            desc: "Foundational knowledge of the Linux operating system and open source command line tools.",
            link: "https://www.lpi.org/our-certifications/linux-essentials-overview/"
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
});
