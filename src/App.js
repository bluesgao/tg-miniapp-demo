import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CryptoDetail from "./CryptoDetail";

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