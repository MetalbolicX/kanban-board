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
    this.#dialog = this.shadowRoot!.querySelector(".confirm-dialog")!;
    this.#confirmButton = this.shadowRoot!.getElementById(
      "confirm-dialog__actions-confirm"
    ) as HTMLButtonElement;
    this.#closeButton = this.shadowRoot!.getElementById(
      "confirm-dialog__actions-cancel"
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

      .confirm-dialog {
        width: 30%;
        border: none;
        border-radius: 0.5em;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
        padding: 1rem;
        animation: fade-out 0.7s ease-out;

        &.show {
          animation: fade-in 0.7s ease-out;

          &::backdrop {
            background: rgba(0, 0, 0, 0.35);
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
          }

          slot {
            text-align: justify;
          }

          .confirm-dialog__header-title {
            font-size: 1.5em;
          }

          .confirm-dialog__header-description {
            font-size: 1em;
            padding-left: 0.5em;
            border-left: 1px solid #888;
            display: -webkit-box;
          }

          .confirm-dialog__header-icon {
            display: inline-block;
            width: 1.5em;
            height: 1.5em;
            margin-left: 1em;

            svg {
              width: 2em;
              height: 2em;
            }
          }

          .confirm-dialog__actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5em;

            button {
              font-size: 1em;
              padding: 0.5em 1em;
              border-radius: 0.25em;
              border: 1px solid transparent;

              &::focus {
                outline: none;
                border: 1px solid #888;
              }
            }
          }

          #confirm-dialog__actions-confirm {
            background-color: var(--confirm-color);
            color: white;

            &:hover {
              background-color: var(--confirm-hover-color);
            }
          }

          #confirm-dialog__actions-cancel {
            background-color: #ddd;
            color: black;

            &:hover {
              background-color: #ccc;
            }
          }
        }
      }

      @keyframes fade-in {
        0% {
          opacity 0;
          transform: scaleY(0);
          display: none;
          visibility: hidden;
        }
        100% {
          opacity 1;
          transform: scaleY(1);
          display: block;
          visibility: visible;
        }
      }

      @keyframes fade-out {
        0% {
          opacity: 1;
          transform: scaleY(1);
          display: block;
          visibility: visible;
        }
        100% {
          opacity: 0;
          transform: scaleY(0);
          display: none;
          visibility: hidden;
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
      <dialog class="confirm-dialog">
        <form method="dialog">
          <fieldset class="confirm-dialog__header">
            <legend>
              <slot name="title" class="confirm-dialog__header-title"></slot>
              <span class="confirm-dialog__header-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z"></path>
                </svg>
              </span>
            </legend>
            <slot name="description" class="confirm-dialog__header-description"></slot>
          </fieldset>
          <fieldset class="confirm-dialog__actions">
            <button type="submit" id="confirm-dialog__actions-confirm">Confirm</button>
            <button type="submit" id="confirm-dialog__actions-cancel" autofocus>Close</button>
          </fieldset>
        </form>
      </dialog>
    `;
  }

  public static get observedAttributes(): string[] {
    return ["icon", "open"];
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
    if (name === "open") !newValue ? this.hide() : this.show();
  }

  /**
   * Opens the dialog.
   */
  public show(): void {
    this.dialog.showModal();
    this.dialog.classList.add("show");
  }

  /**
   * Closes the dialog.
   */
  public hide(): void {
    this.dialog.classList.remove("show");
    setTimeout(() => this.dialog.close(), 300);
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
      success: `<svg fill="green" viewBox="0 0 24 24"><path d="M9 16.2l-4.2-4.2L3 13l6 6L21 7l-1.8-1.8L9 16.2z"/></svg>`,
      warning: `<svg fill="orange" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm11-6h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg>`,
      error: `<svg fill="red" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-11h-2v6h2v-6zm0 8h-2v2h2v-2z"/></svg>`,
    };

    const iconContainer = this.shadowRoot!.querySelector(".confirm-dialog__header-icon");
    if (iconContainer)
      iconContainer.innerHTML = type && icons[type] ? icons[type] : "";
  }

  public get icon(): string | null {
    return this.getAttribute("icon");
  }

  public set icon(value: string | null) {
    if (value) this.setAttribute("icon", value);
    else this.removeAttribute("icon");
  }

  public get open(): boolean {
    return this.hasAttribute("open");
  }

  public set open(value: boolean) {
    if (value) this.setAttribute("open", "true");
    else this.removeAttribute("open");
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
