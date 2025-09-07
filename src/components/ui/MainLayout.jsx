import React, { useState, useCallback, useRef } from 'react';
import Drawer from 'devextreme-react/drawer';
import TreeView from 'devextreme-react/tree-view';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { navigationRoutes } from '../../config/navigationConfig';

const renderMenuItem = (itemData) => {
  return (
    <div className="menu-item">
      <i className={`dx-icon dx-icon-${itemData.icon}`}></i>
      <span className="menu-item-text">{itemData.text}</span>
    </div>
  );
};

const MainLayout = ({ activeMenu, onMenuClick, children, activeMenuId }) => {
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);
  const treeViewRef = useRef(null);

  const handleItemClick = useCallback((e) => {
    const node = e.node;
    // Jika item adalah parent (punya sub-item) dan tidak punya 'component'
    if (node.children.length > 0 && !e.itemData.component) {
      // Buka atau tutup node tersebut secara manual
      const treeViewInstance = treeViewRef.current.instance();
      if (node.expanded) {
        treeViewInstance.collapseItem(node.key);
      } else {
        treeViewInstance.expandItem(node.key);
      }
    }
    
    // Jika item punya 'component', panggil onMenuClick
    if (e.itemData && e.itemData.component) {
      onMenuClick(e);
    }
  }, [onMenuClick]);

  return (
    <div className={`app-container ${isDrawerPinned ? 'drawer-expanded' : 'drawer-collapsed'}`}>
      <Toolbar>
        <Item
          widget="dxButton"
          options={{
            icon: 'menu',
            onClick: () => setIsDrawerPinned(!isDrawerPinned)
          }}
          location="before"
        />
        <Item
          text={activeMenu}
          location="before"
          cssClass="header-title"
        />
      </Toolbar>
      
      <Drawer
        opened={isDrawerPinned}
        minSize={80}
        maxSize={200} // TAMBAHKAN INI agar lebar maksimal konsisten
        openedStateMode="shrink"
        position="left"
        revealMode="expand"
        component={() => (
          <div className="drawer-content">
            <TreeView
            ref={treeViewRef}
              dataSource={navigationRoutes}
              onItemClick={handleItemClick}
              width="100%"
              selectionMode="single"
              selectByClick={true} // Item akan terseleksi saat diklik
              elementAttr={{ class: "panel-list" }}
              selectNodesRecursive={false} // Jangan seleksi parent saat child diseleksi
              itemRender={renderMenuItem}
              keyExpr="id" // Beritahu TreeView bahwa 'id' adalah kunci unik
              displayExpr="text" // Beritahu TreeView untuk menampilkan properti 'text'
              selectedItemKeys={[activeMenuId]}
            />
          </div>
        )}
      >
        <div className="content-block">
          {children}
        </div>
      </Drawer>
    </div>
  );
};

export default MainLayout;

