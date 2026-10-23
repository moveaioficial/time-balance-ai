import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Fontes hospedadas no próprio site (sem depender do Google Fonts), só latim e pesos usados
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
