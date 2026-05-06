import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force dark theme app-wide securely on initialization
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
