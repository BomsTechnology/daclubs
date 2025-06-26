import { Image } from 'react-native';
import { XStack, StackProps } from 'tamagui';

const HeaderTitle = (props: StackProps) => {
  return (
    <XStack alignItems="center" {...props} maxWidth="100%">
      <Image style={{ width: 40, height: 50 }} resizeMode="contain" source={require('~/assets/images/logo.png')} />
    </XStack>
  );
};

export default HeaderTitle;
