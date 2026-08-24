import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class BasketView extends Component<HTMLElement> {
  protected list: HTMLElement;
  protected price: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.price = ensureElement<HTMLElement>('.basket__price', container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', container);

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