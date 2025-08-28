import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CryptoDetail from "./pages/CryptoDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crypto/:id" element={<CryptoDetail />} />
      </Routes>
    </Router>
  );
}

export default App;