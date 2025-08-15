import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'react-complex-tree/lib/style-modern.css'; // <- Thêm dòng này
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);