import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Button, SizableText, XStack, YStack } from 'tamagui';
const AppLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
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
        name="home"
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="sneakers/index"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shoe-sneaker" color={color} size={size + 4} />
          ),
        }}
      />
      <Drawer.Screen
        name="marks/index"
        options={{
          title: 'Post',
          drawerIcon: ({ color, size }) => <Ionicons name="star" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="store/index"
        options={{
          title: 'setting',
          drawerIcon: ({ color, size }) => <Ionicons name="storefront" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
};

export default AppLayout;
