import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/user.css";
import "./styles/admin.css";

createRoot(document.getElementById("root")!).render(<App />);
