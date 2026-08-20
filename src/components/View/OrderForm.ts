import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class OrderForm extends Form<Record<string, unknown>> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach((item) => {
          item.classList.remove('button_alt-active');
        });

        button.classList.add('button_alt-active');
        events.emit('order:payment', {
          payment: button.name,
        });
      });
    });
    
    this.addressInput.addEventListener('input', () => {
      events.emit('order:address', {
        address: this.addressInput.value,
      });
    });
  }
} 