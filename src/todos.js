import { DomLogs } from "./domLog";
import { format } from "date-fns";

export class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  static init() {
    DomLogs.addTaskBtn.addEventListener("click", Todo.createTask);
  }

  static createTask() {
    const todoInfo = document.createElement("dialog");
    todoInfo.id = "todo-info";

    const form = document.createElement("form");
    form.id = "todo-form";
    form.method = "dialog";
    form.innerHTML = `
      <p>Add Todo</P>
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
        <input type="number" id="priority" name="priority" autocomplete="off">
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

      const newTodo = new Todo(title, desc, date, priority);

      Todo.addTodo(newTodo);

      todoInfo.close();
      todoInfo.remove();
    });
  }

  static addTodo(todo) {
    const itemsContainer = document.querySelector(".todo-items");

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-card");

    const title = document.createElement("h3");
    title.textContent = todo.title;

    const desc = document.createElement("p");
    desc.textContent = todo.description;

    const date = document.createElement("p");
    date.textContent = `Due: ${todo.dueDate}`;

    const priority = document.createElement("p");
    priority.textContent = `Priority: ${todo.priority}`;

    todoDiv.append(title, desc, date, priority);
    itemsContainer.appendChild(todoDiv);

  }
}