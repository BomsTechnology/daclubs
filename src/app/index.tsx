import { StatusBar } from 'expo-status-bar';
import { ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { YStack } from 'tamagui';

import OnboardingFooter from '../components/onboarding/OnboardingFooter';
import OnboardingItem from '../components/onboarding/OnboardingItem';
import { useRef, useState } from 'react';
import { router } from 'expo-router';

const items = [
  {
    title: "Bienvenue sur Da'Club",
    image: require('~/assets/images/image1.png'),
    description: '',
    position: 'top',
  },
  {
    title: "Let’s Start Journey With Da'club",
    image: require('~/assets/images/image2.png'),
    description: 'Smart, Gorgeous & Fashionable Collection Explor Now',
    position: 'bottom',
  },
  {
    title: 'Follow latest style shoes',
    image: require('~/assets/images/image3.png'),
    description: 'There Are Many Beautiful And Attractive Plants To Your Room',
    position: 'bottom',
  },
];

export default function Page() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<PagerView>(null);

  const handleNext = () => {
    if (pageRef.current && currentPage < items.length - 1) {
      pageRef.current.setPage(currentPage + 1);
    } else if (currentPage === items.length - 1) {
      router.replace('/(shop)/(home)/home/');
    }
  };
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
