// src/components/Header.js
import React from "react";
import HamburgerMenu from "./HamburgerMenu";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      {/* ハンバーガーメニュー */}
      <HamburgerMenu />
    </header>
  );
}

export default Header;
