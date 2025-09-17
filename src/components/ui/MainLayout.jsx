import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import TreeView from "devextreme-react/tree-view";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { navigationRoutes } from "../../config/navigationConfig";
import RealTimeClock from "./RealTimeClock";
import Footer from "./Footer";

// [REVISI TOTAL] Fungsi render item dengan logika terpisah untuk collapsed/expanded
const renderMenuItem = (itemData, isDrawerOpen) => {
  const isActive = itemData.selected;

  // Warna hover disesuaikan menjadi slate-200 agar cocok dengan background slate-100
  const activeClasses = "bg-indigo-600 text-white";
  const defaultClasses = "text-gray-700";
  const hoverClasses = "hover:bg-slate-200 hover:text-indigo-600"; // Diubah dari gray ke slate

  const iconWithClasses = React.cloneElement(itemData.icon, {
    className: `stroke-current transition-colors duration-200 ${isActive ? 'text-white' : defaultClasses} group-hover:text-indigo-600`,
    style: { width: isDrawerOpen ? '1.25rem' : '1.5rem', height: isDrawerOpen ? '1.25rem' : '1.5rem' }
  });

  if (isDrawerOpen) {
    const itemClasses = `group flex items-center gap-4 px-4 py-2 mx-2 my-1 rounded-md transition-colors duration-200 cursor-pointer ${
      isActive ? `${activeClasses} font-semibold` : hoverClasses
    }`;
    
    return (
      <div className={itemClasses}>
        {iconWithClasses}
        <span className={`whitespace-nowrap ${isActive ? '' : defaultClasses} group-hover:text-indigo-600`}>
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


// ... (findRouteByPath tidak berubah)
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
  // ... (semua state dan hook dari versi sebelumnya tetap sama)
  const [isDrawerPinned, setIsDrawerPinned] = useState(true);
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

  const handleItemClick = useCallback((e) => {
    const node = e.node;
    if (isDrawerOpen && node.children.length > 0 && !e.itemData.path) {
      treeViewRef.current.instance.toggleItemExpansion(node.key);
      return;
    }
    if (e.itemData?.path) {
      navigate(e.itemData.path);
    }
  }, [navigate, isDrawerOpen]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toolbar className="!bg-gradient-to-r !from-gray-800 !to-gray-700 !text-white !shadow-md !flex-shrink-0">
         {/* ... Isi Toolbar tidak berubah ... */}
         <Item location="before">
            <button 
                onClick={() => setIsDrawerPinned(!isDrawerPinned)} 
                className="p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
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
        <Item text="|" location="after" cssClass="!text-gray-500" />
        <Item
          widget="dxButton"
          location="after"
          options={{
            icon: "user",
            stylingMode: "text",
            elementAttr: { class: "!text-white hover:!bg-gray-600" },
            onClick: () => alert("under constructions!"),
          }}
        />
      </Toolbar>

      <div className="flex flex-grow min-h-0">
        <Drawer
          opened={isDrawerOpen}
          minSize={100} // Sedikit lebih lebar untuk ikon yang lebih besar
          maxSize={250}
          openedStateMode="shrink"
          position="left"
          revealMode="expand"
          component={() => (
            <div 
              className="h-full bg-slate-100 border-r border-slate-200"
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
                // [PENTING] Nonaktifkan expand otomatis saat item di-klik
                expandEvent="none" 
              />
            </div>
          )}
        >
          <div className="flex flex-col w-full h-full bg-white">
            <main className="flex-grow p-6 overflow-y-auto">
              <Outlet />
            </main>
            <Footer />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default MainLayout;