import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';

const HomeLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Feed',
        }}
      />
      <Tabs.Screen
        name="cart/index"
        options={{
          title: 'Users',
        }}
      />
      <Tabs.Screen
        name="favorite/index"
        options={{
          title: 'Chat',
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: 'Quizz',
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;
