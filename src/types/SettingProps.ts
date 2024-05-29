import { ThemeName } from 'tamagui';

export default interface SettingProps {
  locale: string;
  theme: ThemeName;
  alreadyOpen: boolean;
}
