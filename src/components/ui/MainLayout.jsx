import React, { useState, useCallback, useRef, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import TreeView from "devextreme-react/tree-view";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { navigationRoutes } from "../../config/navigationConfig";
import RealTimeClock from "./RealTimeClock";
import Footer from "./Footer";

// Fungsi helper untuk merender item menu
const renderMenuItem = (itemData) => {
  return (
    <div className="menu-item">
      <i className={`dx-icon dx-icon-${itemData.icon}`}></i>
      <span className="menu-item-text">{itemData.text}</span>
    </div>
  );
};

// Fungsi helper rekursif untuk mencari rute berdasarkan path
const findRouteByPath = (routes, path) => {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    if (route.items) {
      const found = findRouteByPath(route.items, path);
      if (found) return found;
    }
  }
  return null;
};

const MainLayout = () => {
  // --- STATE & REFS ---
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const treeViewRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // --- REACT ROUTER HOOKS ---
  const navigate = useNavigate();
  const location = useLocation();

  // --- MEMOIZED VALUES ---
  // Tentukan rute, ID, dan teks menu yang aktif berdasarkan URL saat ini.
  // useMemo digunakan agar kalkulasi ini tidak berjalan di setiap render.
  const { activeRoute, activeMenuId, activeMenuText } = useMemo(() => {
    const route = findRouteByPath(navigationRoutes, location.pathname);
    return {
      activeRoute: route,
      activeMenuId: route ? route.id : null,
      activeMenuText: route ? route.text : "Dashboard",
    };
  }, [location.pathname]);

  const isDrawerOpen = isDrawerPinned || isDrawerHovered;

  // --- CALLBACKS ---
  // Handler untuk klik item di TreeView
  const handleItemClick = useCallback(
    (e) => {
      const node = e.node;
      // Jika item adalah parent dan tidak punya path, expand/collapse saja
      if (node.children.length > 0 && !e.itemData.path) {
        const treeViewInstance = treeViewRef.current.instance();
        treeViewInstance.toggleItemExpansion(node.key);
        return;
      }

      // Jika item punya path, navigasi ke path tersebut
      if (e.itemData?.path) {
        navigate(e.itemData.path);
      }
    },
    [navigate]
  );

  // Handler untuk hover (mouse enter/leave)
  const handleMouseEnter = useCallback(() => {
    if (!isDrawerPinned) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerHovered(true), 100);
    }
  }, [isDrawerPinned]);

  const handleMouseLeave = useCallback(() => {
    if (!isDrawerPinned) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(
        () => setIsDrawerHovered(false),
        200
      );
    }
  }, [isDrawerPinned]);

  // Cleanup timeout
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`app-container ${
        isDrawerPinned ? "drawer-expanded" : "drawer-collapsed"
      }`}
    >
      <Toolbar>
        <Item
          widget="dxButton"
          options={{
            icon: "menu",
            onClick: () => setIsDrawerPinned(!isDrawerPinned),
          }}
          location="before"
        />
        <Item text={activeMenuText} location="before" cssClass="header-title" />
        <Item
          render={() => <RealTimeClock />}
          location="after"
          locateInMenu="never"
        />
        <Item text="|" location="after" />
        <Item
          widget="dxButton"
          location="after"
          options={{
            icon: "user",
            onClick: () => alert("under constructions!"),
          }}
        />
      </Toolbar>

      <Drawer
        opened={isDrawerOpen}
        minSize={80}
        maxSize={250}
        openedStateMode="shrink"
        position="left"
        revealMode="expand"
        component={() => (
          <div
            className="drawer-content"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <TreeView
              ref={treeViewRef}
              dataSource={navigationRoutes}
              onItemClick={handleItemClick}
              width="100%"
              selectionMode="single"
              selectByClick={true}
              elementAttr={{ class: "panel-list" }}
              itemRender={renderMenuItem}
              keyExpr="id"
              displayExpr="text"
              selectedItemKeys={activeMenuId ? [activeMenuId] : []}
            />
          </div>
        )}
      >
        <div className="content-block">
          {/* Outlet akan me-render komponen halaman yang cocok dengan URL */}
          <Outlet />
        </div>
        <Footer />
      </Drawer>
    </div>
  );
};

export default MainLayout;
