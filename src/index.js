import "./styles.css";
import "./sidebar.js";
import { DomLogs } from "./global.js";
import { createProject, SidebarNav } from "./sidebar.js";
import { Todo } from "./todos.js";


window.addEventListener("DOMContentLoaded", () => {
  DomLogs.init(); // all global dom here  
  createProject();
  Todo.init();
});