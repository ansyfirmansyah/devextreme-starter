/**
 * Sidebar.jsx
 * -----------
 * Komponen Sidebar untuk navigasi aplikasi.
 *
 * - Menampilkan menu dan sub-menu berdasarkan konfigurasi navigationRoutes.
 * - Highlight menu aktif sesuai path saat ini.
 * - Mendukung expand/collapse sub-menu.
 * - Filter menu berdasarkan permission user.
 * - Responsif terhadap perubahan path dan hak akses.
 *
 * Dependencies:
 * - React Router (Link, useLocation)
 * - navigationRoutes (config navigasi)
 * - ICONS (ikon menu)
 * - AuthContext (useAuth)
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationRoutes } from "../../config/navigationConfig";
import { ICONS } from "../icon/menuIcon";
import { useAuth } from "../../context/AuthContext"; // <-- Import useAuth

/**
 * Fungsi untuk mencari route aktif berdasarkan path saat ini.
 * Melakukan flatten pada struktur routes agar pencarian lebih mudah.
 * @param {Array} items - Daftar route dari navigationConfig
 * @param {string} path - Path aktif dari router
 * @returns {Object} - Route aktif
 */
const findActiveRoute = (items, path) => {
  const allRoutes = [];
  // Rekursif untuk flatten semua routes dan sub-routes
  const flattenRoutes = (routes, parent = null) => {
    routes.forEach((route) => {
      if (route.path) {
        allRoutes.push({
          ...route,
          parentId: parent ? parent.id : route.parentId,
        });
      }
      if (route.items) {
        flattenRoutes(route.items, route);
      }
    });
  };

  flattenRoutes(items);

  // Urutkan agar path terpanjang dicek dulu (menghindari false positive)
  const sortedRoutes = allRoutes.sort((a, b) => b.path.length - a.path.length);
  return sortedRoutes.find((route) => path.startsWith(route.path));
};

/**
 * Komponen Sidebar untuk navigasi aplikasi.
 * Menampilkan menu, sub-menu, dan highlight menu aktif.
 */
const Sidebar = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const { user } = useAuth(); // Dapatkan data user (termasuk permissions)
  const location = useLocation();
  const [activeId, setActiveId] = useState(null); // ID menu aktif
  const [expandedItems, setExpandedItems] = useState({}); // State untuk sub-menu yang terbuka

  // Update menu aktif dan sub-menu yang terbuka saat path berubah
  useEffect(() => {
    const currentPath = location.pathname === "/" ? "/home" : location.pathname;
    const activeRoute = findActiveRoute(navigationRoutes, currentPath);

    if (activeRoute) {
      setActiveId(activeRoute.id);
      // Jika menu aktif punya parent, expand parent-nya
      if (activeRoute.parentId) {
        setExpandedItems((prev) => ({ ...prev, [activeRoute.parentId]: true }));
      }
    } else {
      setActiveId(null);
    }
  }, [location.pathname]);

  /**
   * Handler klik menu utama.
   * Jika punya sub-menu, toggle expand/collapse.
   */
  const handleItemClick = (item) => {
    if (item.items && item.items.length > 0) {
      setExpandedItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    }
  };

  /**
   * Render menu dan sub-menu secara rekursif.
   * @param {Array} items - Daftar menu
   * @returns {React.Node}
   */
  const renderMenuItems = (items) => {
    // Filter menu berdasarkan hak akses pengguna
    const filteredItems = items.filter((item) => {
      if (!item.permissionCode) return true; // Tampilkan jika tidak butuh permission
      return user?.permissions?.includes(item.permissionCode);
    });

    return filteredItems.map((item) => {
      // Rekursif saring sub-menu juga
      const hasSubMenu = item.items && item.items.length > 0;
      const visibleSubMenuItems = hasSubMenu
        ? item.items.filter(
            (sub) =>
              !sub.permissionCode ||
              user?.permissions?.includes(sub.permissionCode)
          )
        : [];
      const isExpanded = !!expandedItems[item.id];
      const isActive = item.id === activeId;

      // Kelas CSS untuk item menu
      const itemClasses = [
        "group",
        "flex",
        "items-center",
        "justify-between",
        "w-full",
        "h-12",
        "px-4",
        "my-1",
        "rounded-lg",
        "cursor-pointer",
        "transition-colors",
        "duration-200",
      ];
      if (isActive) {
        itemClasses.push("bg-bi-slate-100");
      } else {
        itemClasses.push("hover:bg-bi-slate-100");
      }

      // Kelas warna untuk ikon dan teks
      const colorClasses = [
        "transition-colors",
        "duration-200",
        isActive
          ? "text-bi-blue-700"
          : "text-bi-slate-600 group-hover:text-bi-blue-700",
      ];

      const iconClasses = ["w-5", "h-5", "shrink-0", ...colorClasses];
      const textClasses = [
        "whitespace-nowrap",
        "transition-opacity",
        "duration-200",
        ...colorClasses,
      ];
      if (isActive) {
        textClasses.push("font-semibold");
      }

      // Isi link/menu
      const linkContent = (
        <>
          <div className="flex items-center gap-4">
            {React.cloneElement(item.icon, {
              className: iconClasses.join(" "),
            })}
            {isOpen && (
              <span className={textClasses.join(" ")}>{item.text}</span>
            )}
          </div>
          {isOpen && hasSubMenu && visibleSubMenuItems.length > 0 && (
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                isExpanded ? "rotate-180" : ""
              } ${colorClasses.join(" ")}`}
            >
              {ICONS.arrow}
            </div>
          )}
        </>
      );

      return (
        <React.Fragment key={item.id}>
          {/* Render link jika ada path, jika tidak render div */}
          {item.path ? (
            <Link
              to={item.path}
              className={itemClasses.join(" ")}
              onClick={() => handleItemClick(item)}
            >
              {linkContent}
            </Link>
          ) : (
            <div
              className={itemClasses.join(" ")}
              onClick={() => handleItemClick(item)}
            >
              {linkContent}
            </div>
          )}

          {/* Render sub-menu jika ada dan terlihat */}
          {hasSubMenu && visibleSubMenuItems.length > 0 && (
            <div
              className={`submenu ${isExpanded && isOpen ? "expanded" : ""}`}
            >
              <div className="pt-1">{renderMenuItems(item.items)}</div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="p-2">{renderMenuItems(navigationRoutes)}</nav>
    </aside>
  );
};

export default Sidebar;
