import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="contents_inner">
        &copy; {new Date().getFullYear()} Pirates Osaka. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
