import { Spinner } from 'tamagui';

import { Container } from '~/tamagui.config';

const LoadingScreen = () => {
  return (
    <Container flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" color="#000" />
    </Container>
  );
};

export default LoadingScreen;
