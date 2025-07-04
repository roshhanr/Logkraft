// ========== LOCOMOTIVE SCROLL + SCROLLTRIGGER SYNC ==========
gsap.registerPlugin(ScrollTrigger);

const scroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
  lerp: 0.075, // Slightly increased lerp for smoother deceleration
  multiplier: 1, // Adjusted multiplier
  getDirection: true, // Get scroll direction
  getSpeed: true, // Get scroll speed
});

scroll.on("scroll", (instance) => {
  document.documentElement.classList.add("has-scroll-smooth");
  ScrollTrigger.update(instance);
});

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


// ========== APP PREVIEW IMAGE TILT ==========
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
      ...options.props,
      force3D: true // Add force3D here
    });
  };

  // Hero Section
  animateScroll(".hero-title", { props: { y: 50, opacity: 0, duration: 1.2, ease: "power4.out" } });
  animateScroll(".hero-sub", { props: { y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, start: "top 95%" });
  animateScroll(".app-preview-img", { props: { y: 30, opacity: 0, duration: 1.2, ease: "power3.out" } });

  // Page 2 Headline
  animateScroll(".headline-section", { props: { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, start: "top 85%" });

  gsap.to(".headline-text", {
    scrollTrigger: {
      trigger: ".headline-section",
      scroller: "#main",
      scrub: 1.5
    },
    y: -30,
    ease: "power1.out",
    force3D: true
  });

  // Page 3 Header
  animateScroll(".page3-header", { props: { y: 80, opacity: 0, duration: 1.2, ease: "power4.out" }, start: "top 85%" });

  // Footer Content
  animateScroll(".footer-container", { props: { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, start: "top 95%" });
  animateScroll(".footer-bottom", { props: { opacity: 0, y: 40, duration: 1, ease: "power3.out" }, start: "top 98%" });

  // Footer Grid Parallax
  gsap.to(".footer-grid", {
    scrollTrigger: {
        trigger: ".footer",
        scroller: "#main",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
    },
    y: -120, // Adjust this value for more or less parallax
    ease: "none",
    force3D: true
  });

  // Footer Links Animate In
  gsap.utils.toArray(".footer-links a").forEach((link, i) => {
    gsap.from(link, {
      scrollTrigger: {
        trigger: ".footer",
        scroller: "#main",
        start: "top 90%"
      },
      opacity: 0,
      y: 30,
      delay: i * 0.1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // Gridbox hover zoom effect
  document.querySelectorAll(".gridbox").forEach((box) => {
    box.addEventListener("mouseenter", () => {
      gsap.to(box, {
        scale: 1.03,
        duration: 0.2,
        ease: "power2.out",
        force3D: true
      });
    });
    box.addEventListener("mouseleave", () => {
      gsap.to(box, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
        force3D: true
      });
    });
  });

  // Marquee Scroll Effect
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
      duration: 40, // Slower and smoother
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      },
      force3D: true
    });
  });

  // Navbar underline hover animation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const underline = link.querySelector(".underline-bar");
    if (!underline) return;

    link.addEventListener("mouseenter", () => {
      gsap.to(underline, {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.out",
        force3D: true
      });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(underline, {
        scaleX: 0,
        duration: 0.5,
        ease: "power3.in",
        force3D: true
      });
    });
  });
});
