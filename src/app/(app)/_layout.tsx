import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { Image } from 'react-native';
import { Circle, XStack } from 'tamagui';

import NotificationBS from '~/src/components/bottomsheet/NotificationBS';
import HeaderButton from '~/src/components/header/HeaderButton';
import HeaderTitle from '~/src/components/header/HeaderTitle';
import NotificationProps from '~/src/types/NotificationProps';
import { notificationWithStorage } from '~/src/utils/storage';
const AppLayout = () => {
  const [notifications, setNotifications] = useAtom(notificationWithStorage);
  const [isOpen, setIsOpen] = useState(false);
  const segments = useSegments();
  const nestedCategoryPageOpened = useMemo(() => {
    return (
      segments.length > 3 ||
      (segments.length === 3 && (segments[2] === 'category' || segments[2] === 'detail'))
    );
  }, [segments]);
  const unRead = notifications.filter((item) => !item.read).length;

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent
          props={props}
          unRead={unRead}
          notifications={notifications}
          setNotifications={setNotifications}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      )}
      screenOptions={{
        swipeEnabled: !nestedCategoryPageOpened,
        headerShown: true,
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
          fontFamily: 'RalewayRegular',
        },
        drawerItemStyle: {
          borderBottomWidth: 1,
          borderBottomColor: '#EBEDF3',
          height: 50,
          justifyContent: 'center',
        },
        headerLeft: () => (
          <HeaderButton ml={20} mt={20}>
            <DrawerToggleButton tintColor="#000" />
          </HeaderButton>
        ),
        headerStyle: {
          backgroundColor: '#F8F9FA',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitle: () => <HeaderTitle mt={20} />,
        headerRight: () => (
          <HeaderButton position="relative" mr={20} mt={20} onPress={() => setIsOpen(true)}>
            {unRead > 0 && (
              <Circle position="absolute" top={5} right={5} size={10} backgroundColor="#38A61D" />
            )}
            <Ionicons name="notifications" size={20} color="#000" />
          </HeaderButton>
        ),
      }}>
      <Drawer.Screen
        name="(shop)"
        options={{
          drawerLabel: 'Accueil',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={16} />,
        }}
      />
      <Drawer.Screen
        name="sneakers"
        options={{
          title: 'Sneakers',
          headerShown: !nestedCategoryPageOpened,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shoe-sneaker" color={color} size={20} />
          ),
        }}
      />
      <Drawer.Screen
        name="marks"
        options={{
          title: 'Nos Marques',
          headerShown: !nestedCategoryPageOpened,
          drawerIcon: ({ color, size }) => <Ionicons name="star-outline" color={color} size={18} />,
        }}
      />
      <Drawer.Screen
        name="store/index"
        redirect
        options={{
          title: 'Magasin Physique',
          headerShown: !nestedCategoryPageOpened,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" color={color} size={16} />
          ),
        }}
      />
    </Drawer>
  );
};

const CustomDrawerContent = ({
  props,
  unRead,
  notifications,
  setNotifications,
  isOpen,
  setIsOpen,
}: {
  props: DrawerContentComponentProps;
  unRead: number;
  notifications: NotificationProps[];
  setNotifications: (notifications: NotificationProps[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff' }}>
        <XStack pb={20} px={20} pt={10} borderBottomWidth={1} borderBottomColor="#EBEDF3">
          <Image source={require('~/assets/images/logo.png')} />
        </XStack>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
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

export default AppLayout;
