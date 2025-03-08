import { Elym } from "elym";

/**
 * Handles the blur event on the task description textarea.
 * Logs the edited task description.
 * @param {Event} event - The blur event.
 */
const handleBlurEdit = ({ target }: Event) => {
  const textArea = target as HTMLTextAreaElement;
  console.log("Edit task", textArea.value);
};

/**
 * Handles the click event on the delete task button.
 * Removes the task element from the DOM.
 * @param {Event} event - The click event.
 */
const handleDeleteTask = ({ target }: Event) => {
  const taskButton = target as HTMLElement;
  const taskElement = taskButton.closest(".kanban__task") as HTMLElement;

  if (!taskElement) return;

  if (Elym.isInstance(taskElement)) {
    const elymInstance = Elym.getInstance(taskElement);
    elymInstance?.remove();
  } else {
    taskElement.remove();
  }
};

/**
 * Handles the dragstart event on the task element.
 * Adds the dragging class to the task element.
 * @param {DragEvent} event - The dragstart event.
 */
const handleDragStart = (event: DragEvent) => {
  const task = event.target as HTMLElement;
  task.classList.add("dragging");
};

/**
 * Handles the dragend event on the task element.
 * Removes the dragging class from the task element and clears drag-over classes from drop zones.
 * @param {Event} event - The dragend event.
 */
const handleDragEnd = ({ target }: Event) => {
  const task = target as HTMLElement;
  task.classList.remove("dragging");

  const dropZones = [...document.querySelectorAll(".kanban__tasks")];
  for (const dropZone of dropZones) dropZone.classList.remove("drag-task-over");
};

/**
 * Creates a new task element with the given description.
 * @param {string} [description=""] - The description of the task.
 * @returns {Elym} The created task element.
 */
const createTask = (description: string = "") =>
  new Elym(/*html*/ `
    <li class="kanban__task" draggable="true" data-id="${Date.now()}">
      <textarea placeholder="Write a task..." class="kanban__task-description" autocorrect="true" spellcheck="true">${description}</textarea>
      <div class="kanban__task-actions">
        <button class="kanban__task-delete" type="button">🗑</button>
      </div>
    </li>
  `)
    .on("dragstart", (event) => handleDragStart(event as DragEvent))
    .on("dragend", handleDragEnd)
    .select(".kanban__task-description")
    .on("blur", handleBlurEdit)
    .select(".kanban__task-delete")
    .on("click", handleDeleteTask)
    .backToRoot();

export { createTask };
