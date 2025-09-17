// Helper untuk ukuran dan style ikon default
const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  stroke: "currentColor",
  fill: "none",
};

// Definisikan ikon Heroicons di sini
export const ICONS = {
  home: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M11.25 18.75v-6.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75" /></svg>,
  file: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  // [DIGANTI] Ikon 'Outlets' sekarang gambar toko, lebih jelas
  outlets: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h1.5M15 11.25l.375-.375a.75.75 0 011.06 0l.375.375m-1.5 0V21m-4.5-9.75v9.75m0 0H2.25a.75.75 0 00-.75.75v.002c0 .414.336.75.75.75h19.5a.75.75 0 00.75-.75v-.002a.75.75 0 00-.75-.75H10.5" /></svg>,
  // [DIGANTI] Ikon 'Sales' sekarang gambar satu orang, lebih pas
  sales: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  box: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  product: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
  cart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.831a.75.75 0 00-.67-1.03H6.088l-.92-3.443A.75.75 0 004.34 3H3z" /></svg>,
  // [DIGANTI] Ikon 'Reports' sekarang gambar grafik, lebih cocok untuk laporan
  reports: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  money: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};