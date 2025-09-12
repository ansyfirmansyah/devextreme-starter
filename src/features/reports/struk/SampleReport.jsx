import React from "react";
import ReportViewer, {
  RequestOptions,
} from "devexpress-reporting-react/dx-report-viewer";
import { Button, SelectBox } from "devextreme-react";
import { useState } from "react";
import { useCallback } from "react";

const host = "http://localhost:5085/"; // Hapus slash (/) di akhir
const reportBaseName = "ProductReport";
const invokeAction = "DXXRDV";

const categories = [
  { id: 0, name: '--- All ---' },
  { id: 1, name: "Beverages" },
  { id: 2, name: "Condiments" },
  { id: 3, name: "Produce" },
];

const SampleReport = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0].id
  );
  const [activeReportUrl, setActiveReportUrl] = useState("");

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategoryId(e.value);
  }, []);

  const handlePreviewClick = () => {
    const newUrl = `${reportBaseName}?pCategoryID=${selectedCategoryId}`;
    setActiveReportUrl(newUrl);
  };

  return (
    <>
      <div className="content">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Select a Category:</label>
          <SelectBox
            dataSource={categories}
            valueExpr="id"
            displayExpr="name"
            value={selectedCategoryId}
            onValueChanged={handleCategoryChange}
            width={250}
          />
          <Button
            text="Preview Report"
            type="default"
            stylingMode="contained"
            onClick={handlePreviewClick}
            className="preview-button"
          />
        </div>
      </div>
      {activeReportUrl && (
        <div style={{ width: "100%", height: "100vh" }}>
          {/* Pastikan properti hostUrl sudah terpasang di sini */}
          <ReportViewer key={activeReportUrl} reportUrl={activeReportUrl}>
            <RequestOptions host={host} invokeAction={invokeAction} />
          </ReportViewer>
        </div>
      )}
    </>
  );
};

export default SampleReport;
