import { Elym } from "elym";
import { createTask } from "./task.ts";

/**
 * Handles the drag over event.
 * @param {DragEvent} event - The drag event.
 */
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  const dropZone = (event.target as HTMLElement).closest(".kanban__tasks");
  if (!dropZone) return;
  dropZone.classList.add("drag-task-over");
};

/**
 * Gets the element after which the dragged element should be placed.
 * @param {HTMLElement} container - The container element.
 * @param {number} y - The y-coordinate of the mouse pointer.
 * @returns {HTMLElement | null} - The element after which the dragged element should be placed.
 */
const getDragAfterElement = (container: HTMLElement, y: number) => {
  const draggableElements = [
    ...container.querySelectorAll(".kanban__task:not(.dragging)"),
  ];

  return draggableElements.reduce<{
    element: HTMLElement | null;
    offset: number;
  }>(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset
        ? { offset, element: child as HTMLElement }
        : closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
};

/**
 * Handles the drop event.
 * @param {DragEvent} event - The drag event.
 */
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const dropZone = (event.target as HTMLElement).closest(".kanban__tasks");
  if (!dropZone) return;

  const task = document.querySelector(`.kanban__task.dragging`);
  if (!task) return;

  const afterElement = getDragAfterElement(
    dropZone as HTMLElement,
    event.clientY
  );
  if (!afterElement) {
    dropZone.appendChild(task);
  } else {
    dropZone.insertBefore(task, afterElement);
  }
};

/**
 * Handles the drag leave event.
 * @param {DragEvent} event - The drag event.
 */
const handleDragLeave = (event: DragEvent) => {
  const dropZone = event.target as HTMLElement;

  if (
    dropZone.matches(".kanban__tasks") &&
    !dropZone.contains(event.relatedTarget as Node)
  )
    dropZone.classList.remove("drag-task-over");
};

/**
 * Handles the add task button click event.
 */
const handleAddTask = () => {
  const task = createTask(),
    taskList = document.querySelector("#todo .kanban__tasks");
  taskList?.appendChild(task.root());
};

/**
 * Creates a new Kanban column.
 * @param {Object} param - The column parameters.
 * @param {string} param.id - The column ID.
 * @param {string} param.title - The column title.
 * @returns {Elym} - The created column element.
 */
const createColumn = ({ id, title }: { id: string; title: string }) =>
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
    .select(".kanban__add-task")
    .on("click", handleAddTask)
    .select(".kanban__tasks")
    .on("dragover", (event) => handleDragOver(event as DragEvent))
    .on("dragleave", (event) => handleDragLeave(event as DragEvent))
    .on("drop", (event) => handleDrop(event as DragEvent))
    .backToRoot();

export { createColumn };
