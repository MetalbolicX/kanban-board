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

  /**
   * Creates an instance of Elym.
   * @param {string} htmlTemplate - The HTML template to create the root element.
   */
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
   * @param {string} selector - The CSS selector to match the element.
   * @returns {this} The current instance for chaining.
   */
  public select(selector: string): this {
    const selectedElement = this.root.querySelector(selector);
    if (selectedElement) {
      this.#nodes = [selectedElement as HTMLElement];
    }
    return this;
  }

  /**
   * Selects multiple elements within the constructed DOM structure.
   * @param {string} selector - The CSS selector to match the elements.
   * @returns {this} The current instance for chaining.
   */
  public selectAll(selector: string): this {
    this.#nodes = Array.from(
      this.root.querySelectorAll(selector)
    ) as HTMLElement[];
    return this;
  }

  /**
   * Gets or sets an attribute on the selected elements.
   * @param {string} attribute - The attribute name.
   * @param {string} [value] - The attribute value.
   * @returns {this | string | null} The current instance for chaining or the attribute value.
   */
  public attr(attribute: string): string | null;
  public attr(attribute: string, value: string): this;
  public attr(attribute: string, value?: string): this | string | null {
    if (value === undefined) {
      return this.nodes.length ? this.nodes[0].getAttribute(attribute) : null;
    }
    this.nodes.forEach((node) => node.setAttribute(attribute, value));
    return this;
  }

  /**
   * Gets or sets the text content of the selected elements.
   * @param {string} [value] - The text content.
   * @returns {this | string} The current instance for chaining or the text content.
   */
  public text(): string;
  public text(value: string): this;
  public text(value?: string): string | this {
    if (value === undefined) {
      return this.nodes[0]?.textContent || "";
    }
    this.nodes.forEach((node) => (node.textContent = value));
    return this;
  }

  /**
   * Appends a child element to the selected elements.
   * @param {HTMLElement} child - The child element to append.
   * @returns {this} The current instance for chaining.
   */
  public appendChild(child: HTMLElement): this {
    this.nodes.forEach((node) => node.appendChild(child));
    return this;
  }

  /**
   * Appends multiple child elements to the selected elements.
   * @param {...HTMLElement[]} children - The child elements to append.
   * @returns {this} The current instance for chaining.
   */
  public appendChildren(...children: HTMLElement[]): this {
    const fragment = document.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    this.nodes.forEach((node) => node.appendChild(fragment.cloneNode(true)));
    return this;
  }

  /**
   * Gets or sets a CSS style property on the selected elements.
   * @param {string} property - The CSS property name.
   * @param {string} [value] - The CSS property value.
   * @returns {this | string | null} The current instance for chaining or the CSS property value.
   */
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
      return this;
    }
    this.nodes.forEach((node) => {
      Object.entries(property).forEach(([key, val]) =>
        node.style.setProperty(key, val)
      );
    });
    return this;
  }

  /**
   * Gets or sets a property on the selected elements.
   * @param {string} property - The property name.
   * @param {T} [value] - The property value.
   * @returns {this | T} The current instance for chaining or the property value.
   */
  public property<T = any>(property: string): T;
  public property<T = any>(property: string, value: T): this;
  public property<T = any>(property: string, value?: T): this | T {
    if (value === undefined) {
      return this.nodes.length ? (this.nodes[0] as any)[property] : undefined;
    }
    this.nodes.forEach((node) => ((node as any)[property] = value));
    return this;
  }

  /**
   * Gets or sets the HTML content of the selected elements.
   * @param {string | Node} [content] - The HTML content.
   * @returns {this | string} The current instance for chaining or the HTML content.
   */
  public html(content?: string | Node): string | this {
    if (content === undefined) {
      return this.nodes.map((node) => node.innerHTML).join("");
    }

    this.nodes.forEach((node) => {
      if (typeof content === "string") {
        const fragment = document
          .createRange()
          .createContextualFragment(content);
        node.replaceChildren(fragment);
        return;
      }
      node.replaceChildren(content);
    });

    return this;
  }

  /**
   * Adds an event listener to the selected elements.
   * @param {string} event - The event type.
   * @param {EventListener} callback - The event listener callback.
   * @param {boolean | AddEventListenerOptions} [options] - The event listener options.
   * @returns {this} The current instance for chaining.
   */
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

  /**
   * Removes an event listener from the selected elements.
   * @param {string} event - The event type.
   * @returns {this} The current instance for chaining.
   */
  public off(event: string): this {
    const [eventType, namespace] = event.split(".");
    this.nodes.forEach((node) => {
      const eventMap = this.eventListeners.get(node);
      if (!eventMap) return;

      if (namespace) {
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
        return;
      }
      eventMap
        .get(eventType)
        ?.forEach((callback) => node.removeEventListener(eventType, callback));
      eventMap.delete(eventType);
    });
    return this;
  }

  /**
   * Prepends the selected elements to a parent element.
   * @param {HTMLElement | Elym} parent - The parent element.
   * @returns {this} The current instance for chaining.
   */
  public prepend(parent: HTMLElement | Elym): this {
    this.nodes.forEach((node) => {
      if (parent instanceof Elym) {
        parent.nodes.forEach((parentNode) => parentNode.prepend(node));
        return;
      }
      parent.prepend(node);
    });
    return this;
  }

  /**
   * Adds one or more class names to the selected elements.
   * @param {...string[]} classNames - The class names to add.
   * @returns {this} The current instance for chaining.
   */
  public addClass(...classNames: string[]): this {
    this.nodes.forEach((node) => node.classList.add(...classNames));
    return this;
  }

  /**
   * Removes one or more class names from the selected elements.
   * @param {...string[]} classNames - The class names to remove.
   * @returns {this} The current instance for chaining.
   */
  public removeClass(...classNames: string[]): this {
    this.nodes.forEach((node) => node.classList.remove(...classNames));
    return this;
  }

  /**
   * Inserts the selected elements before a reference element.
   * @param {HTMLElement} referenceElement - The reference element.
   * @returns {this} The current instance for chaining.
   */
  public insertBefore(referenceElement: HTMLElement): this {
    this.nodes.forEach((node) =>
      referenceElement.parentNode?.insertBefore(node, referenceElement)
    );
    return this;
  }

  /**
   * Inserts the selected elements after a reference element.
   * @param {HTMLElement} referenceElement - The reference element.
   * @returns {this} The current instance for chaining.
   */
  public insertAfter(referenceElement: HTMLElement): this {
    this.nodes.forEach((node) =>
      referenceElement.parentNode?.insertBefore(
        node,
        referenceElement.nextSibling
      )
    );
    return this;
  }

  /**
   * Appends the selected elements to a parent element.
   * @param {HTMLElement | Elym} parent - The parent element.
   * @returns {this} The current instance for chaining.
   */
  public appendTo(parent: HTMLElement | Elym): this {
    this.nodes.forEach((node) => {
      if (parent instanceof Elym) {
        parent.nodes.forEach((parentNode) => parentNode.appendChild(node));
        return;
      }
      parent.appendChild(node);
    });
    return this;
  }

  /**
   * Checks if the selected elements have a class or toggles a class based on a boolean value.
   * @param {string} className - The class name.
   * @param {boolean} [value] - The boolean value to toggle the class.
   * @returns {this | boolean} The current instance for chaining or the class presence.
   */
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

  /**
   * Iterates over the selected elements and executes a callback for each element.
   * @param {function} callback - The callback function.
   * @returns {this} The current instance for chaining.
   */
  public each(
    callback: (node: HTMLElement | SVGElement, index: number) => void
  ): this {
    this.nodes.forEach((node, index) =>
      callback(node as HTMLElement | SVGElement, index)
    );
    return this;
  }

  /**
   * Calls a callback function with the current instance.
   * @param {function} callback - The callback function.
   * @returns {this} The current instance for chaining.
   */
  public call(callback: (builder: Elym) => void): this {
    callback(this);
    return this;
  }

  /**
   * Removes the selected elements from the DOM.
   * @returns {this} The current instance for chaining.
   */
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

  /**
   * Clones the current instance, including event listeners and data.
   * @returns {Elym} The cloned instance.
   */
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
   * @param {string} attributeOrClass - The attribute or class name.
   * @param {boolean} state - The boolean state.
   * @returns {this} The current instance for chaining.
   */
  public toggle(attributeOrClass: string, state: boolean): this {
    this.nodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.hasAttribute(attributeOrClass)) {
          if (state) {
            node.setAttribute(attributeOrClass, "");
            return;
          }
          node.removeAttribute(attributeOrClass);
          return;
        }
        node.classList.toggle(attributeOrClass, state);
      }
    });
    return this;
  }

  /**
   * Applies a CSS transition effect to the selected elements.
   * @param {number} duration - Transition duration in milliseconds.
   * @param {Partial<CSSStyleDeclaration>} properties - CSS properties to animate.
   * @param {string} [easing="ease"] - Easing function, default is "ease".
   * @returns {this} The current instance for chaining.
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

  /**
   * Binds data to the selected elements and optionally executes a callback.
   * @param {T[]} dataset - The data to bind.
   * @param {function} [callback] - The callback function.
   * @returns {this} The current instance for chaining.
   */
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

  /**
   * Resets the selected elements to the root element.
   * @returns {this} The current instance for chaining.
   */
  public backToRoot(): this {
    this.#nodes = [this.root];
    return this;
  }

  /**
   * Gets the root element.
   * @returns {HTMLElement | SVGSVGElement} The root element.
   */
  public getRootNode() {
    return this.root;
  }

  /**
   * Gets the first selected element.
   * @returns {HTMLElement | SVGElement} The first selected element.
   */
  public getNode() {
    const [node] = this.nodes;
    return node;
  }

  /**
   * Gets all selected elements.
   * @returns {Array<HTMLElement | SVGElement>} The selected elements.
   */
  public getNodes() {
    return [...this.nodes];
  }

  /**
   * Gets the data bound to a specific element.
   * @param {HTMLElement | SVGElement} node - The element.
   * @returns {any} The data bound to the element.
   */
  public getData(node: HTMLElement | SVGElement) {
    return this.#data.get(node);
  }

  /**
   * Gets the root element.
   * @protected
   * @returns {HTMLElement | SVGSVGElement} The root element.
   */
  protected get root() {
    return this.#root;
  }

  /**
   * Gets the selected elements.
   * @protected
   * @returns {Array<HTMLElement | SVGElement>} The selected elements.
   */
  protected get nodes() {
    return this.#nodes;
  }

  /**
   * Gets the event listeners map.
   * @protected
   * @returns {WeakMap<HTMLElement | SVGElement, Map<string, EventListener[]>>} The event listeners map.
   */
  protected get eventListeners() {
    return this.#eventListeners;
  }
}
