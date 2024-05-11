import { Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { Theme } from 'tamagui';

import i18n from '../i18n';
import { settingWithStorage } from '../utils/storage';

const Roostack = () => {
  const [setting] = useAtom(settingWithStorage);
  i18n.locale = setting.locale;
  return (
    <Theme name={setting.theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Onboarding',
          }}
        />
        <Stack.Screen name="(app)" />
      </Stack>
    </Theme>
  );
};

export default Roostack;
