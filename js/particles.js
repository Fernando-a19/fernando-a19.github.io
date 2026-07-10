// Configuración de la animación de partículas - Patrón de líneas y nodos conectados
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
const particleCount = 40;
const connectionDistance = 200;

// Clase de partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 1.5 + 0.5;
        
        // Colores: dorado y azul eléctrico
        this.colorType = Math.random() > 0.6 ? 'gold' : 'blue';
        this.opacity = Math.random() * 0.6 + 0.4;
        this.originalOpacity = this.opacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        // Movimiento lento y suave
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
        this.pulsePhase += 0.01;
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        this.opacity = this.originalOpacity * pulse;
    }

    draw() {
        // Color del nodo
        const color = this.colorType === 'gold' ? '#c9a961' : '#00d4ff';
        
        // Dibujar nodo
        ctx.fillStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
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
                const opacity = (1 - distance / connectionDistance) * 0.4;
                
                // Color de la línea según el tipo de nodo
                const lineColor = particles[i].colorType === 'gold' ? '#c9a961' : '#00d4ff';
                
                ctx.strokeStyle = lineColor;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

// Loop de animación
function animate() {
    // Limpiar canvas - fondo oscuro semi-transparente
    ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
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