/**
 * A custom confirm dialog web component.
 *
 * @example
 * The following example demonstrates how to use the `ConfirmDialog` component:
 * ```html
 * <confirm-dialog id="dialog" icon="warning">
 *  <h3 slot="title">Confirm Action</h3>
 *  <p slot="description">Are you sure you want to perform this action?</p>
 * </confirm-dialog>
 * ```
 *
 * @example
 * The following example demonstrates how to use the `ConfirmDialog` component with TypeScript:
 * ```ts
 * const dialog = document.getElementById("dialog");
 * dialog.addEventListener("confirm", () => console.log("Confirmed!"));
 * dialog.show();
 * ```
 */
class ConfirmDialog extends HTMLElement {
  #dialog: HTMLDialogElement;
  #confirmButton: HTMLButtonElement;
  #closeButton: HTMLButtonElement;
  #onConfirm: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Append styles
    const style = document.createElement("style");
    style.textContent = ConfirmDialog.styles;
    style.setAttribute("type", "text/css");
    this.shadowRoot!.append(style);

    // Append template content
    const template = document.createElement("template");
    template.innerHTML = ConfirmDialog.template;
    this.shadowRoot!.append(template.content.cloneNode(true));

    // Get elements
    this.#dialog = this.shadowRoot!.querySelector("dialog")!;
    this.#confirmButton = this.shadowRoot!.getElementById(
      "confirmBtn"
    ) as HTMLButtonElement;
    this.#closeButton = this.shadowRoot!.getElementById(
      "closeBtn"
    ) as HTMLButtonElement;
  }

  /**
   * Returns the CSS styles for the component.
   */
  public static get styles(): string {
    return /*css*/ `
      :host {
        --confirm-color: #4caf50;
        --confirm-hover-color: #388e3c;
      }

      .confirm-modal {
        width: 30%;
        border: none;
        border-radius: 0.5em;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.35);
        padding: 1rem;

        &:open {
          opacity: 1 transform: translate(-50%, -50%);

          &::backdrop {
            background: rgba(0, 0, 0, 0.3);
          }
        }

        form {
          padding: 0.5rem;

          fieldset {
            border: none;
            padding: 0;
            margin: 0;
          }

          legend {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: bold;

            #icon {
              display: inline-block;
              width: 1.5em;
              height: 1.5em;
              margin-left: 1em;
            }
          }

          slot {
            text-align: justify;
          }

          slot[name="title"] {
            font-size: 1.5em;
          }

          slot[name="description"] {
            font-size: 1em;
            padding-left: 0.5em;
            border-left: 1px solid #888;
            display: -webkit-box;
          }

          .buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;

            button {
              font-size: 1em;
              padding: 0.5rem 1rem;
              border-radius: 0.25em;
              border: 1px solid transparent;

              &:focus {
                outline: none;
                border: 1px solid #888;
              }
            }

            #confirmBtn {
              background-color: var(--confirm-color);
              color: white;

              &:hover {
                background-color: var(--confirm-hover-color);
              }
            }

            #closeBtn {
              background-color: #ddd;
              color: black;

              &:hover {
                background-color: #ccc;
              }
            }
          }
        }
    `;
  }

  /**
   * Returns the HTML template for the component.
   */
  public static get template(): string {
    return /*html*/ `
      <dialog class="confirm-modal">
        <form method="dialog">
          <fieldset>
            <legend>
              <slot name="title"></slot>
              <span id="icon"></span>
            </legend>
            <slot name="description"></slot>
          </fieldset>
          <fieldset class="buttons">
            <button type="submit" id="confirmBtn">Confirm</button>
            <button type="submit" id="closeBtn" autofocus>Close</button>
          </fieldset>
        </form>
      </dialog>
    `;
  }

  public static get observedAttributes(): string[] {
    return ["icon"];
  }

  /**
   * Lifecycle method - Called when the element is added to the DOM.
   */
  public connectedCallback(): void {
    this.#closeButton.addEventListener("click", this.#handleClose);
    this.#confirmButton.addEventListener("click", this.#handleConfirm);
  }

  /**
   * Lifecycle method - Called when the element is removed from the DOM.
   * Ensures event listeners are properly removed.
   */
  public disconnectedCallback(): void {
    this.#closeButton.removeEventListener("click", this.#handleClose);
    this.#confirmButton.removeEventListener("click", this.#handleConfirm);
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    if (name === "icon") this.#updateIcon(newValue);
  }

  /**
   * Opens the dialog.
   */
  public show(): void {
    this.#dialog.showModal();
  }

  /**
   * Closes the dialog.
   */
  public hide(): void {
    this.#dialog.close();
  }

  /**
   * Handles confirmation action.
   * @param event - The click event
   * @private
   */
  #handleConfirm = (event: Event): void => {
    event.preventDefault();
    if (this.onConfirm) this.onConfirm();
    this.#handleConfirmClick();
    this.hide();
  };

  /**
   * Handles closing the dialog.
   * @private
   */
  #handleClose = (): void => {
    this.hide();
  };

  #handleConfirmClick() {
    this.dispatchEvent(
      new CustomEvent("confirm", { bubbles: true, composed: true })
    );
  }

  #updateIcon(type: string | null) {
    const icons: Record<string, string> = {
      success: `<svg fill="green" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.2l-4.2-4.2L3 13l6 6L21 7l-1.8-1.8L9 16.2z"/></svg>`,
      warning: `<svg fill="orange" width="24" height="24" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm11-6h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg>`,
      error: `<svg fill="red" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-11h-2v6h2v-6zm0 8h-2v2h2v-2z"/></svg>`,
    };

    const iconContainer = this.shadowRoot!.getElementById("icon");
    if (iconContainer)
      iconContainer.innerHTML = type && icons[type] ? icons[type] : "";
  }

  /**
   * Protected getter for the dialog element.
   */
  protected get dialog(): HTMLDialogElement {
    return this.#dialog;
  }

  /**
   * Protected getter for the confirm button element.
   */
  protected get confirmButton(): HTMLButtonElement {
    return this.#confirmButton;
  }

  /**
   * Protected getter for the close button element.
   */
  protected get closeButton(): HTMLButtonElement {
    return this.#closeButton;
  }

  /**
   * Gets the current confirm callback.
   */
  public get onConfirm(): (() => void) | null {
    return this.#onConfirm;
  }

  /**
   * Sets a custom function to be called when the confirm button is clicked.
   */
  public set onConfirm(callback: (() => void) | null) {
    this.#onConfirm = callback;
  }
}

// Define the web component only if it hasn't been defined
if (!customElements.get("confirm-dialog")) {
  customElements.define("confirm-dialog", ConfirmDialog);
}
