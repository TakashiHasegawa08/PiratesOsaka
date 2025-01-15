// src/components/Header.js
import React from "react";
import HamburgerMenu from "./HamburgerMenu";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      {/* ハンバーガーメニュー */}
      <HamburgerMenu />
      {/* ロゴ */}
      <div className="header-logo">
        <Link to="/">
          <img src="/img/header_rogo.jpg" alt="header_rogo" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
