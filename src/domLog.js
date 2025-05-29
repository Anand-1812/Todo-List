export class DomLogs {
  static navtext;
  static addBtn;
  static body;
  static addTaskBtn;
  static todoItems;

  static init() {
    DomLogs.navtext = document.querySelector(".sidebar-nav p");
    DomLogs.addBtn = document.querySelector(".add-project-btn");
    DomLogs.body = document.querySelector("body");
    DomLogs.addTaskBtn = document.getElementsByClassName("add-task")[0];
    DomLogs.todoItems = document.querySelector("todo-items");
  }
}
