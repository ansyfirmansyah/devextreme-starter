import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-5 py-3 text-xs text-gray-600 bg-gray-100 border-t border-gray-200 shrink-0">
      <div className="flex flex-wrap items-center justify-between">
        <div className="py-1">
          <span>
            Copyright © 2025 PT. Dataraka Solusindo. All rights reserved
          </span>
        </div>
        <div className="flex items-center gap-3 py-1">
          <Link to="/terms" className="text-blue-600 hover:underline">Terms of use</Link>
          <span className="text-gray-400">|</span>
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </div>
        <div className="py-1">
          <span>Best Viewed using IE11+, Firefox or Chrome</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;