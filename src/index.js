import "./styles.css";
import "./sidebar.js";
import { DomLogs } from "./domLog.js";
import { createProject, SidebarNav } from "./sidebar.js";

window.addEventListener("DOMContentLoaded", () => {
  DomLogs.init();
  createProject();
});