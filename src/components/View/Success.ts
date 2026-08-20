import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Success extends Component<{ total: number }> {
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}