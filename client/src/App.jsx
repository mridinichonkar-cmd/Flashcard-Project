
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminHistory from "./pages/AdminHistory.jsx";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-history" element={<AdminHistory />} />
    </Routes>
  );
}

export default App
