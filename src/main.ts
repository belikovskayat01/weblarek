import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/WebLarekApi';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

const products = new Products();

products.setItems(apiProducts.items);

console.log('Все товары:', products.getItems());

console.log(
  'Товар по id:',
  products.getItem('854cef69-976d-4c2a-a18c-2aa45046c390')
);

products.setPreview(apiProducts.items[0]);

console.log('Выбранный товар:', products.getPreview());

const basket = new Basket();

basket.add(apiProducts.items[0]);
basket.add(apiProducts.items[1]);

console.log('Товары в корзине:', basket.getItems());

console.log('Количество товаров:', basket.getCount());

console.log('Общая стоимость:', basket.getTotal());

console.log(
  'Есть ли первый товар:',
  basket.hasProduct(apiProducts.items[0].id)
);

basket.remove(apiProducts.items[0]);

console.log('После удаления:', basket.getItems());

basket.clear();

console.log('После очистки:', basket.getItems());

const buyer = new Buyer();

console.log('Пустые данные:', buyer.getData());

console.log('Ошибки валидации:', buyer.validate());

buyer.setData({
  payment: 'card',
  address: 'Москва',
});

console.log('После заполнения части данных:', buyer.getData());

console.log(
  'Ошибки после частичного заполнения:',
  buyer.validate()
);

buyer.setData({
  email: 'test@test.ru',
  phone: '+79991234567',
});

console.log('Все данные:', buyer.getData());

console.log(
  'Ошибки после полного заполнения:',
  buyer.validate()
);

buyer.clear();

console.log('После очистки:', buyer.getData());


const api = new Api(API_URL);

const webLarekApi = new WebLarekApi(api);

const productsModel = new Products();

webLarekApi
  .getProducts()
  .then((result) => {
    productsModel.setItems(result.items);

    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch((error) => {
    console.error(error);
  });