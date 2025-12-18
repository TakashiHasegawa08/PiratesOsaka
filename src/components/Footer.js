import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="contents_inner">
        &copy; {new Date().getFullYear()} PO Co., Ltd. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
