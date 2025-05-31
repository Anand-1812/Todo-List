import { DomLogs } from "./global";
import { format } from "date-fns";
import deleteIcon from "./assets/images/deleteIcon.svg";
import { projects, getCurrentProject } from "./store";

export class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  static init() {
    document.querySelector(".todo-items").innerHTML = "";

    DomLogs.addTaskBtn.addEventListener("click", Todo.createTask);

    const allTodos = JSON.parse(localStorage.getItem("myLocalStore")) || {};
    const projectName = getCurrentProject();
    const stored = allTodos[projectName] || [];

    if (stored.length === 0) {
      const defaultTodo = new Todo(
        "Welcome!",
        "This is how your todo is going to look like.",
        format(new Date(), "yyyy-MM-dd"),
        3
      );

      if (!projects[projectName]) {
        projects[projectName] = [];
      }
      projects[projectName].push(defaultTodo);

      allTodos[projectName] = [[
        defaultTodo.title,
        defaultTodo.description,
        defaultTodo.dueDate,
        defaultTodo.priority
      ]];

      localStorage.setItem("myLocalStore", JSON.stringify(allTodos));
      Todo.addTodo(defaultTodo);
    } else {
      stored.forEach(([title, desc, date, priority]) => {
        const todo = new Todo(title, desc, date, priority);
        Todo.addTodo(todo);

        if (!projects[projectName]) {
          projects[projectName] = [];
        }
        projects[projectName].push(todo);
      });
    }
  }

  static createTask() {
    const todoInfo = document.createElement("dialog");
    todoInfo.id = "todo-info";

    const form = document.createElement("form");
    form.id = "todo-form";
    form.method = "dialog";
    form.innerHTML = `
      <p>Add Todo</p>
      <p>
        <label for="title">Title</label>
        <input type="text" id="title" name="title" autocomplete="off" required>
      </p>
      <p>
        <label for="description">Description</label>
        <input type="text" id="description" name="description" autocomplete="off">
      </p>
      <p>
        <label for="date">Due Date</label>
        <input type="date" id="date" name="date" required>
      </p>
      <p>
        <label for="priority">Priority</label>
        <input type="number" id="priority" name="priority" min="1" max="5" required>
      </p>
      <p>
        <button type="button" class="close-btn">Close</button>
        <button type="submit" class="submit-btn">Submit</button>
      </p>
    `;

    todoInfo.appendChild(form);
    document.body.appendChild(todoInfo);
    todoInfo.showModal();

    form.querySelector(".close-btn").addEventListener("click", () => {
      todoInfo.close();
      todoInfo.remove();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = form.title.value;
      const desc = form.description.value;
      const date = format(new Date(form.date.value), "yyyy-MM-dd");
      const priority = form.priority.value;

      const allTodos = JSON.parse(localStorage.getItem("myLocalStore")) || {};
      const projectName = getCurrentProject();

      if (!allTodos[projectName]) {
        allTodos[projectName] = [];
      }

      allTodos[projectName].push([title, desc, date, priority]);
      localStorage.setItem("myLocalStore", JSON.stringify(allTodos));

      if (!projects[projectName]) {
        projects[projectName] = [];
      }

      const newTodo = new Todo(title, desc, date, priority);
      projects[projectName].push(newTodo);
      Todo.addTodo(newTodo);

      todoInfo.close();
      todoInfo.remove();
    });
  }

  static addTodo(todo) {
    const itemsContainer = document.querySelector(".todo-items");

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-card");

    const todoHead = document.createElement("div");
    todoHead.className = "todo-head";

    const delteTodoBtn = document.createElement("button");
    delteTodoBtn.className = "delete-todo";
    delteTodoBtn.innerHTML = `<img src="${deleteIcon}" alt="Delete">`;

    const title = document.createElement("h3");
    title.textContent = todo.title;

    todoHead.append(title, delteTodoBtn);

    const desc = document.createElement("p");
    desc.textContent = todo.description;

    const date = document.createElement("p");
    date.innerHTML = `<strong>Due:</strong> ${todo.dueDate}`;

    const priority = document.createElement("p");
    priority.classList.add("todo-priority");
    priority.textContent = `Priority: ${todo.priority}`;

    todoDiv.append(todoHead, desc, date, priority);
    itemsContainer.appendChild(todoDiv);

    delteTodoBtn.addEventListener("click", () => {
      todoDiv.remove();

      const allTodos = JSON.parse(localStorage.getItem("myLocalStore")) || {};
      const currentProject = getCurrentProject();
      const stored = allTodos[currentProject] || [];

      const updated = stored.filter(
        ([t, d, da, p]) =>
          !(t === todo.title && d === todo.description && da === todo.dueDate && p == todo.priority)
      );

      allTodos[currentProject] = updated;
      localStorage.setItem("myLocalStore", JSON.stringify(allTodos));

      if (projects[currentProject]) {
        projects[currentProject] = projects[currentProject].filter(
          t =>
            !(t.title === todo.title &&
              t.description === todo.description &&
              t.dueDate === todo.dueDate &&
              t.priority == todo.priority)
        );
      }
    });
  }

  static sortOnPriority() {
    const itemsContainer = document.querySelector(".todo-items");
    const todos = Array.from(itemsContainer.querySelectorAll(".todo-card"));

    const sortedTodos = todos.sort((a, b) => {
      const priorityA = parseInt(a.querySelector(".todo-priority").textContent.replace(/\D/g, ''));
      const priorityB = parseInt(b.querySelector(".todo-priority").textContent.replace(/\D/g, ''));
      return priorityA - priorityB;
    });

    itemsContainer.innerHTML = "";
    sortedTodos.forEach(todo => itemsContainer.appendChild(todo));
  }
}
