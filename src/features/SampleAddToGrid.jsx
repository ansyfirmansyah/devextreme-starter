import React, { useState, useCallback } from 'react';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import notify from 'devextreme/ui/notify';
import LoadIndicator from 'devextreme-react/load-indicator';

// --- DATA MASTER ---
const masterOutlets = [
  { ID: 1, Nama: 'Outlet Jakarta Pusat' },
  { ID: 2, Nama: 'Outlet Bandung' },
  { ID: 3, Nama: 'Outlet Surabaya' },
];

// --- SIMULASI API BACKEND --- 🚀
// Di aplikasi nyata, ini adalah fungsi yang memanggil fetch atau axios.
const api = {
  addOutlet: async (payload) => {
    console.log('API: Mengirim data outlet ke server...', payload);
    // Simulasi delay jaringan
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulasi: anggap server mengembalikan data yang sama dengan ID baru jika perlu
    console.log('API: Data berhasil disimpan!');
    // return { ...payload, serverId: Math.random() }; // Contoh jika server return data baru
    return true;
  },
  deleteOutlet: async (outletId) => {
    console.log(`API: Menghapus outlet dengan ID: ${outletId} dari server...`);
    // Simulasi delay jaringan
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulasi error (uncomment untuk tes)
    // if (outletId === 2) {
    //   console.error('API: Gagal menghapus data di server!');
    //   throw new Error('Server error: Gagal menghapus outlet.');
    // }
    console.log('API: Data berhasil dihapus!');
    return true;
  },
};
// ----------------------------


const SampleAddToGrid = () => {
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [addedOutlets, setAddedOutlets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER ADD DENGAN API ---
  const handleAddOutlet = useCallback(async () => {
    if (!selectedOutletId) return;

    const outletToAdd = masterOutlets.find(o => o.ID === selectedOutletId);
    if (!outletToAdd) return;
    
    // Cek duplikat di state lokal dulu
    if (addedOutlets.some(o => o.ID === selectedOutletId)) {
      notify('Outlet sudah ditambahkan!', 'warning', 1500);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Panggil API untuk menyimpan data
      const payload = { barangId: 'BRG001', outletId: outletToAdd.ID }; // Contoh payload
      await api.addOutlet(payload);

      // 2. Jika API berhasil, baru update state di React
      setAddedOutlets(prev => [...prev, outletToAdd]);
      setSelectedOutletId(null);
      notify('Outlet berhasil ditambahkan!', 'success', 1500);

    } catch (error) {
      notify('Gagal menyimpan ke database!', 'error', 2000);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOutletId, addedOutlets]);

  // --- HANDLER DELETE DENGAN API ---
  const handleDeleteOutlet = useCallback(async (e) => {
    // 🛡️ 1. Ambil data baris yang akan dihapus
    const outletToDelete = e.data;

    // 2. Batalkan aksi default DataGrid. Kita akan kontrol 100%
    e.cancel = true;

    if (!outletToDelete) return;
    
    setIsLoading(true);
    try {
      // 3. Panggil API untuk menghapus data dari database
      await api.deleteOutlet(outletToDelete.ID);

      // 4. Jika API berhasil, baru update state di React dengan mem-filter data
      setAddedOutlets(prev => prev.filter(o => o.ID !== outletToDelete.ID));
      notify('Outlet berhasil dihapus!', 'success', 1500);

    } catch (error) {
      notify('Gagal menghapus dari database!', 'error', 2000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Tampilkan loading indicator saat proses API berjalan */}
      {isLoading && <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
        <LoadIndicator height={60} width={60} />
      </div>}

      <div className="dx-fieldset">
        <div className="dx-field-label">Outlet</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <SelectBox
            dataSource={masterOutlets}
            valueExpr="ID" displayExpr="Nama"
            placeholder="Pilih Outlet..."
            value={selectedOutletId}
            onValueChanged={(e) => setSelectedOutletId(e.value)}
          />
          <Button text="Add" icon="add" type="default" onClick={handleAddOutlet} disabled={!selectedOutletId || isLoading} />
        </div>
        <DataGrid
          dataSource={addedOutlets}
          keyExpr="ID"
          showBorders={true}
          style={{ marginTop: '10px' }}
          onRowRemoving={handleDeleteOutlet} // <-- Handler Delete di sini
        >
          <Column dataField="Nama" />
          <Editing
            mode="row"
            allowDeleting={true}
            texts={{ confirmDeleteMessage: 'Yakin ingin hapus dari database?' }}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default SampleAddToGrid;