// ========== LOCOMOTIVE SCROLL + SCROLLTRIGGER SYNC ==========
gsap.registerPlugin(ScrollTrigger);

const scroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});

scroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

ScrollTrigger.addEventListener("refresh", () => scroll.update());
ScrollTrigger.refresh();


// ========== DOM READY ==========
document.addEventListener("DOMContentLoaded", () => {
  const animateScroll = (target, options) => {
    gsap.from(target, {
      scrollTrigger: {
        trigger: target,
        scroller: "#main",
        start: options.start || "top 90%",
        toggleActions: "play none none none"
      },
      ...options.props
    });
  };

  // Hero
  animateScroll(".hero-title", { props: { y: 40, opacity: 0, duration: 1, ease: "power3.out" } });
  animateScroll(".hero-sub", { props: { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, start: "top 95%" });
  animateScroll(".app-preview-img", { props: { y: 20, opacity: 0, duration: 1, ease: "power2.out" } });

  // Page 2
  animateScroll(".headline-section", { props: { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, start: "top 85%" });
  gsap.to(".headline-text", {
    scrollTrigger: {
      trigger: ".headline-section",
      scroller: "#main",
      scrub: 1
    },
    y: -20,
    ease: "power1.out"
  });

  // Page 3
  animateScroll(".page3-header", { props: { y: 60, opacity: 0, duration: 1, ease: "power3.out" }, start: "top 85%" });

  // Footer
  animateScroll(".footer-container", { props: { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, start: "top 85%" });

  gsap.utils.toArray(".footer-links a").forEach((link, i) => {
    gsap.from(link, {
      scrollTrigger: {
        trigger: ".footer",
        scroller: "#main",
        start: "top 90%"
      },
      opacity: 0,
      y: 20,
      delay: i * 0.05,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  animateScroll(".footer-bottom", { props: { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, start: "top 95%" });

  // Hover effect for gridbox
  document.querySelectorAll(".gridbox").forEach((box) => {
    box.addEventListener("mouseenter", () => {
      gsap.to(box, {
        scale: 1.05,
        duration: 0.1,
        ease: "power3.out"
      });
    });
    box.addEventListener("mouseleave", () => {
      gsap.to(box, {
        scale: 1,
        duration: 0.2,
        ease: "power3.inOut"
      });
    });
  });

  // Tilt effect on preview image
  const previewWrapper = document.querySelector(".tilt-wrapper");
  const previewImg = previewWrapper?.querySelector("img");
  if (previewWrapper && previewImg) {
    previewWrapper.addEventListener("mousemove", (e) => {
      const rect = previewWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * 5;
      const rotateY = ((x / rect.width) - 0.5) * -5;
      previewImg.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(0.985, 0.985, 0.985)`;
    });

    previewWrapper.addEventListener("mouseleave", () => {
      previewImg.style.transform = `perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // ========== Marquee Setup (Single clean instance) ==========
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const isReverse = track.classList.contains("reverse");
    const boxes = Array.from(track.children);

    boxes.forEach((box) => {
      const clone = box.cloneNode(true);
      track.appendChild(clone);
    });

    let totalWidth = 0;
    boxes.forEach((box) => {
      totalWidth += box.offsetWidth + parseFloat(getComputedStyle(box).marginRight || 0);
    });

    gsap.to(track, {
      x: isReverse ? totalWidth : -totalWidth,
      ease: "none",
      duration: 30,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
  });
});
