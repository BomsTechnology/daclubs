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

export const notificationWithStorage = atomWithMMKV<NotificationProps[]>('notification', []);

export const wishlistWithStorage = atomWithMMKV<MainProductProps[]>('wishlist', []);

export const customerAtom = atom<{
  customer?: CustomerProps;
}>({});

export const tokenWithStorage = atomWithMMKV<{
  token?: CustomerAccessTokenProps;
}>('token', {});

export const checkoutWithStorage = atomWithMMKV<CheckoutProps | undefined>('checkout', undefined);
