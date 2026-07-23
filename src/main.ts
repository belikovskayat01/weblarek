import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);

const webLarekApi = new WebLarekApi(api);

const products = new Products();

webLarekApi
  .getProducts()
  .then((result) => {
    products.setItems(result.items);

    console.log('Каталог с сервера:', products.getItems());
  })
  .catch((error) => {
    console.error(error);
  });