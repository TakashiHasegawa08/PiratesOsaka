import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = ({ onClose, isMobile = false }) => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <ul className={isMobile ? "navList" : "pc-nav"}>
        <li>
          <Link
            to="/"
            onClick={onClose}
            className={location.pathname === "/" ? "active" : ""}
          >
            TOP
          </Link>
        </li>
        <li>
          <Link
            to="/music"
            onClick={onClose}
            className={location.pathname === "/music" ? "active" : ""}
          >
            Music
          </Link>
        </li>
        <li>
          <Link
            to="/illustrationWorks"
            onClick={onClose}
            className={
              location.pathname === "/illustrationWorks" ? "active" : ""
            }
          >
            Illustration
          </Link>
        </li>
        <li>
          <Link
            to="/blog"
            onClick={onClose}
            className={location.pathname === "/blog" ? "active" : ""}
          >
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
