import React from "react";
import ReportViewer, {
  RequestOptions,
} from "devexpress-reporting-react/dx-report-viewer";
import { Button, SelectBox } from "devextreme-react";
import { useState } from "react";
import { useCallback } from "react";
import { refKodePenjualanDataSource } from "../../../services/penjualanService";
import { useMemo } from "react";

const host = import.meta.env.VITE_REPORTING_BASE_URL;
const reportBaseName = "StrukPenjualanReport";
const invokeAction = "DXXRDV";

const StrukPenjualanPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [activeReportUrl, setActiveReportUrl] = useState("");

  const kodePenjualanDataSource = useMemo(() => refKodePenjualanDataSource());

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategoryId(e.value);
  }, []);

  const handlePreviewClick = () => {
    const newUrl = `${reportBaseName}?paramKode=${selectedCategoryId}`;
    setActiveReportUrl(newUrl);
  };

  return (
    <>
      <div className="content">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Select a Transaction:</label>
          <SelectBox
            dataSource={kodePenjualanDataSource}
            valueExpr="jualh_kode"
            displayExpr="display"
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
            disabled={!selectedCategoryId || selectedCategoryId == ""}
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

export default StrukPenjualanPage;
