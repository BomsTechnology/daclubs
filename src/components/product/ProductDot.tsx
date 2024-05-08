import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { XStack } from 'tamagui';

const ProductDot = ({ nbItems, activeItem }: { nbItems: number; activeItem: number }) => {
  return (
    <XStack px={20} justifyContent="center" pb={15} gap={5} alignItems="center" bg="white">
      {new Array(nbItems).fill(0).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.item, index === activeItem ? styles.itemActive : null]}
        />
      ))}
    </XStack>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 5,
  },
  itemActive: {
    backgroundColor: '#000',
    width: 15,
    height: 5,
    borderRadius: 5,
  },
});

export default ProductDot;
