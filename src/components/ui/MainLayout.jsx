import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import TreeView from "devextreme-react/tree-view";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { navigationRoutes } from "../../config/navigationConfig";
import RealTimeClock from "./RealTimeClock";
import Footer from "./Footer";

// Renderer untuk item menu
const renderMenuItem = (itemData, isDrawerOpen) => {
  const isActive = itemData.selected;

  // Kelas untuk state aktif dan hover, menggunakan warna dari config
  const activeClasses = "bg-bi-slate-200"; // Background abu-abu lebih gelap
  const activeTextIconClasses = "text-bi-blue-700"; // Ikon & teks jadi biru
  const hoverClasses = "hover:bg-bi-slate-100 hover:text-bi-blue-700";
  const defaultClasses = "text-bi-slate-700";

  // Clone ikon untuk menambahkan class
  const iconWithClasses = React.cloneElement(itemData.icon, {
    className: `transition-colors duration-200 ${isActive ? activeTextIconClasses : `${defaultClasses} group-hover:text-bi-blue-700`}`,
    style: { width: isDrawerOpen ? '1.25rem' : '1.5rem', height: isDrawerOpen ? '1.25rem' : '1.5rem' }
  });

  if (isDrawerOpen) {
    const itemClasses = `group flex items-center gap-4 px-4 py-2 mx-2 my-1 rounded-md transition-colors duration-200 cursor-pointer ${
      isActive ? `${activeClasses} font-semibold` : hoverClasses
    }`;
    
    return (
      <div className={itemClasses}>
        {iconWithClasses}
        <span className={`whitespace-nowrap ${isActive ? activeTextIconClasses : defaultClasses} group-hover:text-bi-blue-700`}>
          {itemData.text}
        </span>
      </div>
    );
  }

  const collapsedItemClasses = `group flex items-center justify-center h-10 w-10 mx-auto my-1 rounded-lg transition-colors duration-200 cursor-pointer ${
    isActive ? activeClasses : hoverClasses
  }`;

  return (
    <div className={collapsedItemClasses} title={itemData.text}>
      {iconWithClasses}
    </div>
  );
};

// Fungsi helper untuk mencari route by path
const findRouteByPath = (routes, path) => {
  for (const route of routes) {
    if (route.path === path) return route;
    if (route.items) {
      const found = findRouteByPath(route.items, path);
      if (found) return found;
    }
  }
  return null;
};

const MainLayout = () => {
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const treeViewRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { activeMenuId, activeMenuText } = useMemo(() => {
    const route = findRouteByPath(navigationRoutes, location.pathname);
    return {
      activeMenuId: route ? route.id : null,
      activeMenuText: route ? route.text : "Dashboard",
    };
  }, [location.pathname]);

  const isDrawerOpen = isDrawerPinned || isDrawerHovered;

  const handleMouseEnter = useCallback(() => {
    if (!isDrawerPinned) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerHovered(true), 50);
    }
  }, [isDrawerPinned]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsDrawerHovered(false), 200);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleItemClick = useCallback(
    (e) => {
      const node = e.node;
      if (isDrawerOpen && node.children.length > 0 && !e.itemData.path) {
        treeViewRef.current.instance.toggleItemExpansion(node.key);
        return;
      }
      if (e.itemData?.path) {
        navigate(e.itemData.path);
      }
    },
    [navigate, isDrawerOpen]
  );

  return (
    <div
      className={`app-container ${
        isDrawerPinned ? "drawer-expanded" : "drawer-collapsed"
      }`}
    >
      {/* Toolbar utama dengan warna BI Blue */}
      <Toolbar>
        <Item location="before">
          <button
            onClick={() => setIsDrawerPinned(!isDrawerPinned)}
            className="p-2 rounded-full hover:bg-bi-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <i className="dx-icon dx-icon-menu text-white"></i>
          </button>
        </Item>
        <Item
          text={activeMenuText}
          location="before"
          cssClass="!text-lg !font-semibold !text-white !ml-2"
        />
        <Item
          render={() => <RealTimeClock />}
          location="after"
          locateInMenu="never"
        />
        <Item text="|" location="after" cssClass="!text-bi-blue-400" />
        <Item
          widget="dxButton"
          location="after"
          options={{
            icon: "user",
            stylingMode: "text",
            elementAttr: { class: "!text-white hover:!bg-bi-blue-800" },
            onClick: () => alert("under constructions!"),
          }}
        />
      </Toolbar>

      <Drawer
        opened={isDrawerOpen}
        minSize={100}
        maxSize={250}
        openedStateMode="shrink"
        position="left"
        revealMode="expand"
        component={() => (
          <div
            className="h-full bg-white border-r border-bi-slate-200"
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
              itemRender={(item) => renderMenuItem(item, isDrawerOpen)}
              keyExpr="id"
              selectedItemKeys={activeMenuId ? [activeMenuId] : []}
              expandEvent="none"
            />
          </div>
        )}
      >
        <div className="content-block">
          <Outlet />
        </div>
        <Footer />
      </Drawer>
    </div>
  );
};

export default MainLayout;
