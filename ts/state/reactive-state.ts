import { Listener } from "../types/state-types.ts";

import type { change } from "../types/state-types.ts";

export default class ReactiveState {
  #state: any;
  #listeners: Listener[] = [];

  constructor(initialState: any) {
    this.#state = new Proxy(initialState, {
      set: (target, property, value) => {
        target[property] = value;
        this.notify({ type: "init", payload: target });
        return true;
      },
    });
  }

  public subscribe(listener: Listener) {
    this.#listeners = [...this.#listeners, listener];
  }

  public notify(change: change) {
    for (const listener of this._listeners) listener(change);
  }

  public get state() {
    return this.#state;
  }

  protected get _listeners(): Listener[] {
    return this.#listeners;
  }
}
