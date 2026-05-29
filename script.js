/* ============================================
   BIRTHDAY APP - SCRIPT
   ============================================ */

// ---- Preloader ----
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger confetti after preloader hides
        setTimeout(() => launchConfetti(), 500);
    }, 2500);
});

// ---- Particle System (Background Stars) ----
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            // Color: mix of gold, pink, white
            const colors = [
                'rgba(212, 168, 83,',   // gold
                'rgba(233, 30, 140,',    // pink
                'rgba(139, 92, 246,',    // purple
                'rgba(255, 255, 255,',   // white
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDirection * this.fadeSpeed;
            if (this.opacity > 0.6) this.fadeDirection = -1;
            if (this.opacity < 0.05) this.fadeDirection = 1;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
            ctx.fill();
        }
    }

    const count = Math.min(120, Math.floor(window.innerWidth * 0.08));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
})();

// ---- Confetti System ----
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#d4a853', '#f0d68a', '#e91e8c', '#ff6bc1', '#8b5cf6', '#a78bfa', '#ffffff', '#ffd700', '#ff69b4'];
    const shapes = ['rect', 'circle', 'star'];

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * canvas.height * 0.5;
            this.w = Math.random() * 10 + 5;
            this.h = Math.random() * 6 + 3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            this.speedX = (Math.random() - 0.5) * 4;
            this.speedY = Math.random() * 3 + 2;
            this.gravity = 0.05;
            this.opacity = 1;
            this.wobble = Math.random() * 10;
            this.wobbleSpeed = Math.random() * 0.1 + 0.05;
        }
        update() {
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.wobble += this.wobbleSpeed;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 20) this.opacity = 0;
        }
        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            } else if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Star
                drawStar(ctx, 0, 0, 5, this.w / 2, this.w / 4);
            }
            ctx.restore();
        }
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    for (let i = 0; i < 200; i++) {
        confettiPieces.push(new Confetti());
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        confettiPieces.forEach(c => {
            c.update();
            c.draw();
            if (c.opacity > 0) alive = true;
        });
        if (alive) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animateConfetti();
}

// ---- Typewriter Effect ----
function initTypewriter() {
    const el = document.getElementById('typewriter');
    const fullText = el.textContent.trim();
    el.textContent = '';
    el.classList.add('typing');
    let charIndex = 0;
    let hasStarted = false;

    function type() {
        if (charIndex < fullText.length) {
            el.textContent += fullText.charAt(charIndex);
            charIndex++;
            const delay = fullText.charAt(charIndex - 1) === '.' || fullText.charAt(charIndex - 1) === ',' ? 60 : 25;
            setTimeout(type, delay);
        } else {
            el.classList.remove('typing');
            // Show the bold line after typewriter finishes
            const boldLine = document.querySelector('.bold-line');
            if (boldLine) {
                setTimeout(() => {
                    boldLine.classList.add('visible');
                }, 500);
            }
        }
    }

    // Use Intersection Observer to start typing when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                type();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(el);
}

// ---- Scroll Reveal ----
function initRevealAnimations() {
    const items = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    items.forEach(item => observer.observe(item));
}

// ---- Cake Interaction ----
function initCake() {
    const cakeContainer = document.getElementById('cake-container');
    const flames = document.querySelectorAll('.flame');
    const wishReveal = document.getElementById('wish-reveal');
    let blown = false;

    cakeContainer.addEventListener('click', () => {
        if (blown) return;
        blown = true;

        // Blow out each candle with slight delay
        flames.forEach((flame, i) => {
            setTimeout(() => {
                flame.classList.add('blown');
            }, i * 150);
        });

        // Show wish text
        setTimeout(() => {
            wishReveal.classList.add('show');
            launchConfetti(); // Confetti again!
        }, 800);
    });
}

// ---- Smooth Scroll + Auto-Play Music ----
let audioCtx = null;
let musicPlaying = false;
let melodyInterval = null;

function startMusic() {
    if (musicPlaying) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicPlaying = true;
    document.getElementById('music-toggle').classList.add('playing');
    playBirthdayMelody();
}

function stopMusic() {
    musicPlaying = false;
    document.getElementById('music-toggle').classList.remove('playing');
    if (melodyInterval) {
        clearTimeout(melodyInterval);
        melodyInterval = null;
    }
    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }
}

function initSmoothScroll() {
    const scrollCta = document.getElementById('scroll-cta');
    if (scrollCta) {
        scrollCta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('message');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Auto-start music on first interaction
            startMusic();
        });
    }
}

// ---- Music Toggle ----
function initMusicToggle() {
    const btn = document.getElementById('music-toggle');
    btn.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });
}

function playBirthdayMelody() {
    if (!audioCtx || !musicPlaying) return;

    // "Happy Birthday" melody notes (frequency, duration)
    const notes = [
        { freq: 262, dur: 0.3 }, // C
        { freq: 262, dur: 0.3 }, // C
        { freq: 294, dur: 0.6 }, // D
        { freq: 262, dur: 0.6 }, // C
        { freq: 349, dur: 0.6 }, // F
        { freq: 330, dur: 1.0 }, // E

        { freq: 262, dur: 0.3 }, // C
        { freq: 262, dur: 0.3 }, // C
        { freq: 294, dur: 0.6 }, // D
        { freq: 262, dur: 0.6 }, // C
        { freq: 392, dur: 0.6 }, // G
        { freq: 349, dur: 1.0 }, // F

        { freq: 262, dur: 0.3 }, // C
        { freq: 262, dur: 0.3 }, // C
        { freq: 523, dur: 0.6 }, // C5
        { freq: 440, dur: 0.6 }, // A
        { freq: 349, dur: 0.6 }, // F
        { freq: 330, dur: 0.6 }, // E
        { freq: 294, dur: 1.0 }, // D

        { freq: 466, dur: 0.3 }, // Bb
        { freq: 466, dur: 0.3 }, // Bb
        { freq: 440, dur: 0.6 }, // A
        { freq: 349, dur: 0.6 }, // F
        { freq: 392, dur: 0.6 }, // G
        { freq: 349, dur: 1.2 }, // F
    ];

    let totalDuration = 0;
    let time = audioCtx.currentTime + 0.1;

    notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + note.dur * 0.9);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
        totalDuration += note.dur;
    });

    // Loop: replay after the melody ends + a short pause
    melodyInterval = setTimeout(() => {
        if (musicPlaying) playBirthdayMelody();
    }, (totalDuration + 1.5) * 1000);
}

// ---- Section fade-in on scroll ----
function initSectionAnimations() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => observer.observe(s));
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initRevealAnimations();
    initCake();
    initSmoothScroll();
    initMusicToggle();
    initSectionAnimations();
});
