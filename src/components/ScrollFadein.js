import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollFadein() {
  const location = useLocation();

  useEffect(() => {
    const fadeinElements = document.querySelectorAll(".js-fadein");

    const inView = (el) => {
      const rect = el.getBoundingClientRect();
      const threshold = window.innerHeight * 0.7;
      return rect.top < threshold && rect.bottom > 0;
    };

    const handleScroll = () => {
      fadeinElements.forEach((el) => {
        if (inView(el)) {
          el.classList.add("fadein-show");
        } else {
          el.classList.remove("fadein-show");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // 初回チェック

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [location.pathname]);

  return null;
}
