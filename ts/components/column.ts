import { Elym } from "elym";
import { createTask } from "./task.ts";
import { state } from "../main.ts"; // Import the state instance
import type { column } from "../types/kanban-types.ts";

/**
 * Handles the drag over event.
 * @param {DragEvent} event - The drag event.
 */
const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
  const dropZone = (event.target as HTMLElement).closest(".kanban__tasks");
  if (!dropZone) return;
  dropZone.classList.add("dropzone-active");
};

/**
 * Gets the element after which the dragged element should be placed.
 * @param {HTMLElement} container - The container element.
 * @param {number} y - The y-coordinate of the mouse pointer.
 * @returns {HTMLElement | null} - The element after which the dragged element should be placed.
 */
const getDragAfterElement = (
  container: HTMLElement,
  y: number
): HTMLElement | null =>
  Elym.fromElement(container)
    .selectChildren(".kanban__task:not(.dragging)")
    .nodes()
    .reduce<{ element: HTMLElement | null; offset: number }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset
          ? { offset, element: child as HTMLElement }
          : closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;

/**
 * Handles the drop event.
 * @param {DragEvent} event - The drag event.
 */
const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  const dropZone = (event.target as HTMLElement).closest(".kanban__tasks");
  if (!dropZone) return;

  const task = Elym.select(".kanban__task.dragging"),
    sourceColumnId = task.node()?.closest(".kanban__column")?.id,
    targetColumnId = dropZone.closest(".kanban__tasks")?.id;

  if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
    state.moveTask(sourceColumnId, targetColumnId, {
      id: task.node()?.dataset.id ?? "",
      description:
        (
          task
            .selectChild(".kanban__task-description")
            .node() as HTMLTextAreaElement
        ).value || "",
    });
  }

  const afterElement = getDragAfterElement(
    dropZone as HTMLElement,
    event.clientY
  );
  if (!afterElement) {
    dropZone.appendChild(task.node());
  } else {
    dropZone.insertBefore(task.node(), afterElement);
  }
};

/**
 * Handles the add task button click event.
 * @param {string} columnId - The ID of the column where the task will be added.
 */
const handleAddTask = (columnId: string): void => {
  const task = { id: Date.now().toString() };
  state.addTask(columnId, task);
};

/**
 * Creates a new column element.
 * @param {column} param - The column data.
 * @returns {Elym} - The created column element.
 */
const createColumn = ({ id, title }: column): Elym =>
  new Elym(/*html*/ `
    <section class="kanban__column" id="${id}">
      <header class="kanban__title">
        <h2>${title}</h2>
        ${
          id === "todo"
            ? /*html*/ `<button class="kanban__add-task" type="button">+ Add</button>`
            : ""
        }
      </header>
      <menu class="kanban__tasks"></menu>
    </section>
  `)
    .selectChild(".kanban__add-task")
    .on("click", () => handleAddTask(id))
    .selectChild(".kanban__tasks")
    .on("dragover", (event) => handleDragOver(event as DragEvent))
    .on("drop", (event) => handleDrop(event as DragEvent))
    .appendElements(...state.getTasks(id).map((task) => createTask(task)))
    .backToRoot();

export { createColumn };
