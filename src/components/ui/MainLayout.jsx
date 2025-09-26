import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { Button } from 'devextreme-react/button';
import { Popover } from 'devextreme-react/popover';
import { List } from 'devextreme-react/list';

import { navigationRoutes } from "../../config/navigationConfig";
import RealTimeClock from "./RealTimeClock";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

/**
 * Fungsi rekursif untuk mencari nama menu aktif berdasarkan path saat ini.
 * @param {Array} routes - Daftar route dari navigationConfig
 * @param {string} path - Path aktif dari router
 * @returns {string} - Nama menu aktif
 */
const findRouteText = (routes, path) => {
  for (const route of routes) {
    if (route.path && path.startsWith(route.path) && route.path !== "/")
      return route.text;
    if (route.path === path && path === "/") return route.text;
    if (route.items) {
      const found = findRouteText(route.items, path);
      if (found) return found;
    }
  }
  return "Dashboard";
};

/**
 * Komponen layout utama aplikasi.
 * Mengatur sidebar, toolbar, dan area konten utama.
 */
const MainLayout = () => {
  // State untuk autentikasi
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // State untuk sidebar: pinned (tetap terbuka) atau hovered (terbuka saat mouse di atas)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // State untuk menu user
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const userMenuItems = [
    { id: 1, text: 'Profile', icon: 'user' },
    { id: 2, text: 'Logout', icon: 'runner' }
  ];
  const onUserMenuItemClick = (e) => {
    if (e.itemData.id === 2) { // ID untuk Logout
      handleLogout();
    } else {
      notify("Fitur belum tersedia.", "info", 1500);
      setIsUserMenuVisible(false);
    }
  };

  // Mendapatkan lokasi path saat ini dari router
  const location = useLocation();

  // Ref untuk timeout hover sidebar
  const hoverTimeoutRef = useRef(null);

  // Mendapatkan nama menu aktif berdasarkan path saat ini
  const activeMenuText = useMemo(() => {
    const currentPath = location.pathname === "/" ? "/home" : location.pathname;
    return findRouteText(navigationRoutes, currentPath);
  }, [location.pathname]);

  // Sidebar terbuka jika pinned atau sedang di-hover
  const isSidebarOpen = isSidebarPinned || isSidebarHovered;

  /**
   * Handler saat mouse masuk ke area sidebar.
   * Membuka sidebar jika belum pinned.
   */
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!isSidebarPinned) {
      setIsSidebarHovered(true);
    }
  }, [isSidebarPinned]);

  /**
   * Handler saat mouse keluar dari area sidebar.
   * Menutup sidebar setelah delay 200ms.
   */
  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarHovered(false);
    }, 200);
  }, []);

  // Membersihkan timeout saat komponen unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Toolbar utama aplikasi */}
      <Toolbar>
        {/* Tombol toggle sidebar */}
        <Item location="before">
          <button
            onClick={() => setIsSidebarPinned(!isSidebarPinned)}
            className="p-2 rounded-full hover:bg-bi-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <i className="dx-icon text-white dx-icon-menu"></i>
          </button>
        </Item>
        {/* Nama menu aktif */}
        <Item
          text={activeMenuText}
          location="before"
          cssClass="!text-lg !font-semibold !text-white !ml-2"
        />
        {/* Jam realtime di kanan toolbar */}
        <Item render={() => <RealTimeClock />} location="after" />
        {/* Separator */}
        <Item text="|" location="after" cssClass="!text-bi-blue-400" />
        {/* Tombol User */}
        <Item location="after">
          <Button
            id="user-menu-button"
            stylingMode="text"
            onClick={() => setIsUserMenuVisible(!isUserMenuVisible)}
            elementAttr={{ class: "!text-white hover:!bg-bi-blue-800 !px-0.3 !py-0.3 !rounded-md" }}
          >
            <div className="flex items-center gap-2">
              <i className="dx-icon dx-icon-user"></i>
              <span>{user ? user.userName : 'User'}</span>
            </div>
          </Button>
          <Popover
            target="#user-menu-button"
            position="bottom"
            width={200}
            showTitle={false}
            visible={isUserMenuVisible}
            onHiding={() => setIsUserMenuVisible(false)}
          >
            <List
              dataSource={userMenuItems}
              onItemClick={onUserMenuItemClick}
              hoverStateEnabled={true}
              focusStateEnabled={false}
            />
          </Popover>
        </Item>
      </Toolbar>

      {/* Area utama aplikasi: sidebar + konten */}
      <div className="main-content-area">
        {/* Sidebar dengan event hover */}
        <Sidebar
          isOpen={isSidebarOpen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {/* Konten utama + footer */}
        <main className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;