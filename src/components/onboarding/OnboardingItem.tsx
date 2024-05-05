import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { H2, SizableText, YStack } from 'tamagui';

const OnboardingItem = ({
  position,
  image,
  description,
  title,
}: {
  position: string;
  image: ImageSourcePropType;
  description: string;
  title: string;
}) => {
  return (
    <YStack alignItems="center" flex={1} justifyContent="center" pt={40} gap={60}>
      {position === 'top' && (
        <H2
          color="#fff"
          textAlign="center"
          textTransform="uppercase"
          fontWeight="700"
          enterStyle={{ opacity: 0, y: -50 }}
          animation="bouncy"
          maxWidth="70%">
          {title}
        </H2>
      )}
      <YStack position="relative" enterStyle={{ opacity: 0, y: 100 }} animation="bouncy">
        <Image source={image} resizeMode="cover" style={styles.image} />
        <View style={styles.imageCircleContainer}>
          <View style={styles.imageCircleContent}>
            <Image source={image} resizeMode="cover" style={styles.imageCircle} />
          </View>
        </View>
      </YStack>
      <YStack justifyContent="center" gap={10} alignItems="center">
        {position === 'bottom' && (
          <H2
            color="#fff"
            textAlign="center"
            textTransform="uppercase"
            fontWeight="700"
            maxWidth="90%">
            {title}
          </H2>
        )}
        {description && (
          <SizableText color="white" textAlign="center" maxWidth="90%">
            {description}
          </SizableText>
        )}
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 250,
    maxWidth: '100%',
    transform: [{ rotate: '-20deg' }],
  },
  imageCircle: {
    height: 500,
    width: 500,
    transform: [{ rotate: '-20deg' }],
  },
  imageCircleContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    right: 50,
  },
  imageCircleContent: {
    height: 92,
    width: 92,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingItem;
