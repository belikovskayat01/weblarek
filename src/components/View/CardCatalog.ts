import { IProduct } from "../../types";
import { Card } from "./Card";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class CardCatalog extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  private productId: string = '';

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

    container.addEventListener('click', () => {
      events.emit('card:select', {
        id: this.productId
      });
    });
  }

  set id(value: string) {
    this.productId = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const modifier = categoryMap[value as keyof typeof categoryMap];

    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }

  set image(value: string) {
    console.log('IMAGE URL:', CDN_URL + value);
    this.setImage(
      this.imageElement,
      CDN_URL + value,
      this.titleElement.textContent ?? ''
    );
  }
}