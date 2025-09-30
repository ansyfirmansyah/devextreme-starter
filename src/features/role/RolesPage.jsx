import React from "react";
import { Route, Routes } from "react-router-dom";
import RolesGrid from "./components/RolesGrid";
import RolesForm from "./components/RolesForm";

const RolesPage = () => {
  return (
    <Routes>
      <Route index element={<RolesGrid />} />
      <Route path="new" element={<RolesForm />} />
      {/* Di DevExtreme, key seringkali string, jadi kita beri nama 'id' saja */}
      <Route path=":id" element={<RolesForm />} /> 
      <Route path=":id/edit" element={<RolesForm />} />
    </Routes>
  );
};

export default RolesPage;