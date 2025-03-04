import { Observer } from "./kanban-interfaces.ts";

export default abstract class KanbanSubject {
  protected observers: Observer[] = [];

  /**
   * Adds an observer to the list of observers.
   * @param observer - The observer to be added to the list of observers.
   */
  public addObserver(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers = [...this.observers, observer];
    }
  }

  /**
   * Removes an observer from the list of observers.
   * @param observer - The observer to be removed from the list of observers.
   */
  public removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notifies all observers with the given event type and data.
   * @param eventType - The type of the event to be sent to the observers.
   * @param data - The data to be sent to the observers.
   */
  protected notifyObservers(eventType: string, data: any): void {
    for (const observer of this.observers) observer.update(eventType, data);
  }
}
