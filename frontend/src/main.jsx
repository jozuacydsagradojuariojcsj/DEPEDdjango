import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SchoolYearProvider } from "./context/SchoolYearProvider.jsx";
import { AlertsProvider } from "./context/AlertsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SchoolYearProvider>
        <AlertsProvider>
          <App />
        </AlertsProvider>
      </SchoolYearProvider>
    </AuthProvider>
  </StrictMode>,
);
