import { Ionicons } from '@expo/vector-icons';
import { SizableText, XStack, YStack, StackProps } from 'tamagui';

const HeaderTitle = (props: StackProps) => {
  return (
    <YStack alignItems="center" gap={0} {...props}>
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
  );
};

export default HeaderTitle;
