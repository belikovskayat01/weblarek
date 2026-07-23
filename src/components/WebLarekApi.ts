import { IApi, IOrder, IOrderResult, IProductList } from "../types";

export class WebLarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductList> {
    return this.api.get<IProductList>('/product/');
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}