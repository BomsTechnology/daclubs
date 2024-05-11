import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  );
};

export default Layout;
