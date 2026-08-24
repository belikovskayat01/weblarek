import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";

export class OrderForm extends Form<Record<string, unknown>> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('.button_alt'));
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
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

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', 
        button.name === value
      );
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
} 