import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<HTMLElement> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.content = ensureElement<HTMLElement>('.modal__content', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }

  set contentElement(value: HTMLElement) {
    this.content.replaceChildren(value);
  }
}