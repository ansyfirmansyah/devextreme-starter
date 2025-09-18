import React from "react";
import { BackIcon, CancelIcon, SaveIcon } from "../icon/actionCellIcon";

const FormActions = ({ readOnly, onCancel, onBack }) => {
  return (
    <div className="flex justify-end gap-4 pt-5 mt-5 border-t border-bi-slate-200">
      {readOnly ? (
        // Tombol Back (Gaya netral)
        <button
          type="button"
          onClick={onBack}
          // [MODIFIED] Menggunakan kelas CSS baru yang lebih spesifik
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium shadow-sm form-cancel-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500"
        >
          <BackIcon />
          Back
        </button>
      ) : (
        <>
          {/* Tombol Cancel (Gaya netral) */}
          <button
            type="button"
            onClick={onCancel}
            // [MODIFIED] Menggunakan kelas CSS baru
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium shadow-sm form-cancel-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500"
          >
            <CancelIcon />
            Cancel
          </button>

          {/* Tombol Save (Warna utama BI Blue) */}
          <button
            type="submit"
            // [MODIFIED] Menggunakan kelas CSS baru
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium shadow-sm form-save-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500"
          >
            <SaveIcon />
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default FormActions;
