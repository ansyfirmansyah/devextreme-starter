import React from "react";
import { Route, Routes } from "react-router-dom";
import ContactGrid from "./components/ContactGrid";
import ContactForm from "./components/ContactForm";

const ContactPage = () => {
  return (
    <Routes>
      <Route index element={<ContactGrid />} />
      <Route path="new" element={<ContactForm />} />
      <Route path=":id" element={<ContactForm />} /> 
      <Route path=":id/edit" element={<ContactForm />} />
    </Routes>
  );
};

export default ContactPage;