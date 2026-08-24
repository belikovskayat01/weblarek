import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errors = ensureElement<HTMLElement>('.form__errors', container);

    

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errorsText(value: string) {
    this.errors.textContent = value;
  }
}