import React from "react";
import ReportViewer, {
  Callbacks,
  RequestOptions,
} from "devexpress-reporting-react/dx-report-viewer";
import { Button, SelectBox } from "devextreme-react";
import { useState } from "react";
import { useCallback } from "react";
import { refKodeOutletDataSource } from "../../../services/penjualanService";
import { useMemo } from "react";
import { useRef } from "react";

const host = import.meta.env.VITE_REPORTING_BASE_URL;
const reportBaseName = "OutletSummaryReport";
const invokeAction = "DXXRDV";

const OutletSummaryPage = () => {
  const viewerRef = useRef(null);
  const [selectedOutletKode, setSelectedOutletKode] = useState(null);
  const [activeReportUrl, setActiveReportUrl] = useState("");

  const kodeOutletDataSource = useMemo(() => refKodeOutletDataSource());

  const handleReportParamChange = useCallback((e) => {
    setSelectedOutletKode(e.value);
  }, []);

  const handlePreviewClick = () => {
    // Jika pilihan dikosongkan, sembunyikan report
    if (!selectedOutletKode) {
      setActiveReportUrl("");
      return;
    }
    const newUrl = `${reportBaseName}?outletKode=${selectedOutletKode}`;
    setActiveReportUrl(newUrl);
  };

  // Handler untuk update zoom ketika document siap
  const handleDocumentReady = (s, e) => {
    try {
      const reportPreview = s.sender?.previewModel?.reportPreview;
      const zoomScale = 0.65;

      if (!reportPreview) {
        console.warn("ReportPreview not found");
        return;
      }

      // Set originalZoom
      if (typeof reportPreview.originalZoom === "number") {
        reportPreview.originalZoom = zoomScale;
      }

      // Set zoom property if exists
      if (reportPreview.zoom !== undefined) {
        if (typeof reportPreview.zoom === "function") {
          reportPreview.zoom(zoomScale);
        } else if (typeof reportPreview.zoom === "number") {
          reportPreview.zoom = zoomScale;
        }
      }

      // Trigger necessary updates
      if (typeof reportPreview._onOriginalZoomChanged === "function") {
        reportPreview._onOriginalZoomChanged();
      }

      if (typeof reportPreview._updateCurrentPage === "function") {
        reportPreview._updateCurrentPage();
      }
    } catch (error) {
      console.error("Failed to set zoom to 100%:", error);
    }
  };

  return (
    <>
      {/* Bungkus semua dengan div flex-col untuk layout vertikal */}
      <div className="flex flex-col w-full h-full">
        {/* "Control Panel" untuk filter */}
        <div className="flex flex-wrap items-center gap-4 p-4 mb-4 bg-white rounded-md shadow-sm shrink-0">
          <SelectBox
            dataSource={kodeOutletDataSource}
            valueExpr="outlet_kode"
            displayExpr="display"
            value={selectedOutletKode}
            onValueChanged={handleReportParamChange}
            placeholder="Pilih Outlet untuk Laporan..."
            width={250}
            showClearButton={true}
          />
          <Button
            text="Preview Report"
            type="normal"
            onClick={handlePreviewClick}
            className="preview-button"
            elementAttr={{ class: "grid-add-button" }}
            disabled={!selectedOutletKode}
          />
        </div>

        <div className="relative flex-grow w-full">
          {activeReportUrl && (
            <div className="absolute inset-0">
              <ReportViewer
                ref={viewerRef}
                key={activeReportUrl}
                reportUrl={activeReportUrl}
                height="100%"
              >
                <RequestOptions host={host} invokeAction={invokeAction} />
                <Callbacks DocumentReady={handleDocumentReady} />
              </ReportViewer>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OutletSummaryPage;
