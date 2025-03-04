import createElement from "./create-element.ts";

/**
 * @classdesc
 * A utility class for building and manipulating DOM elements.
 * It was inspired by the D3.js library and jQuery syntax.
 */
export default class Elym {
  #root: HTMLElement | SVGSVGElement;
  #nodes: (HTMLElement | SVGElement)[];
  #eventListeners = new WeakMap<
    HTMLElement | SVGElement,
    Map<string, EventListener[]>
  >();
  #data = new WeakMap<HTMLElement | SVGElement, any>();

  constructor(htmlTemplate: string) {
    const rootElement = createElement(htmlTemplate);
    if (
      !(
        rootElement instanceof HTMLElement ||
        rootElement instanceof SVGSVGElement
      )
    ) {
      throw new Error("Invalid root element created");
    }
    this.#root = rootElement;

    this.#nodes = [this.root];
  }

  /**
   * Selects a single element within the constructed DOM structure.
   */
  public select(selector: string): this {
    const selected = this.root.querySelector(selector);
    if (selected) {
      this.#nodes = [selected as HTMLElement];
    }
    return this;
  }

  /**
   * Selects multiple elements within the constructed DOM structure.
   */
  public selectAll(selector: string): this {
    this.#nodes = Array.from(
      this.root.querySelectorAll(selector)
    ) as HTMLElement[];
    return this;
  }

  public attr(attribute: string): string | null;
  public attr(attribute: string, value: string): this;
  public attr(attribute: string, value?: string): this | string | null {
    if (value === undefined) {
      return this.nodes.length ? this.nodes[0].getAttribute(attribute) : null;
    }
    this.nodes.forEach((node) => node.setAttribute(attribute, value));
    return this;
  }

  public text(): string;
  public text(value: string): this;
  public text(value?: string): string | this {
    if (value === undefined) {
      return this.nodes[0]?.textContent || "";
    }
    this.nodes.forEach((node) => (node.textContent = value));
    return this;
  }

  public appendChild(child: HTMLElement): this {
    this.nodes.forEach((node) => node.appendChild(child));
    return this;
  }

  public appendChildren(...children: HTMLElement[]): this {
    this.nodes.forEach((node) =>
      children.forEach((child) => node.appendChild(child))
    );
    return this;
  }

  public style(property: string): string | null;
  public style(property: string, value: string): this;
  public style(
    property: string | Record<string, string>,
    value?: string
  ): this | string | null {
    if (typeof property === "string") {
      if (value === undefined) {
        return this.nodes.length
          ? this.nodes[0].style.getPropertyValue(property)
          : null;
      }
      this.nodes.forEach((node) => node.style.setProperty(property, value!));
    } else {
      this.nodes.forEach((node) => {
        Object.entries(property).forEach(([key, val]) =>
          node.style.setProperty(key, val)
        );
      });
    }
    return this;
  }

  public property<T = any>(property: string): T;
  public property<T = any>(property: string, value: T): this;
  public property<T = any>(property: string, value?: T): this | T {
    if (value === undefined) {
      return this.nodes.length ? (this.nodes[0] as any)[property] : undefined;
    }
    this.nodes.forEach((node) => ((node as any)[property] = value));
    return this;
  }

  html(content?: string | Node): string | this {
    // If no content is provided, return an array of innerHTML from all nodes
    if (content === undefined) {
      return this.nodes.map((node) => node.innerHTML).join("");
    }

    this.nodes.forEach((node) => {
      if (typeof content === "string") {
        const fragment = document
          .createRange()
          .createContextualFragment(content);
        node.replaceChildren(fragment);
      } else {
        node.replaceChildren(content);
      }
    });

    return this;
  }

  public on(
    event: string,
    callback: EventListener,
    options?: boolean | AddEventListenerOptions
  ): this {
    const [eventType, namespace] = event.split(".");
    this.nodes.forEach((node) => {
      node.addEventListener(eventType, callback, options);
      if (!this.eventListeners.has(node)) {
        this.eventListeners.set(node, new Map());
      }
      const eventMap = this.eventListeners.get(node)!;
      const eventKey = namespace ? `${eventType}.${namespace}` : eventType;
      eventMap.set(eventKey, [...(eventMap.get(eventKey) || []), callback]);
    });
    return this;
  }

  public off(event: string): this {
    const [eventType, namespace] = event.split(".");
    this.nodes.forEach((node) => {
      const eventMap = this.eventListeners.get(node);
      if (!eventMap) return;

      if (namespace) {
        // Remove only namespaced events
        for (const key of eventMap.keys()) {
          if (
            key.startsWith(eventType + ".") &&
            key.endsWith("." + namespace)
          ) {
            eventMap
              .get(key)!
              .forEach((callback) =>
                node.removeEventListener(eventType, callback)
              );
            eventMap.delete(key);
          }
        }
      } else {
        // Remove all events of the specified type
        eventMap
          .get(eventType)
          ?.forEach((callback) =>
            node.removeEventListener(eventType, callback)
          );
        eventMap.delete(eventType);
      }
    });
    return this;
  }

  public prepend(parent: HTMLElement | Elym): this {
    this.nodes.forEach((node) => {
      if (parent instanceof Elym) {
        parent.nodes.forEach((pNode) => pNode.prepend(node));
      } else {
        parent.prepend(node);
      }
    });
    return this;
  }

  public addClass(...className: string[]): this {
    this.nodes.forEach((node) => node.classList.add(...className));
    return this;
  }

  public removeClass(...className: string[]): this {
    this.nodes.forEach((node) => node.classList.remove(...className));
    return this;
  }

  public insertBefore(reference: HTMLElement): this {
    this.nodes.forEach((node) =>
      reference.parentNode?.insertBefore(node, reference)
    );
    return this;
  }

  public insertAfter(reference: HTMLElement): this {
    this.nodes.forEach((node) =>
      reference.parentNode?.insertBefore(node, reference.nextSibling)
    );
    return this;
  }

  public appendTo(parent: HTMLElement | Elym): this {
    this.nodes.forEach((node) => {
      if (parent instanceof Elym) {
        parent.nodes.forEach((pNode) => pNode.appendChild(node));
      } else {
        parent.appendChild(node);
      }
    });
    return this;
  }

  public classed(className: string): boolean;
  public classed(className: string, value: boolean): this;
  public classed(className: string, value?: boolean): this | boolean {
    if (value === undefined) {
      return this.nodes.length
        ? this.nodes[0].classList.contains(className)
        : false;
    }
    this.nodes.forEach((node) => node.classList.toggle(className, value));
    return this;
  }

  public each(
    callback: (node: HTMLElement | SVGElement, index: number) => void
  ): this {
    this.nodes.forEach((node, index) =>
      callback(node as HTMLElement | SVGElement, index)
    );
    return this;
  }

  public call(callback: (builder: Elym) => void): this {
    callback(this);
    return this;
  }

  public remove(): this {
    this.nodes.forEach((node) => {
      const eventMap = this.eventListeners.get(node);
      if (eventMap) {
        eventMap.forEach((callbacks, event) => {
          callbacks.forEach((callback) =>
            node.removeEventListener(event, callback)
          );
        });
        this.eventListeners.delete(node);
      }
      node.remove();
    });
    return this;
  }

  public clone(): Elym {
    const clone = new Elym(this.root.outerHTML);
    this.nodes.forEach((node, index) => {
      const clonedNode = clone.nodes[index];

      // Clone event listeners
      const eventMap = this.eventListeners.get(node);
      if (eventMap) {
        const clonedEventMap = new Map<string, EventListener[]>();
        eventMap.forEach((callbacks, event) => {
          callbacks.forEach((callback) =>
            clonedNode.addEventListener(event, callback)
          );
          clonedEventMap.set(event, [...callbacks]);
        });
        clone.eventListeners.set(clonedNode, clonedEventMap);
      }

      // Clone data
      const data = this.#data.get(node);
      if (data !== undefined) {
        clone.#data.set(clonedNode, data);
      }
    });

    return clone;
  }

  /**
   * Toggles a class or attribute based on a boolean condition.
   */
  public toggle(attributeOrClass: string, state: boolean): this {
    this.nodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.hasAttribute(attributeOrClass)) {
          state
            ? node.setAttribute(attributeOrClass, "")
            : node.removeAttribute(attributeOrClass);
        } else {
          node.classList.toggle(attributeOrClass, state);
        }
      }
    });
    return this;
  }

  /**
   * Applies a CSS transition effect to the selected elements.
   * @param duration - Transition duration in milliseconds.
   * @param properties - CSS properties to animate.
   * @param easing - (Optional) Easing function, default is "ease".
   * @example
   * ```ts
   * const builder = new Elym('<div style="width:100px; height:100px; background:red;"></div>');
   * // Transition width and background color
   * builder.transition(500, { width: "200px", backgroundColor: "blue" });
   * // Transition opacity and transform with an ease-out effect
   * builder.transition(300, { opacity: "0.5", transform: "scale(1.2)" }, "ease-out");
   * ```
   */
  public transition(
    duration: number,
    properties: Partial<CSSStyleDeclaration>,
    easing: string = "ease"
  ): this {
    this.nodes.forEach((node) => {
      node.style.transition = `all ${duration}ms ${easing}`;

      Object.entries(properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          node.style.setProperty(key, String(value));
        }
      });
    });
    return this;
  }

  public data<T>(
    dataset: T[],
    callback?: (node: HTMLElement | SVGElement, datum: T, index: number) => void
  ): this {
    this.nodes.forEach((node, index) => {
      if (index < dataset.length) {
        this.#data.set(node, dataset[index]);
        callback?.(node, dataset[index], index);
      }
    });
    return this;
  }

  public backToRoot(): this {
    this.#nodes = [this.root];
    return this;
  }

  public getRootNode() {
    return this.root;
  }

  public getNode() {
    const [node] = this.nodes;
    return node;
  }

  public getNodes() {
    return [...this.nodes];
  }

  public getData(node: HTMLElement | SVGElement) {
    return this.#data.get(node);
  }

  protected get root() {
    return this.#root;
  }

  protected get nodes() {
    return this.#nodes;
  }

  protected get eventListeners() {
    return this.#eventListeners;
  }
}
