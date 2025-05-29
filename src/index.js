import "./styles.css";
import "./sidebar.js";
import { DomLogs } from "./domLog.js";
import { createProject, SidebarNav } from "./sidebar.js";
import { Todo } from "./todos.js";

window.addEventListener("DOMContentLoaded", () => {
  DomLogs.init();
  createProject();
  Todo.init();
});