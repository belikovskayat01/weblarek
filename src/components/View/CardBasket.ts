import { IProduct } from "../../types";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export class CardBasket extends Card<IProduct> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  private productId: string = '';

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.buttonElement = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {
      events.emit('basket:remove', {
        id: this.productId
      });
    });
  }

  set id(value: string) {
    this.productId = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}