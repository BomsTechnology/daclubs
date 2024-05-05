import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as JotaiProvider } from 'jotai';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';

import Roostack from '../components/Roostack';

import { queryClient } from '~/src/utils/queryClient';
import config from '~/tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <JotaiProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <Roostack />
          </QueryClientProvider>
        </GestureHandlerRootView>
      </TamaguiProvider>
    </JotaiProvider>
  );
}
