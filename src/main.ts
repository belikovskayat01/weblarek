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

import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';


const events = new EventEmitter();

const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const gallery = document.querySelector('.gallery') as HTMLElement;
const modal = new Modal(
  document.querySelector('#modal-container') as HTMLElement,
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

events.on('products:changed', () => {
  const cards = products.getItems().map((product) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLElement>('#card-catalog'),
      events
    );

    return card.render(product);
  });

  gallery.replaceChildren(...cards);
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = products.getItem(id);

  if (product) {
    products.setPreview(product);
  }
});

events.on('card:action', () => {
  const product = products.getPreview();

  if(!product) {
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
      events
    );

    card.render(product);
    card.index = index + 1;

    return card.render();
  });

  basketView.setItems(cards);
  basketView.setPrice(basket.getTotal());
  basketView.setButtonDisabled(basket.getCount() === 0);

  basketCounter.textContent = String(basket.getCount());
});

events.on('basket:order', () => {
  modal.contentElement = orderForm.render();
  modal.open();
}); 

events.on('form:submit', () => {
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

events.on<{ payment: string}>('order:payment', ({ payment }) => {
  buyer.setData({
    payment: payment as 'card' | 'cash',
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

  const card = new CardPreview(
    cloneTemplate<HTMLElement>('#card-preview'),
    events
  );
  
  const inBasket = basket.getItems().some((item) => item.id === product.id);

  if (product.price === null) {
    card.buttonText = 'Недоступно';
    card.buttonDisabled = true;
  } else if (inBasket) {
    card.buttonText = 'Удалить из корзины';
    card.buttonDisabled = false;
  } else {
    card.buttonText = 'Купить';
    card.buttonDisabled = false;
  }

  modal.contentElement = card.render(product);
  modal.open();
});

events.on('modal:close', () => {
  modal.close();
});

events.on('success:close', () => {
  modal.close();
});

const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

basketButton.addEventListener( 'click', () => {
  events.emit('basket:open');
});

events.on('basket:open', () => {
  const cards = basket.getItems().map((product, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLElement>('#card-basket'),
      events  
    );
    
    card.render(product);
    card.index = index + 1;

    return card.render();
  });

  basketView.setItems(cards);
  basketView.setPrice(basket.getTotal());
  basketView.setButtonDisabled(basket.getCount() === 0);

  modal.contentElement = basketView.render();
  modal.open();
});

events.on('buyer:changed', () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  const valid = Object.keys(errors).length === 0;

  orderForm.valid = Boolean(data.payment && data.address);
  contactsForm.valid = valid;

  if (!data.payment) {
    orderForm.errorsText = 'Выберите способ оплаты';
  } else if (!data.address) {
    orderForm.errorsText = 'Укажите адрес';
  } else {
    orderForm.errorsText = '';
  }
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