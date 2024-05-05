import { I18n } from 'i18n-js';

import en from './en.json';
import fr from './fr.json';

const i18n = new I18n({
  ...en,
  ...fr,
});

i18n.defaultLocale = 'fr';
i18n.enableFallback = true;

export default i18n;
