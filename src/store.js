export const projects = {
  default: []
};

export let currentProject = "default";

export function setCurrentProject(projectName) {
  currentProject = projectName;
}

export function getCurrentProject() {
  return currentProject;
}