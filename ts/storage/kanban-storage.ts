import type { Kanban } from "../types/kanban-types.ts";
import type { Storage } from "../interfaces/kanban-interfaces.ts";

/**
 * @classdesc
 * The KanbanStorage class is responsible for managing the storage of the Kanban board data.
 * It provides methods to load and save the Kanban board data.
 */
export default class KanbanStorage {
  #storage: Storage;

  /**
   * Creates the KanbanStorage that handles the loading and saving of the Kanban board data.
   * @param {Storage} storage - The storage mechanism to be used.
   */
  constructor(storage: Storage) {
    this.#storage = storage;
  }

  /**
   * Loads the Kanban board data from storage.
   * This method retrieves the Kanban board data from the underlying storage
   * mechanism and returns it as a Kanban object.
   * @returns {Kanban} The loaded Kanban board data.
   */
  public loadKanban(): Kanban {
    return this.#storage.loadKanban();
  }

  /**
   * Saves the Kanban board data to storage.
   * This method persists the provided Kanban board data using the underlying storage mechanism.
   * @param kanban - The Kanban board data to be saved.
   * @returns {void} This method does not return a value.
   */
  public saveKanban(kanban: Kanban): void {
    this.#storage.saveKanban(kanban);
  }


  public set storage(storage: Storage) {
    this.#storage = storage;
  }
}
