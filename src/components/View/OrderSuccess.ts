import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class OrderSuccess extends Component<HTMLElement> {
  protected description: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.description = container.querySelector('.order-success__description') as HTMLElement;
    this.button = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.button.addEventListener('click', () => {
      events.emit('order:success:close');
    });
  }

  setDescription(value: string): void {
    this.description.textContent = value;
  }
}