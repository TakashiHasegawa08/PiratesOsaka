import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // メニューのトグル
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // メニューの状態が変わるたびにスタイルを更新
  useEffect(() => {
    const bodyStyle = document.body.style;

    if (menuOpen) {
      const scrollbarWidth = getScrollbarWidth();
      bodyStyle.overflow = "hidden";
      bodyStyle.marginRight = `${scrollbarWidth}px`;
    } else {
      bodyStyle.overflow = "";
      bodyStyle.marginRight = "";
    }

    return () => {
      bodyStyle.overflow = "";
      bodyStyle.marginRight = "";
    };
  }, [menuOpen]);

  // ページ遷移時にメニューを閉じ、スタイルをリセット
  useEffect(() => {
    setMenuOpen(false);
    const bodyStyle = document.body.style;
    bodyStyle.overflow = "";
    bodyStyle.marginRight = "";
  }, [location]);

  // スクロール位置の監視
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true); // スクロールした場合は表示
      } else {
        setIsScrolled(false); // 一番上に戻ると非表示
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // スクロールバーの幅を取得
  const getScrollbarWidth = () => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  return (
    <div>
      <div className={`pc-header ${isScrolled ? "visible" : "hidden"}`}>
        <div className="contents_inner">
          <ul className="pc-nav PC-only">
            <li>
              <Link to="/">TOP</Link>
            </li>
            <li>
              <Link to="/music">Music</Link>
            </li>
            <li>
              <Link to="/illustrationWorks">Illustration</Link>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`sp-header-nav_box_ham sp-only ${menuOpen ? "clicked" : ""}`}
        onClick={toggleMenu}
      >
        <span className="sp-header-nav_box_ham_line line-1"></span>
        <span className="sp-header-nav_box_ham_line line-2"></span>
        <span className="sp-header-nav_box_ham_line line-3"></span>
      </div>
      <div
        className={`sp-nav_nav-list sp-only ${menuOpen ? "nav-opened" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        <nav>
          <ul className="sp-nav_nav-list_box">
            <li>
              <Link to="/">TOP</Link>
            </li>
            <li>
              <Link to="/music">Music</Link>
            </li>
            <li>
              <Link to="/illustrationWorks">Illustration</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default HamburgerMenu;
