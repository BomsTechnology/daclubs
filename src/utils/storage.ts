import { atom } from 'jotai';

import { atomWithMMKV } from './atomWithMMKV';
import { CustomerAccessTokenProps, CustomerProps } from '../types/CustomerProps';
import { ProductCartProps, MainProductProps } from '../types/ProductProps';
import SettingProps from '../types/SettingProps';

export const settingWithStorage = atomWithMMKV<SettingProps>('setting', {
  locale: 'fr',
  theme: 'light',
});

export const cartWithStorage = atomWithMMKV<ProductCartProps[]>('cart', []);

export const wishlistWithStorage = atomWithMMKV<MainProductProps[]>('wishlist', []);

export const customerAtom = atom<{
  customer?: CustomerProps;
}>({});

export const tokenWithStorage = atomWithMMKV<{
  token?: CustomerAccessTokenProps;
}>('token', {});
