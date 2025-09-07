export const provinces = [
  { id: 1, name: "DKI Jakarta" },
  { id: 2, name: "Jawa Barat" },
  { id: 3, name: "Jawa Timur" },
];

export const cities = [
  { id: 101, name: "Jakarta Barat", provinceId: 1 },
  { id: 102, name: "Jakarta Selatan", provinceId: 1 },
  { id: 103, name: "Jakarta Timur", provinceId: 1 },
  { id: 201, name: "Bandung", provinceId: 2 },
  { id: 202, name: "Bekasi", provinceId: 2 },
  { id: 203, name: "Bogor", provinceId: 2 },
  { id: 301, name: "Surabaya", provinceId: 3 },
  { id: 302, name: "Malang", provinceId: 3 },
];

export const initialCustomers = [
  {
    id: 1,
    companyName: "Hartono Elektronika",
    phone: "(021) 778977",
    registrationDate: new Date(2023, 4, 15),
    email: "sales@hartono.com",
    website: "https://hartonoelektronika.com",
    province: { id: 1, name: "DKI Jakarta" },
    city: { id: 101, name: "Jakarta Barat"},
  },
  {
    id: 2,
    companyName: "Electronics City",
    phone: "(021) 7274099",
    registrationDate: new Date(2022, 8, 20),
    email: "info@electronics-city.com",
    website: "https://eci.id",
    province: { id: 1, name: "DKI Jakarta" },
    city: { id: 102, name: "Jakarta Selatan" },
  },
  {
    id: 3,
    companyName: "Global Elektronika",
    phone: "(62) 887890192",
    registrationDate: new Date(2023, 1, 1),
    email: "support@global-elektronik.com",
    website: "https://global-elektronik.com",
    province: { id: 2, name: "Jawa Barat" },
    city: { id: 201, name: "Bandung" },
  },
  {
    registrationDate: "2025-09-03T08:31:04.444Z",
    companyName: "Test1",
    phone: "7778",
    province: { id: 1, name: "DKI Jakarta" },
    city: { id: 101, name: "Jakarta Barat"},
    email: "test1@mail.com",
    website: "test1.com",
    id: 4,
  },
];

export const initialProducts = [
  { id: 1, name: "HD Video Player", price: 330, category: "Video Players" },
  {
    id: 2,
    name: "SuperHD Video Player",
    price: 400,
    category: "Video Players",
  },
  { id: 3, name: "SuperPlasma 50", price: 2400, category: "Televisions" },
  { id: 4, name: "SuperLED 50", price: 1600, category: "Televisions" },
  { id: 5, name: "DesktopLED 21", price: 175, category: "Monitors" },
];
