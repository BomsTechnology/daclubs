import { Image } from 'react-native';
import { XStack, StackProps } from 'tamagui';

const HeaderTitle = (props: StackProps) => {
  return (
    <XStack alignItems="center" gap={0} {...props} maxWidth="100%">
      <Image source={require('~/assets/images/logo.png')} />
    </XStack>
  );
};

export default HeaderTitle;
