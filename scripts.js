document.addEventListener('DOMContentLoaded', () => {
    const box = document.querySelector('.animated-box');
    const playPauseBtn = document.getElementById('playPause');
    const reverseBtn = document.getElementById('reverse');
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');

    // Create the animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(box, {
        duration: 2,
        x: () => document.querySelector('#demo-container').offsetWidth - box.offsetWidth,
        ease: "power1.inOut"
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (tl.paused()) {
            tl.play();
        } else {
            tl.pause();
        }
    });

    // Reverse button
    reverseBtn.addEventListener('click', () => {
        tl.reversed(!tl.reversed());
    });

    // Speed control
    speedInput.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        tl.timeScale(speed);
        speedValue.textContent = speed.toFixed(1);
    });
});