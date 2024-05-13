import { Image } from 'react-native';
import { SizableText } from 'tamagui';

import { Container } from '~/tamagui.config';

const EmptyScreen = ({
  message = 'Aucune donnée',
  title = 'Oops',
}: {
  message?: string;
  title?: string;
}) => {
  return (
    <Container justifyContent="center" alignItems="center" gap="$2">
      <Image
        source={require('~/assets/images/Empty.gif')}
        resizeMode="contain"
        style={{ width: '100%', height: 200 }}
      />
      <SizableText size="$10" textAlign="center">
        {title}
      </SizableText>
      <SizableText textAlign="center">{message}</SizableText>
    </Container>
  );
};

export default EmptyScreen;
