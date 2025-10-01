import { useAuth } from "../context/AuthContext";

/**
 * Custom hook untuk mempermudah pengecekan hak akses pengguna.
 * @returns {{hasPermission: (permissionCode: string) => boolean, permissions: string[]}}
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  /**
   * Memeriksa apakah pengguna memiliki hak akses tertentu.
   * @param {string} permissionCode - Kode hak akses yang akan diperiksa.
   * @returns {boolean} - True jika pengguna memiliki hak, false jika tidak.
   */
  const hasPermission = (permissionCode) => {
    if (!permissionCode) {
      // Jika sebuah aksi tidak memerlukan hak akses, anggap selalu diizinkan.
      return true;
    }
    return permissions.includes(permissionCode);
  };

  return { hasPermission, permissions };
};
