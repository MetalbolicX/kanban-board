import { Elym } from "elym";

const handleBlurEdit = ({ target }: Event) => {
  const textArea = target as HTMLTextAreaElement;
  console.log("Edit task", textArea.value);
};

const handleDeleteTask = ({ target }: Event) => {
  const taskButton = target as HTMLElement;
  const task = taskButton.closest(".kanban__task") as HTMLElement;
  console.log("Delete task", task);
};

const handleDragStart = (event: DragEvent) => {
  const task = event.target as HTMLElement;
  task.classList.add("dragging");
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  const dropZone = (event.target as HTMLElement).closest(".kanban__tasks");
  if (!dropZone) return;
  dropZone.classList.add("drag-task-over");
};

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

const handleDragLeave = (event: DragEvent) => {
  const dropZone = event.target as HTMLElement;

  if (
    dropZone.matches(".kanban__tasks") &&
    !dropZone.contains(event.relatedTarget as Node)
  )
    dropZone.classList.remove("drag-task-over");
};

const handleDragEnd = ({ target }: Event) => {
  const task = target as HTMLElement;
  task.classList.remove("dragging");

  const dropZones = [...document.querySelectorAll(".kanban__tasks")];
  for (const dropZone of dropZones) dropZone.classList.remove("drag-task-over");
};

const createTask = (description: string = "") =>
  new Elym(/*html*/ `
    <li class="kanban__task" draggable="true" data-id="${Date.now()}">
      <textarea placeholder="Write a task..." class="kanban__task-description" autocorrect="true" spellcheck="true">${description}</textarea>
      <div class="kanban__task-actions">
        <button class="kanban__task-edit" type="button">✏</button>
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

const handleAddTask = () => {
  const task = createTask(),
    taskList = document.querySelector("#todo .kanban__tasks");
  taskList?.appendChild(task.root());
};

const addTaskButtom = document.querySelector("#kanban__add-task");
addTaskButtom?.addEventListener("click", handleAddTask);

const dropZones = [...document.querySelectorAll(".kanban__tasks")];
dropZones.forEach((dropZone) => {
  dropZone.addEventListener("dragover", (event) =>
    handleDragOver(event as DragEvent)
  );
  dropZone.addEventListener("dragleave", (event) =>
    handleDragLeave(event as DragEvent)
  );
  dropZone.addEventListener("drop", (event) => handleDrop(event as DragEvent));
});
