// Configuración de la animación de partículas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas
function resizeCanvas() {
    const header = document.querySelector('.header');
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variables de configuración
const particles = [];
const particleCount = 60;
const connectionDistance = 150;

// Clase de partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        
        // Alternancia entre colores dorado y azul
        this.color = Math.random() > 0.5 ? 'rgba(201, 169, 97' : 'rgba(0, 212, 255';
        this.originalOpacity = this.opacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        // Movimiento
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar en los bordes
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }

        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        }

        // Efecto de pulsación
        this.pulsePhase += 0.02;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        this.opacity = this.originalOpacity * pulse;
    }

    draw() {
        ctx.fillStyle = this.color + ', ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = this.color + ', ' + (this.opacity * 0.5) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Inicializar partículas
function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Dibujar líneas conectadas
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.3;
                
                // Alternar color de línea
                const lineColor = particles[i].color.includes('201') ? 
                    'rgba(201, 169, 97' : 'rgba(0, 212, 255';
                
                ctx.strokeStyle = lineColor + ', ' + opacity + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animación
function animate() {
    // Limpiar canvas con fondo semi-transparente
    ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Dibujar conexiones
    drawConnections();

    requestAnimationFrame(animate);
}

// Iniciar
initParticles();
animate();

// Reinicializar cuando la ventana se redimensiona significativamente
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initParticles();
    }, 250);
});