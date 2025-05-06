import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Title = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const checkVisibility = () => {
      const element = titleRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const isHalfVisible = visibleHeight > rect.height / 2;

      console.log(
        `[Title] (${children}) 可視: ${isHalfVisible}, 高さ: ${rect.height}, 表示: ${visibleHeight}`
      );

      if (isHalfVisible && !isVisible) {
        setIsVisible(true);
        console.log("🔥 表示トリガー ON");
      } else if (!isHalfVisible && isVisible) {
        setIsVisible(false);
        console.log("💤 表示トリガー OFF");
      }
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility);
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [isVisible, children]);

  const letterVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  let charIndex = 0;

  const renderAnimated = (content) => {
    if (typeof content === "string") {
      return content.split("").map((char) => {
        const index = charIndex++;
        return (
          <motion.span
            key={index}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={letterVariants}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{ margin: "0 1px" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      });
    } else if (React.isValidElement(content)) {
      return React.cloneElement(content, {
        children: renderAnimated(content.props.children),
        key: charIndex++,
      });
    }
    return null;
  };

  return (
    <h2 className="categoryTitle" ref={titleRef}>
      {React.Children.map(children, renderAnimated)}
    </h2>
  );
};

export default Title;
