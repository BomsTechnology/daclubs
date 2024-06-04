import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { atom, useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useRef, useState } from 'react';
import { ImageBackground } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import OnboardingFooter from '../components/onboarding/OnboardingFooter';
import OnboardingItem from '../components/onboarding/OnboardingItem';
import ErrorScreen from '../components/screen/ErrorScreen';
import SplashScreen from '../components/screen/SplashScreen';
import { settingWithStorage } from '../utils/storage';

const asyncAtom = atom(async (get) => get(settingWithStorage));
const loadableAtom = loadable(asyncAtom);

const items = [
  {
    title: "Bienvenue sur Da'Club",
    image: require('~/assets/images/image1.png'),
    description: '',
    position: 'top',
  },
  {
    title: 'Collection Exclusives',
    image: require('~/assets/images/image2.png'),
    description:
      'Accédez à une sélection de sneakers rares et exclusives que vous ne trouverez nulle part ailleurs',
    position: 'bottom',
  },
  {
    title: 'Suivez  la mode',
    image: require('~/assets/images/image3.png'),
    description: "Explorez les dernières tendances en matière de sneakers avec Da'Club",
    position: 'bottom',
  },
];

export default function Page() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<PagerView>(null);
  const [settingStorage] = useAtom(loadableAtom);

  const handleNext = () => {
    if (pageRef.current && currentPage < items.length - 1) {
      pageRef.current.setPage(currentPage + 1);
    } else if (currentPage === items.length - 1) {
      router.replace('/(app)/(shop)/home/');
    }
  };

  if (settingStorage.state === 'hasError')
    return <ErrorScreen message={`${settingStorage.error}` || 'Une erreur est survenue'} />;

  if (settingStorage.state === 'loading') return <SplashScreen />;

  if (settingStorage.data.alreadyOpen) {
    return <Redirect href="/(app)/(shop)/home/" />;
  }

  return (
    <ImageBackground source={require('~/assets/images/onboardbackground.png')} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <PagerView
          ref={pageRef}
          overScrollMode="auto"
          initialPage={0}
          style={{ flex: 1 }}
          onPageScroll={(e) => setCurrentPage(e.nativeEvent.position)}>
          {items.map((item, index) => (
            <OnboardingItem key={index + 1} {...item} />
          ))}
        </PagerView>
        <OnboardingFooter nbItems={items.length} activeItem={currentPage} actionBtn={handleNext} />
      </SafeAreaView>
      <StatusBar style="light" />
    </ImageBackground>
  );
}
