import {
  Raleway_100Thin,
  Raleway_200ExtraLight,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  Raleway_900Black,
  useFonts,
} from '@expo-google-fonts/raleway';
import { ShopifyCheckoutSheetProvider } from '@shopify/checkout-sheet-kit';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import { TamaguiProvider } from 'tamagui';

import Roostack from '../components/Roostack';

import { queryClient } from '~/src/utils/queryClient';
import config from '~/tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    RalewayThin: Raleway_100Thin,
    RalewayExtraLight: Raleway_200ExtraLight,
    RalewayLight: Raleway_300Light,
    RalewayRegular: Raleway_400Regular,
    RalewayMedium: Raleway_500Medium,
    RalewaySemiBold: Raleway_600SemiBold,
    RalewayBold: Raleway_700Bold,
    RalewayExtraBold: Raleway_800ExtraBold,
    RalewayBlack: Raleway_900Black,
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
            <ToastProvider
              offsetTop={50}
              swipeEnabled
              textStyle={{ fontFamily: 'RalewayRegular', textAlign: 'center' }}>
              <ShopifyCheckoutSheetProvider>
                <Roostack />
                <StatusBar style="auto" />
              </ShopifyCheckoutSheetProvider>
            </ToastProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </TamaguiProvider>
    </JotaiProvider>
  );
}
