import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, XStack, YStack } from 'tamagui';

import HeaderButton from './HeaderButton';
import HeaderTitle from './HeaderTitle';
import NotificationBS from '../bottomsheet/NotificationBS';

import { notificationWithStorage } from '~/src/utils/storage';

const HomeHeader = () => {
  const [notifications, setNotifications] = useAtom(notificationWithStorage);
  const { top } = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const unRead = notifications.filter((item) => !item.read).length;
  return (
    <>
      <YStack bg="#F8F9FA" pt={top + 10} px={20}>
        <XStack justifyContent="space-between">
          <HeaderButton>
            <DrawerToggleButton tintColor="#000" />
          </HeaderButton>
          <HeaderTitle />
          <HeaderButton position="relative" onPress={() => setIsOpen(true)}>
            {unRead > 0 && (
              <Circle position="absolute" top={5} right={5} size={10} backgroundColor="#38A61D" />
            )}
            <Ionicons name="notifications" size={20} color="#000" />
          </HeaderButton>
        </XStack>
      </YStack>
      <NotificationBS
        unRead={unRead}
        notifications={notifications}
        setNotifications={setNotifications}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default HomeHeader;
