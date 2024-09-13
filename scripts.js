document.addEventListener('DOMContentLoaded', () => {
    const characterSvg = document.getElementById('character-svg');
    const playPauseBtn = document.getElementById('playPause');
    const reverseBtn = document.getElementById('reverse');
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    const themeSwitcher = document.getElementById('theme-switcher');
    const audioPlayer = document.getElementById('audio-player');
    const audioVisualizer = document.getElementById('audio-visualizer');

    let character;
    let tl;

    // Animated Title
    const title = document.querySelector('.animated-title');
    const text = title.textContent;
    title.textContent = '';
    title.setAttribute('data-text', text);

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.1}s`;
        span.style.animationDuration = `${2 + Math.random()}s`;
        title.appendChild(span);
    }

    // Pulse animation for each letter
    gsap.to('.animated-title span', {
        scale: 1.1,
        duration: 1,
        ease: "power1.inOut",
        stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true
        }
    });

    characterSvg.addEventListener('load', () => {
        const svgDoc = characterSvg.contentDocument;
        character = svgDoc.getElementById('character');
        
        // Character Animation
        tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(character, {
            duration: 2,
            x: 150,
            y: 150,
            rotation: 360,
            scale: 1.5,
            ease: "power1.inOut"
        });

        // Eye-following cursor effect
        const eyes = svgDoc.querySelectorAll('#eye-left, #eye-right');
        document.addEventListener('mousemove', (e) => {
            eyes.forEach(eye => {
                const eyeRect = eye.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
                const distance = Math.min(3, Math.sqrt(Math.pow(e.clientX - eyeCenterX, 2) + Math.pow(e.clientY - eyeCenterY, 2)) / 10);
                gsap.to(eye, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    duration: 0.1
                });
            });
        });
    });

    // Interactive Controls
    playPauseBtn.addEventListener('click', () => {
        if (tl) tl.paused(!tl.paused());
    });
    reverseBtn.addEventListener('click', () => {
        if (tl) tl.reversed(!tl.reversed());
    });
    speedInput.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        if (tl) tl.timeScale(speed);
        speedValue.textContent = speed.toFixed(1);
    });

    // Theme Switcher
    themeSwitcher.addEventListener('change', (e) => {
        document.body.className = `theme-${e.target.value}`;
    });

    // Audio Visualization
    if (audioPlayer && audioVisualizer) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const visualize = () => {
            analyser.getByteFrequencyData(dataArray);
            const bars = Array.from(dataArray).map(value => `<div style="height: ${value}px;"></div>`).join('');
            audioVisualizer.innerHTML = bars;
            requestAnimationFrame(visualize);
        };

        audioPlayer.addEventListener('play', visualize);
    }

    // Parallax Scrolling
    gsap.utils.toArray('.parallax-layer').forEach(layer => {
        const depth = layer.dataset.depth;
        gsap.to(layer, {
            y: () => (1 - depth) * ScrollTrigger.maxScroll(window),
            ease: 'none',
            scrollTrigger: {
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true,
            },
        });
    });
});