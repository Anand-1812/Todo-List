import { DomLogs } from "./domLog";
import deleteIcon from "./assets/images/deleteIcon.svg";


function handleFormSubmit(form) {
  const title = form.project.value.trim();
  if (!title) return;

  console.log("Project form submitted: ", title);
  const project = document.querySelector(".projects");
  const item = document.createElement("div");
  const projectName = document.createElement("button");
  projectName.textContent = title;
  projectName.className = "project-btn";

  const delBtn = document.createElement("button");
  delBtn.type = "button";delBtn.className = "delete-btn";
  
  delBtn.innerHTML = `<img src="${deleteIcon}" alt="Delete">`;

  // deleting the project
  delBtn.addEventListener("click", () => {
    item.remove();
  });

  item.classList.add("project-item");
  item.appendChild(projectName);
  item.appendChild(delBtn);
  project.appendChild(item);
}

// create dialog
function createDialog() {
  // Prevent adding multiple dialogs
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

  // form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit(form);
    dialog.close();
    dialog.remove();
  });

  // remove dialog from the page 
  dialog.querySelector(".close-btn").addEventListener("click", () => {
    closeDailog(dialog);
  });

  dialog.addEventListener("close", () => {
    closeDailog(dialog);
  })
}

function closeDailog(dialog) {
  dialog.classList.remove("show");
  setTimeout(() => {
    dialog.close();
    dialog.remove();
  }, 300);
}

export function createProject() {
  DomLogs.navtext.innerHTML = "Your Projects";
  DomLogs.addBtn.addEventListener("click", createDialog);
}
