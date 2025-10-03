import React from "react";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import RolesGrid from "./components/RolesGrid";
import RolesForm from "./components/RolesForm";
import { Tabs } from "devextreme-react";
import { useState } from "react";
import UserRolesGrid from "./components/UserRolesGrid";
import UserRolesForm from "./components/UserRolesForm";

const RolesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const TABS = [
    { id: "roles", text: "Role Access List" },
    { id: "users", text: "User Role List" },
  ];
  const activeTab = searchParams.get("tab") || "roles";
  const activeTabIndex = TABS.findIndex((t) => t.id === activeTab);

  const handleTabClick = (e) => {
    const newTabId = TABS[e.itemIndex].id;
    setSearchParams({ tab: newTabId });
  };

  return (
    <Routes>
      <Route
        index
        element={
          <div>
            <Tabs
              dataSource={TABS}
              selectedIndex={activeTabIndex}
              onItemClick={handleTabClick}
            />
            <div className="p-4 bg-white shadow-md rounded-md">
              {activeTab === "roles" && <RolesGrid />}
              {activeTab === "users" && <UserRolesGrid />}
            </div>
          </div>
        }
      />
      <Route path="new" element={<RolesForm />} />
      {/* Di DevExtreme, key seringkali string, jadi kita beri nama 'id' saja */}
      <Route path=":id" element={<RolesForm />} />
      <Route path=":id/edit" element={<RolesForm />} />
      <Route path="user/:id" element={<UserRolesForm />} />
      <Route path="user/:id/edit" element={<UserRolesForm />} />
    </Routes>
  );
};

export default RolesPage;
