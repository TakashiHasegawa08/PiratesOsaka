import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Title = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const element = document.querySelector(".categoryTitle");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setIsVisible(true);
      }
    };

    // 初回チェック
    checkVisibility();

    // スクロールイベントを監視
    const handleScroll = () => {
      const element = document.querySelector(".categoryTitle");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 子要素を文字列に変換
  const text = React.Children.toArray(children).join(""); // 子要素を文字列に変換
  const textArray = text.split(""); // 文字列を1文字ずつ分割

  const letterVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <h1 className="categoryTitle" style={{ display: "flex", flexWrap: "wrap" }}>
      {textArray.map((letter, index) => (
        <motion.span
          key={index}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={letterVariants}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          style={{
            // display: "inline-block",
            // color: "black",
            // fontSize: "24px",
            // fontWeight: "bold",
            margin: "0 1px",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </h1>
  );
};

export default Title;
