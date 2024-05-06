import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const HorizontalCollectionCard = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <FastImage
        source={{
          uri: 'https://daclub-snkrs.com/cdn/shop/collections/003bfa846db6ce8a081d3e0ccacab826.jpg?v=1678444218&width=1080',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.text} numberOfLines={2}>
          Jordan 1
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 140,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'RalewayBold',
    textTransform: 'uppercase',
    marginTop: 5,
    fontSize: 14,
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default HorizontalCollectionCard;
