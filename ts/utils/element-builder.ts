import createElement from "./create-element.ts";

/**
 * A utility class for constructing and manipulating DOM elements with a syntax similar to D3.js.
 */
export default class ElementBuilder {
  #root: HTMLElement;
  #nodes: HTMLElement[];
  #eventListeners = new WeakMap<HTMLElement, Map<string, EventListener[]>>();

  constructor(htmlTemplate: string) {
    this.#root = createElement(htmlTemplate);
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

  public attr(attribute: string, value: string): this {
    this.nodes.forEach((node) => node.setAttribute(attribute, value));
    return this;
  }

  public text(value: string): this {
    this.nodes.forEach((node) => (node.textContent = value));
    return this;
  }

  /**
   * Appends the current nodes to a specified parent element or another ElementBuilder instance.
   * @param parent - The parent element or ElementBuilder instance to which the nodes will be appended.
   * @returns The current instance of ElementBuilder for method chaining.
   */
  public append(parent: HTMLElement | ElementBuilder): this {
    this.nodes.forEach((node) => {
      if (parent instanceof ElementBuilder) {
        parent.nodes.forEach((pNode) => pNode.appendChild(node));
      } else {
        parent.appendChild(node);
      }
    });
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

  public style(property: string, value: string): this {
    this.nodes.forEach((node) => node.style.setProperty(property, value));
    return this;
  }

  public property(property: string, value: any): this {
    this.nodes.forEach((node) => ((node as any)[property] = value));
    return this;
  }

  public html(htmlTemplate: string): this {
    this.nodes.forEach((node) => node.appendChild(createElement(htmlTemplate)));
    return this;
  }

  public on(
    event: string,
    callback: EventListener,
    options?: boolean | AddEventListenerOptions
  ): this {
    this.nodes.forEach((node) => {
      node.addEventListener(event, callback, options);
      if (!this.eventListeners.has(node)) {
        this.eventListeners.set(node, new Map());
      }
      const eventMap = this.eventListeners.get(node)!;
      eventMap.set(event, [...(eventMap.get(event) || []), callback]);
    });
    return this;
  }

  public off(event: string): this {
    this.nodes.forEach((node) => {
      const eventMap = this.eventListeners.get(node);
      if (eventMap && eventMap.has(event)) {
        eventMap
          .get(event)!
          .forEach((callback) => node.removeEventListener(event, callback));
        eventMap.delete(event);
      }
    });
    return this;
  }

  public classed(className: string, value: boolean): this {
    this.nodes.forEach((node) => node.classList.toggle(className, value));
    return this;
  }

  public each(callback: (node: HTMLElement, index: number) => void): this {
    this.nodes.forEach(callback);
    return this;
  }

  public call(callback: (builder: ElementBuilder) => void): this {
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

  public clone(): ElementBuilder {
    return new ElementBuilder(this.#root.outerHTML);
  }

  public getRootNode(): HTMLElement {
    return this.root;
  }

  public getNode() {
    const [node] = this.nodes;
    return node;
  }

  public getNodes() {
    return [...this.nodes];
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
