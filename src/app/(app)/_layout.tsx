import { Drawer } from 'expo-router/drawer';
const AppLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}>
      <Drawer.Screen
        name="(shop)"
        options={{
          drawerLabel: 'Home',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="sneakers/index"
        options={{
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="marks/index"
        options={{
          title: 'Post',
        }}
      />
      <Drawer.Screen
        name="store/index"
        options={{
          title: 'setting',
        }}
      />
    </Drawer>
  );
};

export default AppLayout;
