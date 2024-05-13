import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

import HeaderButton from './HeaderButton';
import HeaderTitle from './HeaderTitle';

const HomeHeader = () => {
  const { top } = useSafeAreaInsets();
  return (
    <YStack bg="#F8F9FA" pt={top + 10} px={20}>
      <XStack justifyContent="space-between">
        <HeaderButton>
          <DrawerToggleButton tintColor="#000" />
        </HeaderButton>
        <HeaderTitle />
        <HeaderButton>
          <Ionicons name="notifications" size={20} color="#000" />
        </HeaderButton>
      </XStack>
    </YStack>
  );
};

export default HomeHeader;
