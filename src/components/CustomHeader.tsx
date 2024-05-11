import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, SizableText, XStack, YStack } from 'tamagui';

const CustomHeader = ({
  title,
  description,
  showBtn = true,
  icon,
}: {
  title: string;
  description?: string;
  showBtn?: boolean;
  icon?: JSX.Element;
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <YStack bg="#fff" pt={top + 10} pb={15}>
      <XStack px={20} gap={10} alignItems="center">
        {showBtn && (
          <>
            {icon ? (
              <Button
                bg="#fff"
                unstyled
                borderWidth={1}
                p={10}
                borderColor="#EBEDF3"
                justifyContent="center"
                alignItems="center">
                {icon}
              </Button>
            ) : (
              <Button
                onPress={() => router.back()}
                bg="#fff"
                unstyled
                p={10}
                borderWidth={1}
                borderColor="#EBEDF3"
                justifyContent="center"
                alignItems="center">
                <Ionicons name="arrow-back" size={20} />
              </Button>
            )}
          </>
        )}
        <YStack>
          <SizableText fontWeight="700" fontSize={18} numberOfLines={1}>
            {title}
          </SizableText>
          {description && (
            <SizableText fontWeight="500" fontSize={14} numberOfLines={1}>
              {description}
            </SizableText>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default CustomHeader;
