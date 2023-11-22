import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./assets/scss/style.scss";
import App from "./App";

import { HashRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";
const root = createRoot(document.getElementById("root"));

root.render(<App />);
