import { IBuyer } from "../../types";

export class Buyer {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.data.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.data.email) {
      errors.email = "Укажите email";
    }

    if (!this.data.phone) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}