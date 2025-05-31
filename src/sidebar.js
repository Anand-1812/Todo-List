import { DomLogs } from "./global";
import { Todo } from "./todos";
import { projects, setCurrentProject } from "./store";
import deleteIcon from "./assets/images/deleteIcon.svg";

function updateLocalStorage() {
  const serialized = {};
  for (const [projectName, todos] of Object.entries(projects)) {
    serialized[projectName] = todos.map(todo => [
      todo.title,
      todo.description,
      todo.dueDate,
      todo.priority
    ]);
  }
  localStorage.setItem("myLocalStore", JSON.stringify(serialized));
}

function loadFromLocalStorage() {
  const stored = JSON.parse(localStorage.getItem("myLocalStore")) || {};
  for (const [projectName, todos] of Object.entries(stored)) {
    projects[projectName] = todos.map(([title, desc, date, priority]) => ({
      title,
      description: desc,
      dueDate: date,
      priority
    }));
    createProjectItem(projectName);
  }
}

function createProjectItem(title) {
  const project = document.querySelector(".projects");

  const item = document.createElement("div");
  item.classList.add("project-item");

  const projectName = document.createElement("button");
  projectName.textContent = title;
  projectName.className = "project-btn";

  projectName.addEventListener("click", () => {
    setCurrentProject(title);
    document.querySelector(".title").textContent = title;
    document.querySelector(".todo-items").innerHTML = "";

    const todos = projects[title] || [];
    todos.forEach(todo => Todo.addTodo(todo));
  });

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.innerHTML = `<img src="${deleteIcon}" alt="Delete">`;

  delBtn.addEventListener("click", () => {
    delete projects[title];
    updateLocalStorage();
    item.remove();

    const titleElem = document.querySelector(".title");
    if (titleElem.textContent === title) {
      titleElem.textContent = "";
      document.querySelector(".todo-items").innerHTML = "";
    }
  });

  item.appendChild(projectName);
  item.appendChild(delBtn);
  project.appendChild(item);
}

function handleFormSubmit(form) {
  const title = form.project.value.trim();
  if (!title || projects[title]) return;

  projects[title] = [];
  updateLocalStorage();
  createProjectItem(title);
}

function createDialog() {
  if (document.getElementById("projectInfo")) return;

  const dialog = document.createElement("dialog");
  dialog.id = "projectInfo";

  const form = document.createElement("form");
  form.id = "projectInfoForm";
  form.method = "dialog";
  form.innerHTML = `
    <p>Project Title</p>
    <input type="text" name="project" required autocomplete="off" />
    <div class="form-btn">
      <button type="button" class="close-btn">Close</button>
      <button type="submit" class="submit-btn">Submit</button>
    </div>
  `;

  dialog.appendChild(form);
  DomLogs.body.appendChild(dialog);
  dialog.showModal();

  requestAnimationFrame(() => {
    dialog.classList.add("show");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit(form);
    closeDialog(dialog);
  });

  dialog.querySelector(".close-btn").addEventListener("click", () => {
    closeDialog(dialog);
  });

  dialog.addEventListener("close", () => {
    closeDialog(dialog);
  });
}

function closeDialog(dialog) {
  dialog.classList.remove("show");
  setTimeout(() => {
    dialog.close();
    dialog.remove();
  }, 300);
}

export function createProject() {
  DomLogs.navtext.innerHTML = "Your Projects";
  DomLogs.addBtn.addEventListener("click", createDialog);
  loadFromLocalStorage();
}
