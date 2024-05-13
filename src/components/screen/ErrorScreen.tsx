import { Image } from 'react-native';
import { Button, SizableText } from 'tamagui';

import { Container } from '~/tamagui.config';

const ErrorScreen = ({
  message,
  button,
  btnText = 'Reessayer',
  onPress,
}: {
  message: string;
  button?: boolean;
  btnText?: string;
  onPress?: () => void;
}) => {
  return (
    <Container justifyContent="center" alignItems="center" gap="$2">
      <Image
        source={require('~/assets/images/error.png')}
        resizeMode="contain"
        style={{ width: '100%', height: 200 }}
      />
      <SizableText size="$10" textAlign="center">
        Erreur
      </SizableText>
      <SizableText textAlign="center">{message}</SizableText>
      {button && button === true && (
        <Button backgroundColor="#000" color="#fff" onPress={onPress}>
          {btnText}
        </Button>
      )}
    </Container>
  );
};

export default ErrorScreen;
