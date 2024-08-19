import React from "react";
import ReactDOM from "react-dom/client"; // React 18 dan boshlab
import App from "./App";
import "./index.css";
// root elementni olish
const rootElement = document.getElementById("root");

if (rootElement) {
  // root element mavjud bo'lsa, createRoot yordamida ildizni yaratish
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
