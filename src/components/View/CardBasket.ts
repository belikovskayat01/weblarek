import { IProduct } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

interface ICardBasket extends IProduct {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    
    this.buttonElement.addEventListener('click', onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}