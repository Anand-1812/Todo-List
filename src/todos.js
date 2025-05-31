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

    // Deafult todo
    if (projects.default.length === 0) {
      const defaultTodo = new Todo(
        "Welcome!",
        "This is how your todo is going to look like.",
        format(new Date(), "yyyy-MM-dd"),
        3
      );
      projects.default.push(defaultTodo);
      Todo.addTodo(defaultTodo);  
    }

    const stored = JSON.parse(localStorage.getItem("myLocalStore")) || [];
    stored.forEach(([title, desc, date, priority]) => {
      const todo = new Todo(title, desc, date, priority);
      Todo.addTodo(todo);
    })
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
        <input type="text" id="title" name="title" autocomplete="off">
      </p>
      <p>
        <label for="description">Description</label>
        <input type="text" id="description" name="description" autocomplete="off">
      </p>
      <p>
        <label for="date">Due Date</label>
        <input type="date" id="date" name="date">
      </P>
      <p>
        <label for="priority">Priority</label>
        <input type="number" id="priority" name="priority" min="1" max="5" autocomplete="off">
      </P>
      <p>
        <button type="button" class="close-btn">Close</button>
        <button type="submit" class="submit-btn">Submit</button>
      </p>
    `;

    // adding to the dom
    todoInfo.appendChild(form);
    document.body.appendChild(todoInfo);
    todoInfo.showModal();

    // close the dialog
    form.querySelector(".close-btn").addEventListener("click", () => {
      todoInfo.close();
      todoInfo.remove();
    });

    // handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = form.title.value;
      const desc = form.description.value;
      const date = format(new Date(form.date.value), "yyyy-MM-dd");
      const priority = form.priority.value;

      // trying local storage
      const existingTodo = JSON.parse(localStorage.getItem("myLocalStore")) || [];
      existingTodo.push([title, desc, date, priority]);
      localStorage.setItem("myLocalStore", JSON.stringify(existingTodo));
      

      const projectName = getCurrentProject();
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

    // delete todo logic......
    delteTodoBtn.addEventListener("click", () => {
      todoDiv.remove();

      const stored = JSON.parse(localStorage.getItem("myLocalStore")) || [];
      const updated = stored.filter(
        ([t, d, da, p]) => !(t === todo.title && d === todo.description && da === todo.dueDate && p == todo.priority)
      );

      localStorage.setItem("myLocalStore", JSON.stringify(updated));
      const currentProject = getCurrentProject();
      if (projects[currentProject]) {
        projects[currentProject] = projects[currentProject].filter(
          t => !(t.title === todo.title && t.description === todo.description && t.dueDate === todo.dueDate && t.priority == todo.priority)
        );
      }
    });

  }

  static sortOnPriority() {
    const itemsContainer = document.querySelector(".todo-items");
    const todos = Array.from(itemsContainer.querySelectorAll(".todo-card"));

    // gpt :(
    const sortedTodos = todos.sort((a, b) => {
      const priorityA = parseInt(a.querySelector(".todo-priority").textContent.replace(/\D/g, ''));
      const priorityB = parseInt(b.querySelector(".todo-priority").textContent.replace(/\D/g, ''));
      return priorityA - priorityB; // ascending, use b - a for descending
    });

    itemsContainer.innerHTML = ""
    sortedTodos.forEach(todo => itemsContainer.appendChild(todo));
  }
}