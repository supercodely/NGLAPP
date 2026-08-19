import { createElement } from "react";
import { createRoot } from "react-dom/client";
import TaskManager from "./app.js";

const rootEl = document.getElementById("root");
createRoot(rootEl).render(createElement(TaskManager));
