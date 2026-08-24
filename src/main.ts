import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/WebLarekApi';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { Modal } from './components/View/Modal';
import { BasketView } from './components/View/BasketView';
import { CardBasket } from './components/View/CardBasket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';

import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { TPayment } from './types';


const events = new EventEmitter();

const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(
  document.querySelector('.header') as HTMLElement,
  events
);

const gallery = new Gallery(
  document.querySelector('.gallery') as HTMLElement
);
const modal = new Modal(
  document.querySelector('#modal-container') as HTMLElement
);

const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>('#card-preview'),
  events
);

const basketView = new BasketView(
  cloneTemplate<HTMLElement>('#basket'),
  events
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  events
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  events
);

const success = new Success(
  cloneTemplate<HTMLElement>('#success'),
  events
);

basketView.setItems([]);
basketView.setPrice(0);
basketView.setButtonDisabled(true);

header.counter = 0;

events.on('products:changed', () => {
  const cards = products.getItems().map((product) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLElement>('#card-catalog'),
      () => {
        events.emit('card:select', { id: product.id});
      }
    );

    return card.render(product);
  });

  gallery.items = cards;
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = products.getItem(id);

  if (product) {
    products.setPreview(product);
  }
});

events.on('card:action', () => {
  const product = products.getPreview();

  if (!product) {
    return;
  }

  const inBasket = basket.getItems().some((item) => item.id === product.id);

  if (inBasket) {
    basket.remove(product);
  } else {
    basket.add(product);
  }

  modal.close();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  const product = basket.getItems().find(item => item.id === id);

  if (product) {
    basket.remove(product);
  }
});

events.on('basket:changed', () => {
  const cards = basket.getItems().map((product, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLElement>('#card-basket'),
      () => {
        events.emit('basket:remove', { id: product.id });
      }
    );

   return card.render({
    ...product,
    index: index + 1,
   });
  });

  basketView.setItems(cards);
  basketView.setPrice(basket.getTotal());
  basketView.setButtonDisabled(basket.getCount() === 0);

  header.counter = basket.getCount();
});

events.on('basket:open', () => {
  modal.contentElement = basketView.render();
  modal.open();
});

events.on('basket:order', () => {
  modal.contentElement = orderForm.render();
  modal.open();
}); 

events.on('order:submit', () => {
  modal.contentElement = contactsForm.render();
  modal.open();
});

events.on('contacts:submit', () => {
  const data = buyer.getData();

  const order = {
    ...data,
    items: basket.getItems().map((item) => item.id),
    total: basket.getTotal(),
  };

  webLarekApi
    .orderProducts(order)
    .then((result) => {
      success.total = result.total;

      modal.contentElement = success.render();
      modal.open();

      basket.clear();
      buyer.clear();  
    })
    .catch((error) => {
      console.error('Ошибка при отправке заказа:', error);
    });
});

events.on<{ payment: TPayment}>('order:payment', ({ payment }) => {
  buyer.setData({
    payment,
  });
});

events.on<{ address: string }>('order:address', ({ address }) => {
  buyer.setData({
    address,
  });
});

events.on<{ email: string}>('contacts:email', ({ email }) => {
  buyer.setData({
    email,
  });
});

events.on<{ phone: string}>('contacts:phone', ({ phone }) => {
  buyer.setData({
    phone,
  });
});

events.on('preview:changed', () => {
  const product = products.getPreview();

  if (!product) {
    return;
  }

  
  const inBasket = basket.getItems().some((item) => item.id === product.id);

  if (product.price === null) {
    cardPreview.buttonText = 'Недоступно';
    cardPreview.buttonDisabled = true;
  } else if (inBasket) {
    cardPreview.buttonText = 'Удалить из корзины';
    cardPreview.buttonDisabled = false;
  } else {
    cardPreview.buttonText = 'Купить';
    cardPreview.buttonDisabled = false;
  }

  modal.contentElement = cardPreview.render(product);
  modal.open();
});

events.on('success:close', () => {
  modal.close();
});

events.on('buyer:changed', () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderForm.payment = data.payment;
  orderForm.address = data.address;

  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  orderForm.valid = !errors.payment && !errors.address;
  contactsForm.valid = !errors.email && !errors.phone;

  orderForm.errorsText = [
    errors.payment,
    errors.address,
  ]
    .filter(Boolean)
    .join(' ');

  contactsForm.errorsText = [
    errors.email,
    errors.phone,
  ]
    .filter(Boolean)
    .join(' ');
});

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);


webLarekApi
  .getProducts()
  .then((result) => {
    products.setItems(result.items);
  })
  .catch((error) => {
    console.error(error);
  });