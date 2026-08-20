import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errors = container.querySelector('.form__errors') as HTMLElement;

    container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;

      events.emit('form:input', {
        field: target.name,
        value: target.value,
      });
    });

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('form:submit');
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errorsText(value: string) {
    this.errors.textContent = value;
  }
}