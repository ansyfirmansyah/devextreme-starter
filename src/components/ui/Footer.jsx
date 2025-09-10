import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>
            Copyright © 2025 PT. Dataraka Solusindo. All rights reserved
          </span>
        </div>
        <div className="footer-center">
          <Link to="/terms">Terms of use</Link>
          <span>|</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-right">
          <span>Best Viewed using IE11+, Firefox or Chrome</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
