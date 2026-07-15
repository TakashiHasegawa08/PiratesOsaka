import React, { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Helmet } from "react-helmet";

function SnackBgCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 0;
    let height = 0;
    let dpr = 1;

    let particles = [];
    let stars = [];
    let streaks = [];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let lastScrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    let time = 0;

    let animationId = null;
    let isRunning = false;

    const isSp = () => window.innerWidth <= 768;

    const config = {
      particleCountPc: 70,
      particleCountSp: 32,
      starCountPc: 12,
      starCountSp: 5,
      streakCountPc: 3,
      streakCountSp: 1,
      maxDpr: 1.25,
    };

    const colors = [
      "rgba(69, 184, 255, 0.75)",
      "rgba(255, 77, 225, 0.72)",
      "rgba(255, 255, 255, 0.62)",
      "rgba(255, 188, 252, 0.65)",
    ];

    const random = (min, max) => Math.random() * (max - min) + min;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createObjects();
    };

    const createObjects = () => {
      particles = [];
      stars = [];
      streaks = [];

      const particleCount = isSp()
        ? config.particleCountSp
        : config.particleCountPc;

      const starCount = isSp() ? config.starCountSp : config.starCountPc;

      const streakCount = isSp() ? config.streakCountSp : config.streakCountPc;

      for (let i = 0; i < particleCount; i += 1) {
        const isBubble = Math.random() > 0.82;

        particles.push({
          x: random(0, width),
          y: random(0, height),
          r: isBubble
            ? random(3, isSp() ? 6 : 8)
            : random(1, isSp() ? 2.4 : 3.5),
          vx: random(-0.12, 0.12),
          vy: random(-0.22, -0.04),
          alpha: random(0.18, 0.65),
          pulse: random(0, Math.PI * 2),
          pulseSpeed: random(0.012, 0.032),
          color: colors[Math.floor(Math.random() * colors.length)],
          isBubble,
        });
      }

      for (let i = 0; i < starCount; i += 1) {
        stars.push({
          x: random(0, width),
          y: random(0, height),
          size: random(5, isSp() ? 11 : 17),
          vx: random(-0.08, 0.08),
          vy: random(-0.14, -0.03),
          rotate: random(0, Math.PI * 2),
          rotateSpeed: random(-0.008, 0.008),
          alpha: random(0.18, 0.58),
          pulse: random(0, Math.PI * 2),
          pulseSpeed: random(0.01, 0.026),
          color:
            Math.random() > 0.5
              ? "rgba(255, 77, 225, 0.85)"
              : "rgba(69, 184, 255, 0.85)",
        });
      }

      for (let i = 0; i < streakCount; i += 1) {
        streaks.push({
          x: random(0, width),
          y: random(0, height),
          length: random(70, isSp() ? 110 : 170),
          speed: random(1.5, isSp() ? 2.4 : 3.4),
          delay: random(0, 180),
          alpha: random(0.18, 0.42),
          color:
            Math.random() > 0.5
              ? "rgba(255, 77, 225, 0.8)"
              : "rgba(69, 184, 255, 0.8)",
        });
      }
    };

    const updateScrollVelocity = () => {
      const currentScrollY = window.scrollY || 0;
      const diff = currentScrollY - lastScrollY;

      scrollVelocity += (diff - scrollVelocity) * 0.12;
      scrollVelocity *= 0.86;

      lastScrollY = currentScrollY;
    };

    const drawParticle = (p) => {
      const speedBoost = clamp(Math.abs(scrollVelocity) / 28, 0, 1);
      const alpha = clamp(
        p.alpha + Math.sin(p.pulse) * 0.18 + speedBoost * 0.12,
        0.05,
        0.85,
      );
      const radius = p.r * (1 + Math.sin(p.pulse) * 0.18 + speedBoost * 0.15);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.isBubble) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawStar = (star) => {
      const spikes = 5;
      const speedBoost = clamp(Math.abs(scrollVelocity) / 30, 0, 1);
      const outerRadius =
        star.size * (1 + Math.sin(star.pulse) * 0.2 + speedBoost * 0.15);
      const innerRadius = outerRadius * 0.42;
      const alpha = clamp(
        star.alpha + Math.sin(star.pulse) * 0.2 + speedBoost * 0.12,
        0.06,
        0.85,
      );

      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.rotate(star.rotate);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = star.color;
      ctx.lineWidth = isSp() ? 1 : 1.2;

      ctx.beginPath();

      for (let i = 0; i < spikes * 2; i += 1) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    };

    const drawStreak = (s) => {
      if (s.delay > 0) return;

      const speedBoost = clamp(Math.abs(scrollVelocity) / 18, 0, 1.8);
      const length = s.length + speedBoost * 60;

      ctx.save();
      ctx.globalAlpha = clamp(s.alpha + speedBoost * 0.18, 0.1, 0.7);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.2 + speedBoost * 0.8;

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - length, s.y + length * 0.45);
      ctx.stroke();

      ctx.restore();
    };

    const updateParticle = (p) => {
      const speedBoost = clamp(scrollVelocity, -28, 28);
      const wave = Math.sin(time * 0.018 + p.y * 0.012) * 0.25;

      p.x += p.vx + wave + mouseX * 0.00045 + speedBoost * 0.012;
      p.y += p.vy + mouseY * 0.00045 - Math.abs(speedBoost) * 0.015;
      p.pulse += p.pulseSpeed + Math.abs(speedBoost) * 0.00035;

      if (p.y < -30) {
        p.y = height + 30;
        p.x = random(0, width);
      }

      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;
    };

    const updateStar = (star) => {
      const speedBoost = clamp(scrollVelocity, -28, 28);

      star.x += star.vx + mouseX * 0.00035 + speedBoost * 0.01;
      star.y += star.vy + mouseY * 0.00035 - Math.abs(speedBoost) * 0.012;
      star.rotate += star.rotateSpeed + speedBoost * 0.0004;
      star.pulse += star.pulseSpeed;

      if (star.y < -50) {
        star.y = height + 50;
        star.x = random(0, width);
      }

      if (star.x < -50) star.x = width + 50;
      if (star.x > width + 50) star.x = -50;
    };

    const updateStreak = (s) => {
      if (s.delay > 0) {
        s.delay -= 1;
        return;
      }

      const speedBoost = clamp(Math.abs(scrollVelocity) / 18, 0, 2);
      const move = s.speed + speedBoost;

      s.x += move;
      s.y -= move * 0.45;

      if (s.x > width + s.length || s.y < -s.length) {
        s.x = random(-width * 0.1, width * 0.8);
        s.y = random(height * 0.35, height * 1.2);
        s.delay = random(40, isSp() ? 220 : 150);
        s.alpha = random(0.18, 0.42);
      }
    };

    const drawVignette = () => {
      ctx.save();

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.72,
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.22)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    const renderFrame = () => {
      time += 1;
      updateScrollVelocity();

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      particles.forEach((p) => {
        updateParticle(p);
        drawParticle(p);
      });

      stars.forEach((star) => {
        updateStar(star);
        drawStar(star);
      });

      streaks.forEach((s) => {
        updateStreak(s);
        drawStreak(s);
      });

      drawVignette();
    };

    const animate = () => {
      if (!isRunning) return;

      renderFrame();
      animationId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (isRunning || prefersReducedMotion.matches) return;
      isRunning = true;
      animationId = requestAnimationFrame(animate);
    };

    const stop = () => {
      isRunning = false;

      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const onMouseMove = (e) => {
      targetMouseX = e.clientX - width / 2;
      targetMouseY = e.clientY - height / 2;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        lastScrollY = window.scrollY || 0;
        start();
      }
    };

    const onMotionChange = () => {
      if (prefersReducedMotion.matches) {
        stop();
        renderFrame();
      } else {
        start();
      }
    };

    resize();
    renderFrame();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("visibilitychange", onVisibilityChange);
    prefersReducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      prefersReducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="snack-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
function Event260726_02() {
  useEffect(() => {
    document.body.classList.add("body-snack-page");

    const headerLogoImgs = document.querySelectorAll(".header-logo img");

    const originalLogoSrcList = Array.from(headerLogoImgs).map((img) => ({
      img,
      src: img.getAttribute("src"),
    }));

    headerLogoImgs.forEach((img) => {
      img.setAttribute("src", "/img/PO_rogo_251216_white.png");
    });

    return () => {
      document.body.classList.remove("body-snack-page");

      originalLogoSrcList.forEach(({ img, src }) => {
        if (img && src) {
          img.setAttribute("src", src);
        }
      });
    };
  }, []);

  useEffect(() => {
    const svg = document.querySelector(".kvNeonLogo");
    if (!svg) return;

    const targets = svg.querySelectorAll("path, polygon, rect");

    const normalizeColor = (value) => {
      if (!value) return "";
      return value.trim().toLowerCase();
    };

    const addColorClass = (el) => {
      const stroke = normalizeColor(el.getAttribute("stroke"));
      const fill = normalizeColor(el.getAttribute("fill"));
      const color = stroke && stroke !== "none" ? stroke : fill;

      if (color === "#14a8ff" || color === "#16a8ff" || color === "#a6daf7") {
        el.classList.add("is-blue");
        return;
      }

      if (
        color === "#ff1ad9" ||
        color === "#ffa3f0" ||
        color === "#ff8cec" ||
        color === "#ffbbfc" ||
        color === "#f800ff"
      ) {
        el.classList.add("is-pink");
        return;
      }

      if (color === "#fff" || color === "#ffffff") {
        el.classList.add("is-white");
        return;
      }

      if (color === "#231815" || color === "#201412") {
        el.classList.add("is-bg");
        return;
      }

      el.classList.add("is-white");
    };

    targets.forEach((el, index) => {
      addColorClass(el);

      const stroke = normalizeColor(el.getAttribute("stroke"));
      const fill = normalizeColor(el.getAttribute("fill"));

      if (el.classList.contains("is-bg")) {
        el.classList.add("is-static-bg");
        return;
      }

      if (
        stroke &&
        stroke !== "none" &&
        typeof el.getTotalLength === "function"
      ) {
        const length = el.getTotalLength();

        el.classList.add("is-neon-stroke");
        el.style.setProperty("--path-length", length);

        const drawDelay = 0.15 + index * 0.018;
        const drawDuration = Math.max(0.8, Math.min(length / 260, 1.8));
        const flickerDelay = 2.1 + index * 0.006;

        el.style.setProperty("--draw-delay", `${drawDelay}s`);
        el.style.setProperty("--draw-duration", `${drawDuration}s`);
        el.style.setProperty("--flicker-delay", `${flickerDelay}s`);
        return;
      }

      if (fill && fill !== "none") {
        el.classList.add("is-neon-fill");

        const fillDelay = 1.1 + index * 0.012;
        const flickerDelay = 2.2 + index * 0.005;

        el.style.setProperty("--fill-delay", `${fillDelay}s`);
        el.style.setProperty("--flicker-delay", `${flickerDelay}s`);
      }
    });

    const timer = window.setTimeout(() => {
      svg.classList.add("is-ready");
    }, 2400);

    return () => {
      window.clearTimeout(timer);

      targets.forEach((el) => {
        el.classList.remove(
          "is-blue",
          "is-pink",
          "is-white",
          "is-bg",
          "is-static-bg",
          "is-neon-stroke",
          "is-neon-fill",
        );

        el.style.removeProperty("--path-length");
        el.style.removeProperty("--draw-delay");
        el.style.removeProperty("--draw-duration");
        el.style.removeProperty("--fill-delay");
        el.style.removeProperty("--flicker-delay");
      });

      svg.classList.remove("is-ready");
    };
  }, []);

  useEffect(() => {
    const target = document.querySelector(".js-snackCopy");

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.classList.add("is-active");
          observer.unobserve(target);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="eventPage" className="snack">
      <Helmet>
        <title>Event | スナックPM | 株式会社PO</title>
        <meta property="og:title" content="Event | スナックPM | 株式会社PO" />
        <meta
          property="og:description"
          content="イベント情報をご紹介します。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://p-o.ltd/event" />
        <meta
          property="og:image"
          content="https://p-o.ltd/img/event_ogp_260726_02.jpg"
        />
        <meta property="og:site_name" content="株式会社PO" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <SnackBgCanvas />

      <Header />

      <main className="contents_inner">
        {/* <Title>
          Event <span className="oTxt">P</span>age
        </Title> */}

        <div className="eventContainer">
          <div className="eventTitle">
            <section className="kv-neon">
              <div className="kv-neon__inner">
                <svg
                  className="kvNeonLogo"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="80 260 1060 720"
                >
                  <defs>
                    <filter
                      id="outer-glow-1"
                      x="95.0908313"
                      y="442.0908313"
                      width="593"
                      height="443"
                      filterUnits="userSpaceOnUse"
                    >
                      <feOffset dx="0" dy="0" />
                      <feGaussianBlur result="blur" stdDeviation="20.3030562" />
                      <feFlood floodColor="#f800ff" floodOpacity="1" />
                      <feComposite in2="blur" operator="in" />
                      <feComposite in="SourceGraphic" />
                    </filter>
                  </defs>
                  <g isolation="isolate">
                    <g id="" data-name="">
                      <g>
                        <g filter="url(#outer-glow-1)">
                          <path
                            d="M160.8229017,669.4309359v-161.2349401h32.4000402c82.9968144,0,140.6955239,47.0463709,140.6955239,122.9418144,0,65.244798-45.7150402,113.1783464-110.9587095,122.0557656v65.687258h-62.1368547v-112.4420797M222.9597564,621.7908515v72.3726841c26.1864112-2.6637901,44.3837095-27.961895,44.3837095-63.0257254,0-35.9498792-18.1972983-59.9172178-44.3837095-62.5798791"
                            fill="none"
                            stroke="#ff1ad9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="8.6327956"
                          />
                          <path
                            d="M593.6109117,818.8808338h-33.343654v-237.4520559c-24.8545161,5.7700403-37.7259274,27.5183062-37.7259274,66.1319755v171.3200803h-59.9177821v-171.3200803c0-38.6136693-12.8714112-60.3619353-37.7259274-66.1319755v237.4520559h-62.1368547v-310.684838h2.6626614c53.2605643,0,102.5260078,19.5280647,127.3810883,54.1483062,24.4109274-34.6202416,71.9014514-54.1483062,126.9363708-54.1483062h2.6637901v310.684838"
                            fill="none"
                            stroke="#ff1ad9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="8.6327956"
                          />
                        </g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M160.8229017,669.4309359v-161.2349401h32.4000402c82.9968144,0,140.6955239,47.0463709,140.6955239,122.9418144,0,65.244798-45.7150402,113.1783464-110.9587095,122.0557656v65.687258h-62.1368547v-112.4420797M222.9597564,621.7908515v72.3726841c26.1864112-2.6637901,44.3837095-27.961895,44.3837095-63.0257254,0-35.9498792-18.1972983-59.9172178-44.3837095-62.5798791"
                                fill="none"
                                stroke="#ffa3f0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.8775985"
                              />
                              <path
                                d="M593.6109117,818.8808338h-33.343654v-237.4520559c-24.8545161,5.7700403-37.7259274,27.5183062-37.7259274,66.1319755v171.3200803h-59.9177821v-171.3200803c0-38.6136693-12.8714112-60.3619353-37.7259274-66.1319755v237.4520559h-62.1368547v-310.684838h2.6626614c53.2605643,0,102.5260078,19.5280647,127.3810883,54.1483062,24.4109274-34.6202416,71.9014514-54.1483062,126.9363708-54.1483062h2.6637901v310.684838"
                                fill="none"
                                stroke="#ffa3f0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.8775985"
                              />
                            </g>
                          </g>
                        </g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M162.1294005,898.6467095v14.042463h-6.8203185v-56.1721095h4.0921911c11.5553183,0,20.3023697,8.5862082,20.3023697,21.104893,0,11.394475-7.6234061,19.9005438-17.5742423,21.0247535ZM162.1294005,892.066245c5.7779413-.5621049,10.4322373-6.3389175,10.4322373-14.444289,0-8.1042428-4.654296-13.9623236-10.4322373-14.5244284v28.9687174Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M157.3887894,910.6093508v-52.0131037h2.0124933c10.7290671,0,18.2226094,7.8235425,18.2226094,19.0252713,0,9.9558513-6.6147265,17.9286554-15.7278081,18.9592713l-1.8459702.2091693v13.8193917h-2.6613244ZM160.0501138,894.3581117l2.2810627-.2223693c7.1330806-.6945234,12.3100217-7.6397578,12.3100217-16.5142239,0-8.9201584-5.1769411-15.8989005-12.3100217-16.5934239l-2.2810627-.2223693v33.5523865Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M192.3019027,912.6891725v-56.1721095h6.8203185v49.5115055h13.1603647v6.660604h-19.9806832Z"
                                fill="#ff1ad9"
                              />
                              <polygon
                                points="194.3813008 910.6093508 194.3813008 858.5962471 197.0426252 858.5962471 197.0426252 908.1084572 210.203032 908.1084572 210.203032 910.6093508 194.3813008 910.6093508"
                                fill="#ff8cec"
                              />
                              <path
                                d="M245.4236338,912.6891725l-1.6851859-6.9811618h-15.0859689l-1.6851859,6.9811618h-6.9811618l15.7276489-58.9803763h.9633665l15.7276489,58.9803763h-6.9811618ZM230.1768217,899.7697905h12.0372837l-6.018924-24.6355436-6.0183597,24.6355436Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M247.0610048,910.6093508l-1.6850316-6.9807728h-18.3607018l-1.6855393,6.9807728h-2.6369552l13.5025916-50.6362415,13.5030993,50.6362415h-2.6374629ZM227.5280409,901.8496233h17.3346551l-6.6472188-27.2092755h-4.0402175l-6.6472188,27.2092755Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M281.1314016,856.5170631h7.3829877l-11.8764405,24.8759619v31.2961476h-6.8208829v-31.2961476l-11.8764405-24.8759619h7.3824234l7.9445282,17.1724164,7.8638244-17.1724164Z"
                                fill="#ff1ad9"
                              />
                              <polygon
                                points="271.8968176 910.6093508 271.8968176 880.9215202 261.2378121 858.5962471 263.9940751 858.5962471 273.2772337 878.6633036 282.4659615 858.5962471 285.2176552 858.5962471 274.5586497 880.9215202 274.5586497 910.6093508 271.8968176 910.6093508"
                                fill="#ff8cec"
                              />
                              <path
                                d="M299.1063412,912.6891725v-56.1721095h6.5804645v56.1721095h-6.5804645Z"
                                fill="#ff1ad9"
                              />
                              <rect
                                x="301.1856019"
                                y="858.5962471"
                                width="2.4216936"
                                height="52.0131037"
                                fill="#ff8cec"
                              />
                              <path
                                d="M339.3092547,856.5170631h6.8208829v56.1721095h-6.8208829v-35.7896003l-11.3950394-8.6663476v44.4559479h-6.8203185v-56.9746327h.7218194l17.4935385,13.0807896v-12.2782664Z"
                                fill="#ff1ad9"
                              />
                              <polygon
                                points="341.3887611 910.6093508 341.3887611 875.8689637 325.8345838 864.0387115 325.8345838 910.6093508 323.1732594 910.6093508 323.1732594 859.3263091 341.3887611 872.9477007 341.3887611 858.5962471 344.0505932 858.5962471 344.0505932 910.6093508 341.3887611 910.6093508"
                                fill="#ff8cec"
                              />
                              <path
                                d="M380.8762319,880.7519094h19.9005438v30.4123562c-2.9691101,1.524907-7.5427023,2.3274302-12.7591031,2.3274302-17.1724164,0-28.8078741-11.796301-28.8078741-28.8885779,0-17.1724164,11.6354578-28.8885779,29.2898395-28.8885779,4.0921911,0,7.8638244.4819654,11.0739173,1.3646281v6.7407434c-3.1299534-.9628021-6.660604-1.4447675-10.6726556-1.4447675-13.802609,0-22.5490961,8.9078947-22.5490961,22.227974,0,13.2410685,8.7464871,22.227974,22.0671307,22.227974,2.0864475,0,4.012616-.2404183,5.6978019-.6422443v-19.17816h-13.2405042v-6.258778Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M388.0177851,911.4125205c-15.987239,0-26.7284907-10.7742517-26.7284907-26.8092138s10.9351902-26.8092138,27.2102909-26.8092138c3.1979555,0,6.2735571.313754,8.9942816.9128312v2.4267705c-2.6242629-.5625234-5.4602336-.8376927-8.5932044-.8376927-14.7306999,0-24.6281665,9.768005-24.6281665,24.3073048s9.7035281,24.3073048,24.1463663,24.3073048c2.1556626,0,4.2351714-.2355694,6.1806493-.6996004l1.5966931-.3807694v-22.8989656h-13.2406222v-2.0998165h15.7415158v26.9869062c-2.6283244,1.0204621-6.4273879,1.5941547-10.6793132,1.5941547Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M477.4109694,856.5170631v56.1721095h-6.8208829v-48.3884245c-6.0984991.8837914-9.7092892,6.0996278-9.7092892,13.6417658v34.7466587h-6.660604v-34.7466587c0-7.5421379-3.6107901-12.7579744-9.6297141-13.5604976v48.3071563h-6.8203185v-56.1721095h.8019588c8.5060687,0,15.7282132,4.012616,19.0184455,10.1111152,3.2095285-6.0984991,10.3515335-10.1111152,18.9377417-10.1111152h.8826627Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M472.6694286,910.6093508v-48.7110712l-2.3775243.3442156c-7.087896,1.0265544-11.4906059,7.0427113-11.4906059,15.699885v32.6669707h-2.5014013v-32.6669707c0-8.6957583-4.3813869-14.6814537-11.4347597-15.6217004l-2.3541704-.313754v48.602425h-2.6613244v-51.9806114c7.0554036.3645233,13.0786683,3.7376327,15.9105774,8.9861585l1.8530779,3.4350479,1.8175394-3.4533249c2.7674322-5.2586796,8.7917122-8.6307737,15.9004236-8.9719431v51.9846729h-2.6618321Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M491.9348335,898.1647441v-41.647681h6.8208829v41.647681c0,5.5363943,2.0057437,8.6663476,6.0984991,8.6663476,4.0120517,0,6.0984991-3.1299534,6.0984991-8.6663476v-41.647681h6.8208829v41.647681c0,9.5490103-4.8952787,15.3269516-12.919382,15.3269516-8.1048071,0-12.919382-5.7779413-12.919382-15.3269516Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M504.8540914,911.4125205c-6.8888805,0-10.839744-4.8281563-10.839744-13.2477299v-39.5685434h2.6618321v39.5685434c0,9.6989588,5.7191568,10.7458209,8.1779119,10.7458209s8.1779119-1.0468621,8.1779119-10.7458209v-39.5685434h2.6618321v39.5685434c0,8.4195736-3.9508636,13.2477299-10.839744,13.2477299Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M529.4084909,911.9667888v-7.0613012c2.1665869,1.2032204,4.4934527,1.9256042,7.3022839,1.9256042,4.654296,0,7.3824234-2.8884063,7.3824234-8.3457898,0-3.771069-.9628021-6.5793358-4.0120517-11.7951723l-4.4940171-7.7035455c-2.4070053-4.0927555-4.0120517-7.9450926-4.0120517-12.198127,0-6.4190569,4.4934527-11.0739173,11.5553183-11.0739173,2.2467264,0,4.4133133.401826,6.0984991,1.1242097v6.5793358c-1.6851859-.721255-3.2902323-1.2833599-5.2959759-1.2833599-3.3703717,0-5.3766797,1.9256042-5.3766797,5.135697,0,2.8884063,1.2839243,5.3761154,3.129389,8.5862082l4.2530344,7.4631272c3.0498139,5.0555576,5.2164008,9.9497075,5.2164008,15.6475094,0,8.9869054-5.135697,14.5244284-13.802609,14.5244284-3.129389,0-5.6972375-.5621049-7.9439639-1.524907Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M537.3525081,911.4125205c-2.1480473,0-4.0793098-.2883694-5.8643569-.8793235v-2.4470782c1.679447.5523695,3.4086479.8244927,5.2226335.8244927,5.9247723,0,9.4618664-3.8970482,9.4618664-10.4249592,0-4.1610483-1.0438159-7.2823422-4.2960945-12.8456374l-4.4930792-7.7016963c-2.6151244-4.4453561-3.7290019-7.7778502-3.7290019-11.1499442,0-5.4637874,3.7193558-8.9942816,9.4760818-8.9942816,1.4322007,0,2.8166784.1807386,4.0188944.516831v2.161755c-.9646159-.2508001-2.0287395-.4173233-3.2167401-.4173233-4.5291254,0-7.4559731,2.8319092-7.4559731,7.2153268,0,3.4248941,1.47637,6.2649263,3.4061094,9.622805l4.2488791,7.4559731c3.5193249,5.834403,4.9439102,10.0573898,4.9439102,14.6174844,0,7.9088348-4.2727407,12.4455756-11.7231291,12.4455756Z"
                                fill="#ff8cec"
                              />
                              <path
                                d="M564.8764047,912.6891725v-56.1721095h6.5804645v56.1721095h-6.5804645Z"
                                fill="#ff1ad9"
                              />
                              <rect
                                x="566.9560618"
                                y="858.5962471"
                                width="2.4211859"
                                height="52.0131037"
                                fill="#ff8cec"
                              />
                              <path
                                d="M585.4191927,884.6031178c0-17.0922769,11.1534923-28.8885779,29.1295606-28.8885779,4.0114873,0,7.783685.4819654,11.0727885,1.3646281v6.9010223c-3.2100928-.8826627-6.9010223-1.4447675-10.5106837-1.4447675-13.7230339,0-22.5496605,8.7476158-22.5496605,22.0676951,0,13.321208,8.8266265,22.0676951,22.5496605,22.0676951,3.6096613,0,7.3005908-.5621049,10.5106837-1.4447675v6.9010223c-3.2891035.8826627-7.0613012,1.3646281-11.0727885,1.3646281-17.9760683,0-29.1295606-11.796301-29.1295606-28.8885779Z"
                                fill="#ff1ad9"
                              />
                              <path
                                d="M614.549194,911.4125205c-16.4324854,0-27.0503678-10.5234516-27.0503678-26.8092138s10.6178824-26.8092138,27.0503678-26.8092138c3.1416016,0,6.2172032.3168002,8.9932662.9199389v2.6278167c-2.8075399-.5828311-5.6790491-.8864312-8.4317582-.8864312-14.7317153,0-24.6291819,9.7040358-24.6291819,24.1478894,0,14.4428382,9.8974666,24.146874,24.6291819,24.146874,2.7547399,0,5.6262491-.3036002,8.4317582-.8854158v2.6278167c-2.776063.6031388-5.8516646.9199389-8.9932662.9199389Z"
                                fill="#ff8cec"
                              />
                            </g>
                          </g>
                        </g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M713.6485804,893.2501609c-.0561407-.0302702-.1118105-.0612374-.1682727-.0944386-2.0809884-1.2195071-3.0532273-3.6567356-2.3234578-5.8301373l27.3264757-81.3697756-40.7010149-55.6049257c-1.213139-1.6588718-1.2943932-3.8265199-.2023062-5.4678367,1.0911914-1.6414194,3.1347919-2.4261196,5.1547248-1.9767991l57.6041659,12.8028357,18.4410205-49.8749503c.7366019-1.9931276,2.7517935-3.2212602,4.9615722-3.0258013,2.2083883.1980375,4.0882728,1.7716516,4.6247587,3.8768377l14.3150793,56.2277019,66.0369943,14.0743465c2.1993821.4680042,3.8797057,2.282634,4.115846,4.4469731.2386229,2.1652021-1.0211025,4.1587001-3.089264,4.887365l-55.4016269,19.5551425,9.3081918,29.1517747c.8279565,2.5981205-.6379383,5.2651739-3.2792702,5.9545772-2.639724.6931231-5.4524625-.8503719-6.2810821-3.44885l-10.6895608-33.4825944c-.783392-2.4463804.4727721-4.9845971,2.8869045-5.8346355l43.5667186-15.3765829-52.1110149-11.1048211c-1.950533-.4178922-3.5165504-1.9002515-3.995915-3.7824531l-11.0681845-43.4692876-14.3182282,38.7238249c-.8221742,2.2223816-3.2103543,3.4583271-5.6362503,2.9215382l-49.3913924-10.9757562,34.7422269,47.4627328c.9506828,1.2973114,1.2224612,2.93065.7303445,4.3945042l-20.5274201,61.1265262,40.0273305-43.4897321c1.0070238-1.0960751,2.4974413-1.6539317,4.0405259-1.5156387,1.5431762.1365357,2.9647312.9568387,3.8553576,2.2209128l62.1553631,88.2035446-17.5710999-55.0441198c-.829448-2.597118.6390146-5.2636426,3.2782676-5.9560687,2.6377615-.6914235,5.4508396.8532055,6.2805535,3.4514178l27.1899474,85.1629483c.7400566,2.3166992-.3463275,4.7379166-2.5596376,5.7065054-2.2120607.9645077-4.8912821.1913759-6.3138952-1.8274962l-76.9429486-109.1872954-51.9902507,56.4865019c-1.5125682,1.6444432-4.0282671,2.0078952-6.0802763.9014849Z"
                                fill="#ff1ad9"
                              />
                              <g opacity=".89">
                                <path
                                  d="M715.3582848,890.075722c-.0151035-.0081435-.0279967-.0150954-.0427029-.0239757-.5206809-.3020439-.7625484-.9144882-.5800976-1.4578103l27.9125746-83.1181637-41.8339651-57.1523785c-.3041515-.4133309-.3236214-.9558817-.0513002-1.3653524.2723392-.4112678.783956-.6066998,1.2883769-.4949582l60.761221,13.5043912,19.5108878-52.7669466c.1831115-.4979863.6883288-.8064175,1.2399736-.7565101.5532952.0486101,1.0226482.4423222,1.1569257.9684176l14.9067665,58.5525552,68.4423316,14.5855961c.5485181.1160238.9714693.571633,1.0294391,1.1117393.0600667.5413319-.2551908,1.0399585-.7726795,1.2230004l-58.6050923,20.6825227,10.3451478,32.4007233c.2074927.6486843-.1595039,1.3154034-.8194959,1.4888415s-1.3631017-.2121338-1.5701055-.8633122l-10.6904962-33.4826232c-.1950531-.6112616.1178376-1.2467688.720554-1.4586014l55.6477215-19.6378409-64.96214-13.8443691c-.4819081-.1034069-.8791693-.4740339-.9977405-.9447792l-14.0956207-55.3636435-18.4800315,49.9801064c-.2066418.5553836-.8033412.864699-1.4095938.730003l-58.7073289-13.0475061,40.3448063,55.1175958c.2372269.3247542.3040178.7331562.1823028,1.098402l-26.213408,78.0585032,52.1416967-56.6538016c.2516552-.2737878.6242461-.4119042,1.0105114-.3790852.384019.0352214.7412651.2389688.9629913.5563162l76.0264766,107.8833251-24.7853928-77.6333022c-.2082295-.6490816.1576512-1.3172582.8194223-1.4888812.6596345-.172775,1.363499.211397,1.5687057.8625574l27.1913472,85.1637031c.1847999.5770148-.086266,1.1848634-.6412139,1.4252098-.5521503.2455634-1.2212047.0500941-1.5776131-.4550311l-79.7229373-113.1303354-55.1307937,59.8998331c-.3777211.4111238-1.0074285.5024682-1.5204307.2258657Z"
                                  fill="#ffbbfc"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                        <g>
                          <g>
                            <g>
                              <g>
                                <g
                                  style={{ mixBlendMode: "screen" }}
                                  opacity=".2"
                                >
                                  <path
                                    d="M808.7545215,711.2570485c-.0352905-.0190281-.0683708-.0368645-.1017906-.0558348-4.591836-2.5445972-6.3537221-8.1331848-3.9361728-12.4842762l157.8252657-284.0549358-6.2328033-16.4230716c-.7655391-2.0128238-.7954323-4.1894852-.0889641-6.1575895l17.9770614-50.1134101c1.682713-4.6915779,7.025571-7.0001914,11.9336376-5.1556733,4.9125323,1.8394103,7.522625,7.1397025,5.8399857,11.8313201l-16.8841204,47.0683905,6.527878,17.2020911c.9390474,2.4763888.7622547,5.1758878-.4858961,7.4253444l-159.7856293,287.5873826c-2.3999116,4.3183795-8.0164917,5.7944389-12.5884517,3.3302626Z"
                                    fill="#a6daf7"
                                  />
                                </g>
                                <g opacity=".89">
                                  <path
                                    d="M812.3170799,704.6444414l-.0172401-.0092956c-.7647899-.4244394-1.0586173-1.3555079-.6553512-2.0810288l159.4580083-286.9988064-7.4624425-19.6659828c-.12778-.3349709-.1324861-.6982012-.0146295-1.0270141l17.9763983-50.1137676c.281764-.7809529,1.171046-1.1660641,1.990449-.8584333.8203383.3076596,1.2534086,1.1889468.9726869,1.9713175l-17.7957364,49.6065678,7.5133281,19.7973576c.1557486.410436.1270317.8615803-.0811639,1.2355419l-159.7857882,287.5876773c-.3996692.7206135-1.337304.9663013-2.0985189.5558665Z"
                                    fill="#fff"
                                  />
                                </g>
                              </g>
                              <g>
                                <g
                                  style={{ mixBlendMode: "screen" }}
                                  opacity=".2"
                                >
                                  <path
                                    d="M835.9040993,731.5799279c-4.5594063-2.4583584-6.4173108-7.9427629-4.1479981-12.320338l153.500409-295.9682498c1.0730736-2.0676063,2.9452783-3.6160865,5.2299956-4.3209902l25.8210933-7.963741,3.1593476-107.0932052-13.2065199,1.6587473-7.7179592,22.4023494c-1.624532,4.712773-6.9349407,7.0851905-11.8622811,5.2972298-4.9219417-1.7808656-7.6081446-7.0553438-5.9827906-11.768054l9.4805956-27.5211705c1.0842245-3.1508996,3.8968901-5.3861127,7.3151569-5.8164587l30.086767-3.7808899c2.776439-.3491504,5.6274239.541223,7.7574986,2.4224269,2.1318878,1.8831324,3.3231185,4.5600634,3.2409579,7.2925185l-3.6699686,124.4265059c-.111839,3.7365301-2.5681495,6.9263507-6.1950657,8.045081l-28.2723571,8.7209165-151.8273322,292.7428709c-2.2918366,4.4193491-7.9217107,6.0373485-12.5794716,3.6132555-.0427946-.0222183-.0869038-.0455258-.1300776-.0688044Z"
                                    fill="#a6daf7"
                                  />
                                </g>
                                <g opacity=".89">
                                  <path
                                    d="M839.4717015,724.9701355c-.7612149-.4104348-1.070234-1.3237337-.6922094-2.0541158l153.4993487-295.9678705c.1800094-.3440845.4925865-.6017608.8722131-.720298l30.829712-9.5094222,3.5866476-121.5351082-27.2734822,3.4270719-9.1869826,26.6681535c-.2706773.7845533-1.1557705,1.1807668-1.9767493.882937-.8243988-.2950142-1.2684328-1.1766023-.9980213-1.9622499l9.4811337-27.5204048c.1809894-.5250912.6501704-.8975518,1.2205244-.9684109l30.0848669-3.7824806c.4631489-.058098.9385466.0900114,1.293146.4037824.3562318.3142707.5544221.7595725.5414226,1.2159581l-3.6714082,124.4258249c-.0193676.6214592-.4282175,1.1541611-1.0321386,1.3407148l-31.2399552,9.6346544-153.2199652,295.4290756c-.3824557.7368366-1.3195668,1.009243-2.0957794.604225l-.0223237-.0120366Z"
                                    fill="#fff"
                                  />
                                </g>
                              </g>
                              <g>
                                <g
                                  style={{ mixBlendMode: "screen" }}
                                  opacity=".2"
                                >
                                  <path
                                    d="M687.0651733,889.6827321c-.7655618-.4127786-1.4905994-.9299925-2.1463272-1.5584681-30.3775017-28.9028896-42.2428895-67.6158561-33.4127411-109.005304,8.4856892-39.7456547,45.5799028-62.4367074,72.6658177-79.0060563,4.1191168-2.5197769,8.0126299-4.9012078,11.5958208-7.2048063,11.7859128-7.5746453,18.7094725-21.6614929,18.997304-38.6479102.2505952-14.7145307-1.1476045-31.5226251-2.6271304-49.3165738-3.4735944-41.7410199-7.0636417-84.90116,11.7657075-105.6087901,1.2060685-1.3264334,2.8056589-2.2557277,4.5982031-2.6719836l12.8311072-2.9811852c3.221072-.7501571,6.6862244.2429488,9.094425,2.6065635,2.3392858,2.2958366,3.3377867,5.5482048,2.6517977,8.5952606-.5150174,3.3028032-1.1847289,22.7620296,2.4239226,46.9782813,3.2696616,21.9333152,10.9392121,53.5781709,28.9206163,79.7803111,2.9359102,4.2774937,1.8461995,9.9068272-2.430151,12.5727153-4.2791104,2.6643049-10.1272047,1.3577438-13.061715-2.9189952-20.3711444-29.6832399-28.7917134-64.9447491-32.2697535-89.2963614-1.8465565-12.9349187-2.5874546-24.5738849-2.7446499-33.6001731-8.6617284,18.4662847-5.7020479,54.0350269-3.0519643,85.8746052,1.4514994,17.4473384,2.9518676,35.489405,2.6866649,51.0922286-.387104,22.8627844-10.2073516,42.1438573-26.9417086,52.8989687-3.7491046,2.4106053-7.7239285,4.8419577-11.9311558,7.4159779-25.7617934,15.758361-57.8235476,35.370448-64.7659537,67.8921085-7.4676767,35.0002681,2.4234562,67.598763,27.8465786,91.7929347,3.7870305,3.6047814,3.9840389,9.3813858.4377681,12.9046963-2.9309045,2.9125309-7.498367,3.3714123-11.132483,1.4119555Z"
                                    fill="#a6daf7"
                                  />
                                </g>
                                <g opacity=".89">
                                  <path
                                    d="M690.6263499,883.0675732c-.1266481-.0682866-.2479344-.1549833-.3572937-.2604493-28.3136308-26.9394648-39.3554448-63.1040308-31.0931297-101.8334625,7.8427483-36.7343465,41.9593318-57.6041648,69.3741066-74.3726762,4.1573338-2.5433898,8.0834835-4.9447859,11.7363736-7.2958179,13.846505-8.8989733,21.9772257-25.1497318,22.3076588-44.5843007.2554168-15.0843204-1.1578811-32.0718204-2.6543353-50.0574777-3.3430412-40.1926714-6.8009652-81.7534067,9.931493-100.1547468.2017204-.2199768.4678389-.3750862.7676801-.444591l12.8310111-2.9817124c.5362945-.1249745,1.1132666.0398644,1.5138199.4336628.4020268.3945928.565996.9560967.4326465,1.4762542-1.2944866,5.0188204-3.6692967,79.8909583,32.5514814,132.6711166.4901609.7133224.308203,1.6520272-.4051552,2.0948119-.7119424.4454499-1.6860242.2266346-2.1769797-.4852142-19.5053731-28.4256254-27.608379-62.4512334-30.9694964-85.9898889-3.123841-21.8746609-2.9662038-39.9769344-2.3736122-46.7105661l-10.0860722,2.3438932c-15.5475132,17.6634674-12.1662591,58.3156031-8.8956,97.6366963,1.4369522,17.2658525,2.9224422,35.1201687,2.6628555,50.3517291-.3459311,20.4148134-8.9580536,37.531069-23.630157,46.9614168-3.6804504,2.3666973-7.6211463,4.7770819-11.7926232,7.3285366-26.9420864,16.4801985-60.4714497,36.9910862-68.0575602,72.5208854-8.0348201,37.663414,2.677732,72.8109545,30.1648169,98.9667937.6314181.5994875.6641729,1.5634321.0741449,2.1480292-.4882592.4870329-1.2488402.5644886-1.8560734.2370782Z"
                                    fill="#fff"
                                  />
                                </g>
                              </g>
                              <g>
                                <g
                                  style={{ mixBlendMode: "screen" }}
                                  opacity=".2"
                                >
                                  <path
                                    d="M720.0570532,912.3116293c-4.4356315-2.391621-6.3523027-7.691372-4.2745383-12.0547853,2.1400566-4.4960514,7.7052567-6.2937506,12.4333218-4.0155681,27.6544919,13.3358089,59.163764,16.1519543,84.284605,7.538964,4.819355-1.6528643,10.2816711.8670666,12.2004244,5.6273288,1.9160881,4.761678-.440263,9.9620563-5.259618,11.6149206-29.7661444,10.2046015-66.7637269,7.0285563-98.9738344-8.4989195-.138972-.069416-.2750924-.1390061-.4103606-.2119406Z"
                                    fill="#a6daf7"
                                  />
                                </g>
                                <g opacity=".89">
                                  <path
                                    d="M723.6271713,905.7040492c-.739628-.3987955-1.0576382-1.2816623-.7118599-2.0107926.3567026-.749391,1.2831584-1.0466564,2.0727763-.6682642,29.5519294,14.248472,63.3466809,17.2159738,90.4026051,7.9403566.8039249-.2768914,1.7163114.1425908,2.0337589.9369066.3211154.7943916-.0728362,1.6610148-.8759882,1.9347093-27.829985,9.5435059-62.5408782,6.5148097-92.8528635-8.0979221-.0230604-.0124338-.0447051-.0222024-.0684286-.0349937Z"
                                    fill="#fff"
                                  />
                                </g>
                              </g>
                              <g>
                                <g
                                  style={{ mixBlendMode: "screen" }}
                                  opacity=".2"
                                >
                                  <path
                                    d="M847.7209192,896.9075549c-.7237878-.3902547-1.4102993-.8755699-2.0410518-1.459008-3.8422849-3.5472771-4.129055-9.3277754-.6429357-12.9067216,29.4668156-30.2401423,29.2933753-68.3746296,29.163332-96.2213294-.0723184-15.5271039-.1269909-27.7902797,4.9286577-35.8664073,6.1667052-9.8406337,16.4443901-16.0000503,27.3226425-22.5225171,1.9950201-1.1958359,4.0602401-2.432274,6.1275971-3.7088308,34.8420072-21.5081728,50.3296466-37.0702914,57.1868461-46.3398746,3.592442-4.8542708,4.8925768-8.0939688,5.3473773-9.5937289.0567466-.1810832.1007681-.3454441.1381847-.4887368l-.6799001-2.0270335c-3.5086341,3.4020081-7.8233673,7.0761217-12.9418943,10.5702691-14.9322177,10.1917829-39.8774326,20.8524206-73.9277074,13.7567008-5.1153073-1.0622738-8.5533292-5.9206959-7.6818511-10.8472228.8717837-4.9255063,5.7239568-8.0566998,10.8412852-6.9895325,52.5839379,10.9545214,78.8637448-29.7422239,79.1212154-30.155898,1.8822568-2.9881139,5.4382163-4.557432,9.0953995-4.0151861,3.6613711.5448843,6.7480383,3.1011505,7.9039422,6.5428965l6.7208499,20.0322081c.1917735.565845.3230844,1.1455906.40227,1.7324161.3474537,2.6882276.178931,10.2708108-8.914581,22.5599373-11.2904604,15.2612362-32.1647262,32.3501789-62.0445338,50.7952314-2.1663712,1.3346205-4.2794615,2.6028749-6.3253936,3.8259391-9.4190012,5.6469272-17.5548631,10.5244828-21.5213828,16.8561379-2.4134957,3.8545072-2.3617607,15.420484-2.3095533,26.6083351.1354884,29.0972736.3350645,73.0721882-34.0381391,108.3506033-2.9138441,2.9895319-7.5453711,3.4965077-11.2306757,1.5113527ZM975.5969105,668.8339886c.0948407.4096423.2253743.8082895.3833874,1.1938907-.0332312-.133077-.0722091-.2692525-.1188065-.4048767l-.2645809-.789014Z"
                                    fill="#a6daf7"
                                  />
                                </g>
                                <g opacity=".89">
                                  <path
                                    d="M851.2828903,890.2909224c-.1208278-.0651484-.2365348-.1433214-.3395818-.2433869-.6418486-.5903718-.6886636-1.5525783-.106202-2.1504791,31.5102161-32.3385836,31.3246482-72.1817987,31.1906825-101.275018-.0649705-14.3539571-.1171383-25.6935574,3.8409077-32.0079096,5.2474497-8.3800006,14.3585496-13.8382414,24.9044043-20.1609807,2.015827-1.208676,4.1006745-2.4573539,6.2079278-3.7597563,65.6188805-40.5007449,66.3208057-61.6043759,66.2559323-63.3113985l-5.6513955-16.8400055c-3.0306932,4.0501635-9.8517487,12.1486537-20.6430401,19.5156598-13.705509,9.3529961-36.6125647,19.1358502-67.9234475,12.6122487-.8529-.1784858-1.4247604-.9882562-1.2805736-1.808584.1444034-.8224933.9545023-1.3431109,1.80713-1.1642965,30.1616676,6.2833896,52.2242391-3.1060797,65.4216208-12.0866937,14.3706189-9.7771963,21.6777166-21.217696,21.749636-21.3322103.3123264-.4983051.9043443-.759079,1.5148451-.6685936.6090613.0898043,1.1222406.5159906,1.3163899,1.0910095l6.7221825,20.0315002c.0306733.094611.0547694.1911912.0669881.2891649.1203622.9272129,2.1457187,23.2125487-67.5944427,66.2607173-2.1260682,1.3113716-4.2174617,2.5670755-6.2428432,3.7795388-10.2233529,6.1293727-19.0545647,11.4231918-23.9369045,19.2158107-3.5151272,5.6133495-3.4655118,16.5806106-3.4020314,30.4671363.065618,14.2201281.1465954,31.920242-3.8138307,49.9594897-4.6540514,21.1978208-13.877154,38.6444102-28.1924617,53.3361406-.4864452.4974253-1.2574387.5821996-1.8718921.2508962Z"
                                    fill="#fff"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                        <g>
                          <g>
                            <g>
                              <g>
                                <g>
                                  <path
                                    d="M830.828602,616.8938647l-.0151771-.0081833c-2.4586979-1.3353899-3.4250186-4.3089927-2.1567704-6.6405203l102.2258995-188.0383753-11.9570072-.3796546c-2.7675876-.0908999-5.0359949-2.3382973-5.0667779-5.0247733-.0310265-2.6870828,2.1866964-4.7936636,4.9540243-4.705633l20.2822385.6468384c1.757749.0570963,3.3972435,1.0019457,4.3206007,2.4929704.9219176,1.4903436.9954477,3.3088246.1913467,4.7915124l-106.0426687,195.0552597c-1.264969,2.3272096-4.2772317,3.13613-6.7357083,1.810559Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M832.5391841,613.7213255l-.0036101-.0019465c-.6139984-.3339109-.8567337-1.0771974-.5388261-1.6616917l105.0888144-193.2999458-18.2029662-.5797064c-.6900433-.020563-1.2565978-.5837362-1.2654477-1.2562129-.0078354-.6710073.5469657-1.1969725,1.2384089-1.1756548l20.2835553.6461599c.4370316.0127393.848331.2488645,1.0792715.6231967.2304203.3717695.2488054.8269142.0471595,1.1973703l-106.0421305,195.0560253c-.3157625.5805158-1.0698491.7836694-1.6842288.4524057Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M887.172531,378.7100573c-1.8933121-1.0208434-3.0292699-3.1200385-2.6580759-5.2490425.4592249-2.6284267,3.042321-4.3043574,5.7711006-3.7427159l47.0945622,9.6923627c2.7287688.5607798,4.5697637,3.1469105,4.1107937,5.7755698-.4568608,2.628275-3.0401844,4.3055094-5.7696719,3.7425353l-47.0946199-9.690492c-.5201092-.1082186-1.0076155-.2874863-1.4540888-.5282175Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M888.8853811,375.536839c-.4730702-.2550718-.7571301-.7806218-.6646362-1.3130132.1146502-.6569055.7608793-1.0760708,1.442085-.9357658l47.0951241,9.6911442c.6840791.1418542,1.1424182.786858,1.0280677,1.4449712-.1144516.6565371-.7588388,1.0766955-1.4425783.9359753l-47.0946019-9.692289c-.1297046-.0262863-.2519158-.0708795-.3634604-.1310226Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M925.7989552,351.9762223c-2.2977168-1.2388919-3.3469614-3.9646957-2.347096-6.2788902,1.0535985-2.4388949,3.9819347-3.4978053,6.541111-2.3649938l21.1936568,9.3781854c2.5576427,1.1278956,3.7792378,4.0259367,2.7258271,6.4636016-1.0537683,2.4383279-3.9824728,3.4970396-6.5414793,2.3647951l-21.1927951-9.3781962c-.1290076-.0561505-.2572916-.1187577-.3792245-.1845019Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M927.5139419,348.804156c-.5738582-.3094151-.8360385-.9917702-.5870532-1.569778.2633633-.6106705.9960149-.8740698,1.6357115-.5913474l21.1929937,9.3778278c.6444984.2824586.9459532,1.0064352.6811901,1.6163509-.2630333.6084711-.9950796.8740986-1.6343789.5906395l-21.193391-9.3770911c-.0334955-.0153025-.0642023-.0299572-.0950723-.0466018Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M962.8808873,335.332827c-.5353259-.2886391-1.031016-.6747751-1.4547471-1.1548638l-19.6220934-22.1853284c-1.8420305-2.0829744-1.6616721-5.1492283.4035517-6.8481081,2.0652238-1.6988798,5.2339827-1.3874621,7.0742862.6944826l19.6218838,22.1848353c1.8420862,2.0848112,1.6603779,5.149865-.4042789,6.848575-1.5883168,1.3078573-3.829983,1.4248021-5.6186023.4604074Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M964.594599,332.1595979c-.1352682-.0729344-.2586804-.1696212-.3664939-.2899472l-19.6197896-22.1836047c-.4609364-.5220208-.4148552-1.2870282.1008036-1.7128848.517464-.4249719,1.3093064-.3443568,1.7693716.1743414l19.6215566,22.1845603c.4608005.5215672.4146566,1.2873966-.1017376,1.7128534-.3980179.3249575-.956869.3556113-1.4037107.1146815Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M893.5136369,338.2097564c-2.2649312-1.2212144-3.3254518-3.8959464-2.3794126-6.2025518,1.0098491-2.4568733,3.9156563-3.5660638,6.4933094-2.4761623l9.7686715,4.1299721c2.576896,1.0853091,3.8487179,3.9649766,2.8408247,6.4215732-1.0090163,2.4577978-3.9146537,3.5675553-6.4924765,2.4770868l-9.7699016-4.1301599c-.1588836-.0661731-.3135166-.1402295-.4610149-.2197582Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M895.2291906,335.0375203c-.5665643-.3054824-.8314341-.9735019-.5945357-1.5506094.2530423-.614809.9780827-.8924872,1.6213905-.6199898l9.7711765,4.1313227c.6455541.270095.9616202.9902532.7106076,1.6048252-.2530423.614809-.9795114.8926678-1.6235559.6197732l-9.7699752-4.1301996c-.0403654-.0171998-.0773121-.0347436-.1151076-.0551223Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M904.2874631,656.5016991c-2.4570768-1.3248162-3.4364773-4.2859771-2.1866117-6.6213303l104.6907238-195.7842065c.7962177-1.4869384,2.3551887-2.4252012,4.1076168-2.4735806,1.7540605-.0478796,3.4442039.8030335,4.4564314,2.2394639l11.6873885,16.5906695c1.5942597,2.2636672,1.0522117,5.2737449-1.209395,6.7246768-2.2624132,1.4504876-5.3874448.7893636-6.9835814-1.4725863l-6.8870407-9.7807524-100.9257486,188.7393958c-1.2510081,2.3408232-4.2670674,3.1671908-6.7346796,1.8463937l-.0151035-.0081435Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M905.9995186,653.3299544c-.6151901-.3317006-.8601717-1.0725847-.5483588-1.656181l104.6931327-195.7833832c.1986989-.3720452.5869287-.6079496,1.0248922-.6193373.4389169-.0131559.8628762.2010769,1.1165521.560756l11.6840088,16.5902356c.3985117.5663683.2632187,1.3185256-.3009622,1.6811109-.5674396.3617507-1.34782.1986783-1.7463317-.36769l-10.4872921-14.8896187-103.7469631,194.0234504c-.3142975.5864408-1.0687597.7920545-1.6858046.4622067l-.0028733-.0015493Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1055.6418329,420.1313557c-2.4491199-1.320526-3.4327794-4.2686731-2.1967113-6.6059501,1.2405751-2.3473994,4.2526044-3.1851641,6.7245826-1.8759918l42.6771128,22.6197837.0359536.0193856c2.4484568,1.3201685,3.4328531,4.2687128,2.1961059,6.6037218-1.2407737,2.3477678-4.2519254,3.1874321-6.7257563,1.876405l-42.6774703-22.6191206-.033817-.0182336Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1057.3534081,416.9569745c-.6122431-.3301116-.85797-1.0662625-.5500908-1.6510288.3114062-.586193,1.0643853-.7959346,1.6820045-.4689153l42.6792096,22.6210094.0058204.0031382c.6122431.3301116.859211,1.067312.5497333,1.6516919-.3110667.587327-1.0625146.7959923-1.6810691.4689441l-42.6783877-22.6209466-.0072202-.003893Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1058.8922866,461.5705266c-.365504-.1970739-.7127393-.4400228-1.034285-.7290298l-17.2414988-15.4835568c-2.0767788-1.8631181-2.2771554-4.9447581-.4458344-6.8807297,1.8289857-1.9367552,4.9935022-1.9963058,7.0711918-.1299388l17.241233,15.4824626c2.0775827,1.864978,2.2774212,4.9458524.4459016,6.8821924-1.544333,1.6361599-4.0459234,1.9319993-6.0367082.8586002Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1060.6015843,458.3934911c-.0906945-.048901-.1782083-.1086395-.2595806-.1817081l-17.2414316-15.4820942c-.5180262-.4669325-.5687296-1.2376235-.1103598-1.7208975.4575081-.4832632,1.2488432-.499062,1.7684744-.033166l17.2411413,15.4842199c.5196311.465896.5671492,1.23544.1100203,1.7197635-.3850843.409436-1.009702.482699-1.5082639.2138824Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1066.9633246,391.4524003c-1.6368478-.882562-2.7522293-2.5927577-2.7332076-4.500174.0306525-2.6834863,2.2948232-4.7418202,5.0635805-4.5945358l33.2264537,1.7583545c2.7662235.1468691,4.9868985,2.4404654,4.9588795,5.1259457-.0286568,2.683136-2.2958995,4.7402889-5.0626438,4.5945621l-33.2269932-1.7591176c-.8018243-.0423489-1.5576853-.2646531-2.2260691-.6250349Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1068.6714485,388.275778c-.4101513-.221147-.6873505-.647428-.68426-1.124942.0089927-.671177.5754327-1.1843368,1.2684817-1.1487133l33.2253197,1.758694c.6935307.0382575,1.2474679.6108984,1.2402723,1.2820933-.0090324.6712506-.573799,1.1848342-1.2637593,1.1485969l-33.2296845-1.7592407c-.2002475-.010974-.3880213-.0657175-.5563698-.1564882Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1084.5033431,485.3203781c-.3906273-.21062-.7632656-.4738273-1.1016502-.7899815l-7.740233-7.2082498c-2.0406005-1.9007631-2.1804484-4.9826697-.3107509-6.8831145,1.8679742-1.9004231,5.0365296-1.9039725,7.077253.00009l7.7400343,7.2086182c2.0409977,1.9000263,2.1785105,4.9811493.3102127,6.8823489-1.5560897,1.5838903-4.0156879,1.846646-5.974866.7902887Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1086.2131212,482.1459789c-.0957044-.0516023-.190182-.1174729-.2736825-.196824l-7.7389581-7.207087c-.511762-.4769633-.5479587-1.2468694-.0814239-1.7228882.4702519-.4726833,1.2650191-.4722724,1.7699581.0000611l7.7403182,7.2079154c.5096254.4758112.5456632,1.2460121.0783519,1.7217073-.3890565.3961681-1.0046219.4612841-1.4945638.1971154Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1061.8072449,363.6868574c-.9252165-.4988618-1.7117664-1.2739501-2.2071709-2.2687296-1.2255649-2.4599899-.2093446-5.3332658,2.2718461-6.4145528l17.0666371-7.4539085c2.4819852-1.0827604,5.4879593.0351535,6.7124083,2.4936858,1.2261211,2.4589584.2092362,5.3318796-2.2715478,6.4157632l-17.0676,7.4523433c-1.4764642.6457347-3.1425344.5097878-4.5045728-.2246013Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1063.5204344,360.5147731c-.2309726-.1245367-.4269515-.317502-.5512118-.5674662-.3056163-.6146711-.0516151-1.3321405.5658802-1.6041872l17.0694707-7.4522855c.6186113-.2705891,1.3708262.0068018,1.6781389.6234413.3058134.6143055.0519929,1.3332036-.5688467,1.604398l-17.0669029,7.4528142c-.3692576.1612111-.7855583.1271309-1.1265284-.0567146Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1104.3158692,345.729279c-.9591072-.5171352-1.768252-1.3295066-2.2565517-2.3700911-1.1708962-2.4839563-.0856631-5.3302004,2.4241934-6.3561866l9.5085104-3.8960009c2.5078788-1.027433,5.4919681.155232,6.6580625,2.6394521,1.1704453,2.4828525.0841499,5.3294796-2.4239276,6.3572809l-9.5102497,3.8941121c-1.4564815.5965045-3.0726264.4471521-4.4000373-.2685665Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1106.0278889,342.5574244c-.2388559-.1287872-.441218-.3321361-.5641185-.5934406-.291892-.6212536-.0199273-1.3321801.6064093-1.5897601l9.5101228-3.8937004c.6256735-.2579375,1.3721616.0387168,1.6641785.6595624.2928273.6212825.0205411,1.3329819-.6068046,1.5904933l-9.5099261,3.8933356c-.3635265.1489947-.7681744.1123501-1.0998613-.0664901Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M972.5562435,291.6893894c-1.1112471-.5991665-2.0150184-1.5926527-2.4546593-2.8483505l-4.7056111-13.4461273c-.9031228-2.5774082.4864782-5.2855027,3.1030095-6.0486629,2.6162764-.7633928,5.4676164.707628,6.3706431,3.2845089l4.7059346,13.4453509c.9024706,2.5779124-.4867603,5.2862023-3.1034068,6.0493997-1.3411244.3911988-2.7452807.1950659-3.9159102-.4361187Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M974.2683676,288.5166356c-.2781249-.1499605-.5034218-.3977222-.6141999-.7132558l-4.7060083-13.4453906c-.225194-.6442497.1236561-1.3212286.7763221-1.5121201.6545368-.1908338,1.3669132.1784334,1.5931566.8214421l4.7058097,13.445759c.2256982.6449019-.1223415,1.3223178-.7755456,1.5124436-.3355329.0986635-.6860116.0493846-.9795346-.1088783Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                                <g>
                                  <path
                                    d="M1051.3718232,335.184256c-.164812-.088864-.3250615-.1860136-.4815805-.2936091-2.3104989-1.5758563-2.9497201-4.618725-1.4281813-6.7965612l18.2789856-26.1454619c1.5224361-2.1777369,4.630348-2.654176,6.9409095-1.0888415,2.3115752,1.5773875,2.9493245,4.6194586,1.4278238,6.7972243l-18.2782489,26.1458591c-1.4191308,2.0291748-4.2156272,2.5913626-6.4597082,1.3813903Z"
                                    fill="#14a8ff"
                                  />
                                  <g opacity=".89">
                                    <path
                                      d="M1053.0788528,332.0078996c-.0417003-.0224841-.0824812-.0468499-.1209421-.0735783-.5777961-.3941753-.7382461-1.1558572-.3572028-1.6988924l18.2786461-26.1465959c.3801657-.5449348,1.1545106-.6618507,1.7346107-.2719485.5779211.3937672.7385697,1.1550808.3570042,1.6992607l-18.2778516,26.1451224c-.3552574.5072041-1.0538152.6488172-1.6142645.346632Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                              </g>
                              <g>
                                <path
                                  d="M146.3898963,468.5591377v-38.7795918c7.7560349,4.1548353,16.3428075,6.9247255,27.1458308,6.9247255,12.1879685,0,19.9434353-5.8168823,19.9434353-18.8355921,0-10.8030233-4.1548353-17.450647-11.9108666-29.3615136l-14.4036549-22.436788c-9.4175139-14.4036549-14.9578587-29.6386154-14.9578587-45.4272154,0-26.3145214,18.2819527-45.9814192,49.859717-45.9814192,9.140412,0,18.2813883,1.662047,24.0982706,4.1548353v36.2868035c-6.3705218-3.0469921-11.3566628-4.4319372-18.0048508-4.4319372-9.6946158,0-15.7886,4.4319372-15.7886,13.8494511,0,8.5873369,4.7090391,16.3428038,10.2488196,24.9301407l11.9108666,18.8355921c11.3566628,18.0048508,19.112694,33.7934508,19.112694,53.1832467,0,32.6856076-19.9434353,52.6290429-54.5681918,52.6290429-3.2489483,0-6.3490492-.1323013-9.3043376-.3807477"
                                  fill="none"
                                  stroke="#14a8ff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="8.6327956"
                                />
                                <path
                                  d="M331.9714159,471.3290279v-99.7188697l-33.2398113-25.7603177v125.4791873h-38.7790274v-196.6672848h4.1548353l67.8640034,51.2440978v-48.4742076h38.7795918v193.8973946"
                                  fill="none"
                                  stroke="#14a8ff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="8.6327956"
                                />
                                <path
                                  d="M476.5565249,471.3290279l-4.986141-18.0048508h-40.9952782l-4.986141,18.0048508h-39.6103331l62.8778624-204.9769554h4.1548353l63.1555287,204.9769554M451.0727448,378.5354481l-11.6337647,42.9344271h23.5446312"
                                  fill="none"
                                  stroke="#14a8ff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="8.6327956"
                                />
                                <path
                                  d="M671.2795815,469.1127771c-11.9114309,3.0469921-24.3759369,4.986141-40.1645369,4.986141-65.3712151,0-103.873705-40.4416388-103.873705-99.7183053,0-59.2772309,38.5024899-99.7188697,103.873705-99.7188697,15.7886,0,28.253106,1.9391489,40.1645369,4.7090391v39.3332312c-11.6337647-3.6006315-23.2675293-5.2626785-35.7320353-5.2626785-40.7187407,0-66.7567246,23.2675293-66.7567246,60.9392779,0,37.6711842,26.0379839,60.9387135,66.7567246,60.9387135,12.464506,0,24.0982706-1.662047,35.7320353-5.2626785"
                                  fill="none"
                                  stroke="#14a8ff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="8.6327956"
                                />
                                <path
                                  d="M762.6814439,471.3290279l-23.2675293-114.1225246-5.8174467,7.2018274v106.9206971h-38.7795918v-193.8973946h38.7795918v37.3946467l29.9157173-37.3946467h43.4886309l-35.733164,42.1036858,32.9632738,151.7937088"
                                  fill="none"
                                  stroke="#14a8ff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="8.6327956"
                                />
                              </g>
                              <g>
                                <path
                                  d="M146.3898963,468.5591377v-38.7795918c7.7560349,4.1548353,16.3428075,6.9247255,27.1458308,6.9247255,12.1879685,0,19.9434353-5.8168823,19.9434353-18.8355921,0-10.8030233-4.1548353-17.450647-11.9108666-29.3615136l-14.4036549-22.436788c-9.4175139-14.4036549-14.9578587-29.6386154-14.9578587-45.4272154,0-26.3145214,18.2819527-45.9814192,49.859717-45.9814192,9.140412,0,18.2813883,1.662047,24.0982706,4.1548353v36.2868035c-6.3705218-3.0469921-11.3566628-4.4319372-18.0048508-4.4319372-9.6946158,0-15.7886,4.4319372-15.7886,13.8494511,0,8.5873369,4.7090391,16.3428038,10.2488196,24.9301407l11.9108666,18.8355921c11.3566628,18.0048508,19.112694,33.7934508,19.112694,53.1832467,0,32.6856076-19.9434353,52.6290429-54.5681918,52.6290429-3.2489483,0-6.3490492-.1323013-9.3043376-.3807477"
                                  fill="none"
                                  stroke="#a1dcff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.8775985"
                                />
                                <path
                                  d="M331.9714159,471.3290279v-99.7188697l-33.2398113-25.7603177v125.4791873h-38.7790274v-196.6672848h4.1548353l67.8640034,51.2440978v-48.4742076h38.7795918v193.8973946"
                                  fill="none"
                                  stroke="#a1dcff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.8775985"
                                />
                                <path
                                  d="M476.5565249,471.3290279l-4.986141-18.0048508h-40.9952782l-4.986141,18.0048508h-39.6103331l62.8778624-204.9769554h4.1548353l63.1555287,204.9769554M451.0727448,378.5354481l-11.6337647,42.9344271h23.5446312"
                                  fill="none"
                                  stroke="#a1dcff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.8775985"
                                />
                                <path
                                  d="M671.2795815,469.1127771c-11.9114309,3.0469921-24.3759369,4.986141-40.1645369,4.986141-65.3712151,0-103.873705-40.4416388-103.873705-99.7183053,0-59.2772309,38.5024899-99.7188697,103.873705-99.7188697,15.7886,0,28.253106,1.9391489,40.1645369,4.7090391v39.3332312c-11.6337647-3.6006315-23.2675293-5.2626785-35.7320353-5.2626785-40.7187407,0-66.7567246,23.2675293-66.7567246,60.9392779,0,37.6711842,26.0379839,60.9387135,66.7567246,60.9387135,12.464506,0,24.0982706-1.662047,35.7320353-5.2626785"
                                  fill="none"
                                  stroke="#a1dcff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.8775985"
                                />
                                <path
                                  d="M762.6814439,471.3290279l-23.2675293-114.1225246-5.8174467,7.2018274v106.9206971h-38.7795918v-193.8973946h38.7795918v37.3946467l29.9157173-37.3946467h43.4886309l-35.733164,42.1036858,32.9632738,151.7937088"
                                  fill="none"
                                  stroke="#a1dcff"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.8775985"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </section>
          </div>

          <div className="snackCopy js-snackCopy">
            <div className="snackCopy__lead">
              <p className="js-snackCopyText">楽器が演奏できるバーで、</p>
              <p className="js-snackCopyText">スナックを開店します。</p>
            </div>

            <div className="snackCopy__body">
              <p className="js-snackCopyText">
                お酒・おつまみ持参でふらっと集合！見るだけ・話すだけでもOKの、ゆるセッション空間『SNACK
                PM』がオープンします！
                <br />
              </p>
              <p className="js-snackCopyText">
                お1人様でも、ご友人の方とでもお気軽にご来店ください。 <br />
                「楽器は弾けないけれど、生演奏で歌ってみたい」「ただ雰囲気を楽しみたい」という方も大歓迎！
                初めて出会う人たちと一緒に、Playing Musicしませんか♪
                <br />
              </p>
              <p className="js-snackCopyText">
                楽器とグラスの音色が混ざる夜。今宵だけのスナックで、お待ちしています。
              </p>
            </div>
          </div>

          <div className="eventInfoWrap">
            <p className="eventInfo white">
              <span className="eventInfo__label">日時</span>
              <span className="eventInfo__body">
                2026年 7月26日（日曜）
                <br />
                PM5時オープン（PM9時くらいまで）
              </span>
            </p>

            <p className="eventInfo white">
              <span className="eventInfo__label">場所</span>
              <span className="eventInfo__body">
                ORB 池尻大橋
                <br />
                <span className="little">
                  〒153-0044 東京都目黒区大橋２丁目１−１ ラウンドステージ松見坂
                  B1
                </span>
              </span>
            </p>

            <p className="eventInfo white">
              <span className="eventInfo__label">チャージ</span>
              <span className="eventInfo__body">
                ¥1,500
                <br />
                お酒などの飲み物・食べたいものは持ち込みをお願いします。
                <br />
                ソフトドリンク少しと、簡単な軽食は用意がございます。
              </span>
            </p>
            <p className="eventInfo white">
              <span className="eventInfo__label">概要</span>
              <span className="eventInfo__body">
                ・アコースティック形態のバンド楽器（マイク、ギター、ベース、電子ピアノ、ドラム）、コード譜が置いてあるバーで開催するイベントです。
                <br />
                ・ご自身でギターなどの楽器を持ち込んでいただいても大丈夫です。
                <br />
                ・生演奏・フリーセッションを楽しめます。
                <br />
                ・飲み物（お酒を含む）や食べるものはご持参をお願いします。ソフトドリンク少しと、簡単な軽食は用意がございます。
              </span>
            </p>

            {/* <p className="eventInfo">
  </p> */}
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.884732284756!2d139.68724796259136!3d35.655211472481234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f55129ba89cb%3A0xd96804cabde9ca24!2sORB!5e0!3m2!1sja!2sjp!4v1754104095029!5m2!1sja!2sjp"
              style={{
                border: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="mapProduced">
            <p className="mapProduced__text">produced by</p>

            <a
              href="/"
              className="mapProduced__link"
              aria-label="P.O. トップページへ"
            >
              <img
                src="/img/PO_rogo_251216_white.png"
                alt="P.O."
                className="mapProduced__logo"
              />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Event260726_02;
