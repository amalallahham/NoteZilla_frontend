import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/styles/fonts.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </>
);
