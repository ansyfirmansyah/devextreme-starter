/** routing dan membungkus halaman dengan layout */
import React, { useState, useCallback } from "react";
import "./App.css"; // Global styles

// Impor Layout utama
import MainLayout from "./components/ui/MainLayout";
import { navigationRoutes } from "./config/navigationConfig";

// Fungsi helper rekursif untuk mencari rute di dalam tree
const findRouteById = (routes, id) => {
  for (const route of routes) {
    // Cek di level saat ini
    if (route.id === id) {
      return route;
    }
    // Jika ada sub-menu, cari di dalamnya
    if (route.items) {
      const found = findRouteById(route.items, id);
      if (found) {
        return found;
      }
    }
  }
  return null; // Tidak ditemukan
};

const App = () => {
  const [activeMenuId, setActiveMenuId] = useState(
    navigationRoutes[0]?.id || 0
  );

  const handleMenuClick = useCallback((e) => {
    setActiveMenuId(e.itemData.id);
  }, []);

  // Cari rute berdasarkan ID yang aktif
  const activeRoute = findRouteById(navigationRoutes, activeMenuId);

  // Fungsi untuk merender halaman yang sesuai
  const renderPage = () => {
    if (activeRoute && activeRoute.component) {
      const PageComponent = activeRoute.component;
      return <PageComponent />;
    }
    return <h2>Page Not Found</h2>;
  };

  const activeMenuText = activeRoute ? activeRoute.text : "Dashboard";

  return (
    <MainLayout
      activeMenu={activeMenuText}
      activeMenuId={activeMenuId}
      onMenuClick={handleMenuClick}
    >
      {renderPage()}
    </MainLayout>
  );
};

export default App;
