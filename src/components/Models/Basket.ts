import { IProduct } from "../../types";

export class Basket {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    this.items.push(product);
  }

  remove(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }

  clear(): void {
    this.items = [];
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  hasProduct(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}