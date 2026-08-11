import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css"; // 🌟 Notice the /assets/ part!
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);