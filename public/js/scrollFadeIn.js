const applyScrollFadeIn = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("appear");
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const elements = document.querySelectorAll(".js-scroll");
  elements.forEach((el) => observer.observe(el));
};

// 初回適用
applyScrollFadeIn();

// DOMの変更を監視し、新しい `.js-scroll` 要素が追加されたら適用
const mutationObserver = new MutationObserver(() => {
  applyScrollFadeIn();
});

mutationObserver.observe(document.body, { childList: true, subtree: true });
