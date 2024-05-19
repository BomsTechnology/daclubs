import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Button, SizableText, XStack, YStack } from 'tamagui';

const OnboardingFooter = ({
  nbItems,
  activeItem,
  actionBtn,
}: {
  nbItems: number;
  activeItem: number;
  actionBtn: () => void;
}) => {
  return (
    <YStack px={20} justifyContent="space-between" h="100%" maxHeight="20%" pb={10}>
      <XStack justifyContent="center" gap={10} alignItems="center">
        {new Array(nbItems).fill(0).map((_, index) => (
          <Animated.View
            key={index}
            style={[styles.item, index === activeItem ? styles.itemActive : null]}
          />
        ))}
      </XStack>
      <Button borderRadius={0} onPress={actionBtn}>
        <SizableText fontWeight="700">Suivant</SizableText>
      </Button>
    </YStack>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 5,
  },
  itemActive: {
    backgroundColor: 'white',
    width: 42,
    height: 5,
  },
});

export default OnboardingFooter;
