import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<HTMLElement> {
  protected list: HTMLElement;
  protected price: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.list = container.querySelector('.basket__list') as HTMLElement;
    this.price = container.querySelector('.basket__price') as HTMLElement;
    this.button = container.querySelector('.basket__button') as HTMLButtonElement;

    this.button.addEventListener('click', () => {
      events.emit('basket:order');
    });
  }

  setItems(items: HTMLElement[]): void {
    this.list.replaceChildren(...items);
  }

  setPrice(value: number): void {
    this.price.textContent = `${value} синапсов`;
  }

  setButtonDisabled(value: boolean): void {
    this.button.disabled = value;
  }
}