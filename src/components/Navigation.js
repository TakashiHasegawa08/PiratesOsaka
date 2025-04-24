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
        {/* <li>
          <a
            href="https://piratesbooks.lovesick.jp/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={location.pathname === "/book" ? "active" : ""}
          >
            Book
          </a>
        </li> */}
        <li>
          <Link
            to="/#companyProfilePage"
            onClick={onClose}
            className={location.pathname === "/" ? "active" : ""}
          >
            Company
          </Link>
        </li>
        <li>
          <Link
            to="/#form"
            onClick={onClose}
            className={
              location.pathname === "/" && location.hash === "#form"
                ? "active"
                : ""
            }
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
