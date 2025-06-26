import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, XStack, YStack } from 'tamagui';

import HeaderButton from './HeaderButton';
import HeaderTitle from './HeaderTitle';
import NotificationBS from '../bottomsheet/NotificationBS';

import { notificationWithStorage, openNotificationAtom } from '~/src/utils/storage';
import { DrawerActions, ParamListBase, useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer/src/types";

const HomeHeader = () => {
  const { top } = useSafeAreaInsets();
  const [notifications] = useAtom(notificationWithStorage);
  const [isOpen, setIsOpen] = useAtom(openNotificationAtom);
  const unRead = notifications.filter((item) => !item.read).length;
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <>
      <YStack bg="#F8F9FA" pt={top + 10} px={20}>
        <XStack justifyContent="space-between">
          <HeaderButton onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Ionicons name="menu" size={20} color="#000" />
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
      <NotificationBS isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default HomeHeader;
