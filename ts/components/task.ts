import { Elym } from "elym";
import { state } from "../main.ts";
import type { task } from "../types/kanban-types.ts";

/**
 * Handles the blur event on the task description textarea.
 * Logs the edited task description.
 * @param {Event} event - The blur event.
 */
const handleBlurEdit = ({ target }: Event): void => {
  const textArea = target as HTMLTextAreaElement;
  console.log("Edit task", textArea.value);
};

/**
 * Handles the click event on the delete task button.
 * Removes the task element from the DOM and updates the state.
 * @param {Event} event - The click event.
 */
const handleDeleteTask = ({ target }: Event): void => {
  const taskButton = target as HTMLElement;
  const taskElement = taskButton.closest(".kanban__task") as HTMLElement;

  if (!taskElement) return;

  const columnId = taskElement.closest(".kanban__column")?.id;
  if (columnId) {
    state.removeTask(columnId, {
      id: taskElement.id,
    });
  }

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
const handleDragStart = (event: DragEvent): void => {
  const task = event.target as HTMLElement;
  task.classList.add("dragging");
};

/**
 * Handles the dragend event on the task element.
 * Removes the dragging class from the task element and clears drag-over classes from drop zones.
 * @param {Event} event - The dragend event.
 */
const handleDragEnd = ({ target }: Event): void => {
  const task = target as HTMLElement;
  task.classList.remove("dragging");

  Elym.selectAll(".kanban__tasks").each((dropZone) =>
    dropZone.classList.remove("drag-task-over")
  );
};

/**
 * Creates a task element.
 * @param {Object} param - The task object.
 * @param {string} param.id - The task id.
 * @param {string} [param.description=""] - The task description.
 * @returns {Elym} The task element.
 */
const createTask = ({ id, description = "" }: task): Elym =>
  new Elym(/*html*/ `
    <li class="kanban__task" draggable="true" data-id="${id}">
      <textarea placeholder="Write a task..." class="kanban__task-description" autocorrect="true" spellcheck="true">${description}</textarea>
      <div class="kanban__task-actions">
        <button class="kanban__task-delete" type="button">🗑</button>
      </div>
    </li>
  `)
    .on("dragstart", (event) => handleDragStart(event as DragEvent))
    .on("dragend", handleDragEnd)
    .selectChild(".kanban__task-description")
    .on("blur", handleBlurEdit)
    .selectChild(".kanban__task-delete")
    .on("click", handleDeleteTask)
    .backToRoot();

export { createTask };
