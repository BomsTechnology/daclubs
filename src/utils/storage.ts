import { CheckoutCompletedEvent } from '@shopify/checkout-sheet-kit';
import { atom } from 'jotai';

import { atomWithMMKV } from './atomWithMMKV';
import CheckoutProps from '../types/CheckoutProps';
import { CustomerAccessTokenProps, CustomerProps } from '../types/CustomerProps';
import NotificationProps from '../types/NotificationProps';
import { ProductCartProps, MainProductProps } from '../types/ProductProps';
import SettingProps from '../types/SettingProps';

export const settingWithStorage = atomWithMMKV<SettingProps>('setting', {
  locale: 'fr',
  theme: 'light',
  alreadyOpen: false,
});

export const cartWithStorage = atomWithMMKV<ProductCartProps[]>('cart', []);

export const orderWithStorage = atomWithMMKV<CheckoutCompletedEvent.OrderDetails[]>('order', []);

export const wishlistWithStorage = atomWithMMKV<MainProductProps[]>('wishlist', []);
export const notificationWithStorage = atomWithMMKV<NotificationProps[]>('notification', [
  {
    title: 'Bienvenue sur DaClubs 🎉 ',
    message:
      'Nous sommes ravis de vous accueillir sur DaClubs, votre application dédiée à la vente de sneakers de haute qualité. Découvrez notre vaste collection de modèles tendance et exclusifs, et trouvez la paire parfaite pour compléter votre style. Profitez d’une expérience de shopping unique et simplifiée, avec des offres spéciales et des nouveautés chaque semaine. Bon shopping!',
    read: false,
  },
]);

export const customerAtom = atom<{
  customer?: CustomerProps;
}>({});

export const tokenWithStorage = atomWithMMKV<{
  token?: CustomerAccessTokenProps;
}>('token', {});

export const openNotificationAtom = atom<boolean>(false);

export const checkoutWithStorage = atomWithMMKV<CheckoutProps | undefined>('checkout', undefined);
