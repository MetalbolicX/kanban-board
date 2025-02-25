export default class KanbanApi {
  public static getItems(columnId: number) {
    const kanbanColumns = loadKanbanData();
    const targetColumn = kanbanColumns.find((column) => column.id === columnId);
    return targetColumn ? targetColumn.items : [];
  }

  public static insertItem(columnId: number, content: string) {
    const kanbanColumns = loadKanbanData();
    const targetColumn = kanbanColumns.find((column) => column.id === columnId);

    if (!targetColumn) throw new Error("Column not found");

    const newItem = {
      id: Math.floor(Math.random() * 10000),
      content,
    };

    targetColumn.items = [...targetColumn.items, newItem];
    saveKanbanData(kanbanColumns);
    return newItem;
  }

  public static updateItem(
    itemId: number,
    updatedProperties: {
      content?: string;
      columnId?: number;
      position?: number;
    }
  ) {
    const kanbanColumns = loadKanbanData();
    let itemToUpdate, sourceColumn;

    for (const column of kanbanColumns) {
      const foundItem = column.items.find((item) => item.id === itemId);
      if (foundItem) {
        itemToUpdate = foundItem;
        sourceColumn = column;
        break;
      }
    }

    if (!itemToUpdate) throw new Error("Item not found");

    if (updatedProperties.content) {
      itemToUpdate.content = updatedProperties.content;
    }

    if (updatedProperties.columnId) {
      const targetColumn = kanbanColumns.find(
        (column) => column.id === updatedProperties.columnId
      );
      if (!targetColumn) throw new Error("Target column not found");

      // Remove from current column
      sourceColumn!.items = sourceColumn!.items.filter(
        (item) => item.id !== itemId
      );

      // Insert into target column at specified position
      const insertPosition = updatedProperties.position ?? 0;
      targetColumn.items.splice(insertPosition, 0, itemToUpdate);
    }

    saveKanbanData(kanbanColumns);
  }

  public static deleteItem(itemId: number) {
    const kanbanColumns = loadKanbanData();

    for (const column of kanbanColumns) {
      const itemIndex = column.items.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        column.items.splice(itemIndex, 1);
        saveKanbanData(kanbanColumns);
        return;
      }
    }

    throw new Error("Item not found");
  }
}

const loadKanbanData = (): {
  id: number;
  items: { id: number; content: string }[];
}[] => {
  const storedData = localStorage.getItem("kanban-data");
  return storedData
    ? JSON.parse(storedData)
    : [
        { id: 1, items: [] },
        { id: 2, items: [] },
        { id: 3, items: [] },
      ];
};

const saveKanbanData = (
  kanbanColumns: { id: number; items: { id: number; content: string }[] }[]
) => {
  localStorage.setItem("kanban-data", JSON.stringify(kanbanColumns));
};
