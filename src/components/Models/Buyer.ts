import { IBuyer, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {

  private data: IBuyer = {
    payment: null,
    address: '',
    email: '',
    phone: '',
  };

  constructor(private events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: '',
    };
    this.events.emit('buyer:changed');
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};
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