import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";

const HamburgerMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const location = useLocation();

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

  const toggleMenu = () => {
    const scrollbarWidth = getScrollbarWidth();

    if (!menuOpen) {
      setScrollPos(window.pageYOffset);
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
      window.scrollTo(0, scrollPos);
    }

    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    document.body.style.overflow = "";
    document.body.style.marginRight = "";
    setMenuOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      {/* PCヘッダー */}
      <div className={`pc-header PC-only ${menuOpen ? "hidden" : "visible"}`}>
        <div className="contents_inner">
          <div className="header-logo">
            <Link to="/">
              <img src="/img/header_rogo.png" alt="header_rogo" />
            </Link>
          </div>
          <Navigation />
        </div>
      </div>

      {/* ハンバーガーメニュー */}
      <div className="header-logo sp-only">
        <Link to="/">
          <img src="/img/header_rogo.png" alt="header_rogo" />
        </Link>
      </div>
      <div className="outerMenu sp-only">
        <input
          className="checkboxToggle"
          type="checkbox"
          checked={menuOpen}
          onChange={toggleMenu}
        />
        <div className={`hamburger ${menuOpen ? "hamburgerOpen" : ""}`}>
          <div></div>
        </div>
        <div className={`menu ${menuOpen ? "menuOpen" : ""}`}>
          <div>
            <div className="bg">
              <div className="inner">
                <Navigation onClose={closeMenu} isMobile={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
