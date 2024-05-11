import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { MainProductProps } from '~/src/types/ProductProps';

const ProductCard = ({ peer, ...product }: MainProductProps & { peer: boolean }) => {
  return (
    <View style={[styles.container, peer ? styles.ml : styles.mr]}>
      <Pressable style={styles.heartBtn}>
        <Ionicons name="heart-outline" size={24} color="black" />
      </Pressable>
      <Pressable onPress={() => router.push('/(shop)/(home)/home/detail')}>
        <View style={styles.imageContainer}>
          {product.featuredImage && (
            <FastImage
              source={{
                uri: product.featuredImage.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.image}
            />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.brand} numberOfLines={1}>
            {product.vendor}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.price} numberOfLines={1}>
            {`${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBEDF3',
    borderRadius: 10,
    overflow: 'hidden',
  },
  heartBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#F5F6F7',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-30deg' }],
  },
  ml: {
    marginLeft: 5,
  },
  mr: {
    marginRight: 5,
  },
  info: {
    marginTop: 10,
    paddingHorizontal: 5,
    gap: 8,
  },
  brand: {
    fontFamily: 'RalewaySemiBold',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  name: {
    fontFamily: 'RalewayRegular',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  price: {
    fontFamily: 'RalewayExtraBold',
    fontSize: 20,
  },
});
