export class DomLogs {
  static navtext;
  static addBtn;
  static body;

  static init() {
    DomLogs.navtext = document.querySelector(".sidebar-nav p");
    DomLogs.addBtn = document.querySelector(".add-project-btn");
    DomLogs.body = document.querySelector("body");
  }
}
