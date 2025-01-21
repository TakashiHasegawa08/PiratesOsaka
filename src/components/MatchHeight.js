import React, { useEffect, useRef } from "react";

const MatchHeight = ({ children, className = "match-text" }) => {
  const containerRef = useRef(null);

  const adjustHeights = () => {
    if (!containerRef.current) return;

    // 全てのカードを取得
    const cards = Array.from(containerRef.current.children);
    if (cards.length === 0) return;

    // 行ごとのカードを判定し、グループ化
    let currentTop = cards[0].offsetTop;
    let row = [];
    const rows = [];

    cards.forEach((card) => {
      if (card.offsetTop !== currentTop) {
        rows.push(row);
        row = [];
        currentTop = card.offsetTop;
      }
      row.push(card);
    });
    rows.push(row); // 最後の行を追加

    // 各行の高さを計算
    rows.forEach((row) => {
      let maxHeight = 0;

      // 高さをリセット
      row.forEach((card) => {
        const matchText = card.querySelector(`.${className}`);
        if (matchText) {
          matchText.style.height = "auto";
          maxHeight = Math.max(maxHeight, matchText.offsetHeight);
        }
      });

      // 最大高さを適用
      row.forEach((card) => {
        const matchText = card.querySelector(`.${className}`);
        if (matchText) {
          matchText.style.height = `${maxHeight}px`;
        }
      });
    });
  };

  useEffect(() => {
    // 初期調整
    adjustHeights();

    // ウィンドウサイズ変更時に再計算
    window.addEventListener("resize", adjustHeights);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", adjustHeights);
    };
  }, [className]);

  return <div ref={containerRef}>{children}</div>;
};

export default MatchHeight;
