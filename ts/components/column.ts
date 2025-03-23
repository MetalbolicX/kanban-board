import { Elym } from "elym";
import { createTask } from "./task.ts";
import { stateStore } from "../main.ts"; // Import the state instance
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

  const task = Elym.select(".kanban__task.dragging");
  const sourceColumnId = task.node()?.closest(".kanban__column")?.id;
  const targetColumnId = dropZone.closest(".kanban__column")?.id;

  if (!(sourceColumnId && targetColumnId)) return;

  const afterElement = getDragAfterElement(
    dropZone as HTMLElement,
    event.clientY
  );
  const targetIndex = afterElement
    ? Array.from(dropZone.children).indexOf(afterElement)
    : dropZone.children.length;

  console.log(task.property("data-id"));

  stateStore.moveTask(
    sourceColumnId,
    targetColumnId,
    {
      id: task.node()?.dataset.id ?? "",
      description:
        task.selectChild(".kanban__task-description").property("value") || "",
    },
    targetIndex
  );
  if (afterElement) {
    dropZone.insertBefore(task.root() as HTMLElement, afterElement);
  } else {
    dropZone.appendChild(task.root());
  }
};

/**
 * Handles the add task button click event.
 * @param {string} columnId - The ID of the column where the task will be added.
 */
const handleAddTask = (columnId: string): void => {
  const task = { id: Date.now().toString(), description: "" };
  stateStore.addTask(columnId, task);
  Elym.select(`#${columnId} .kanban__tasks`).appendElements(createTask(task));
};

/**
 * Creates a new column element.
 * @param {column} param - The column data.
 * @returns {Elym} - The created column element.
 */
const createColumn = ({ id, title }: column): Elym => {
  const column = new Elym(/*html*/ `
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
    .selectChild(".kanban__tasks")
    .on("dragover", (event) => handleDragOver(event as DragEvent))
    .on("drop", (event) => handleDrop(event as DragEvent))
    .appendElements(...stateStore.getTasks(id).map((task) => createTask(task)))
    .backToRoot();

  if (id === "todo") {
    column
      .selectChild(".kanban__add-task")
      .on("click", () => handleAddTask(id))
      .backToRoot();
  }

  return column;
};

export { createColumn };
