/* GSAP animation for the box */
gsap.to(".animated-box", {
    x: 300,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});
