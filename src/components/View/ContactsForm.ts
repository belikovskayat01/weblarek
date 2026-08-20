import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class ContactsForm extends Form<Record<string, unknown>> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this.emailInput.addEventListener('input', () => {
      events.emit('contacts:email', {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      events.emit('contacts:phone', {
        phone: this.phoneInput.value,
      });
    });

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('contacts:submit');
    });
  }
}