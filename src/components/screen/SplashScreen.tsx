import { Image } from 'react-native';

import { Container } from '~/tamagui.config';

const SplashScreen = () => {
  return (
    <Container flex={1} bg="#000" justifyContent="center" alignItems="center">
      <Image
        source={require('~/assets/images/logo2.png')}
        resizeMode="cover"
        style={{ width: 250, height: 200 }}
      />
    </Container>
  );
};

export default SplashScreen;
