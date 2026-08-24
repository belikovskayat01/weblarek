import { IProduct } from "../../types";
import { Card } from "./Card";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

    this.buttonElement.addEventListener('click', () => {
      events.emit('card:action');
    });
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
    this.setImage(
      this.imageElement,
      CDN_URL + value,
      this.titleElement.textContent ?? ''
    );
  }

  set description (value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }
}