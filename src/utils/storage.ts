import { atomWithMMKV } from './atomWithMMKV';
import SettingProps from '../types/SettingProps';

export const settingWithStorage = atomWithMMKV<SettingProps>('setting', {
  locale: 'fr',
  theme: 'light',
});
