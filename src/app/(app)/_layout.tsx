import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useMemo } from 'react';
import { Image } from 'react-native';
import { Button, SizableText, XStack, YStack } from 'tamagui';
const AppLayout = () => {
  const segments = useSegments();
  const nestedCategoryPageOpened = useMemo(() => {
    return (
      segments.length > 3 ||
      (segments.length === 3 && segments[2] === 'category') ||
      (segments.length === 3 && segments[1] === '(shop)' && segments[2] !== 'home')
    );
  }, [segments]);

  const nestedDrawerOpened = useMemo(() => {
    return segments.length > 3 || (segments.length === 3 && segments[2] === 'category');
  }, [segments]);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        swipeEnabled: !nestedDrawerOpened,
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
          <Button
            bg="#fff"
            unstyled
            ml={20}
            w={50}
            borderWidth={1}
            borderColor="#EBEDF3"
            h="100%"
            mt={20}
            justifyContent="center"
            alignItems="center">
            <DrawerToggleButton tintColor="#000" />
          </Button>
        ),
        headerStyle: {
          backgroundColor: '#F8F9FA',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitle: () => (
          <YStack alignItems="center" gap={0} mt={20}>
            <SizableText fontSize={16} numberOfLines={1}>
              Store location
            </SizableText>
            <XStack alignItems="center" gap={5}>
              <Ionicons name="location" size={16} color="#000" />
              <SizableText fontWeight="700" fontSize={18} numberOfLines={1}>
                Mondolibug, Sylhet
              </SizableText>
            </XStack>
          </YStack>
        ),
        headerRight: () => (
          <Button
            bg="#fff"
            unstyled
            mr={20}
            w={50}
            borderWidth={1}
            borderColor="#EBEDF3"
            h="100%"
            mt={20}
            alignItems="center"
            justifyContent="center">
            <Ionicons name="notifications" size={20} color="#000" />
          </Button>
        ),
      }}>
      <Drawer.Screen
        name="(shop)"
        options={{
          drawerLabel: 'Accueil',
          headerShown: !nestedCategoryPageOpened,
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={16} />,
        }}
      />
      <Drawer.Screen
        name="sneakers"
        options={{
          title: 'Sneakers',
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

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff' }}>
      <XStack pb={20} px={20} pt={10} borderBottomWidth={1} borderBottomColor="#EBEDF3">
        <Image source={require('~/assets/images/logo.png')} />
      </XStack>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default AppLayout;
