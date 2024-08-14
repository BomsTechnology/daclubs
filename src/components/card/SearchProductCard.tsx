import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { MainProductProps } from '~/src/types/ProductProps';

const SearchProductCard = ({ product }: { product: MainProductProps }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: `/(app)/(shop)/home/detail`,
          params: {
            id: product.id,
          },
        })
      }>
      {product.featuredImage && (
        <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri: product.featuredImage.url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.image}
        />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.price} numberOfLines={1}>
        {`${product.priceRange.minVariantPrice.amount} €`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 100,
  },
  imageContainer: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEDF3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: 'RalewaySemiBold',
    textTransform: 'uppercase',
    fontSize: 12,
    color: '#000',
  },
  price: {
    fontFamily: 'RalewayRegular',
    textTransform: 'uppercase',
    fontSize: 12,
    color: '#000',
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default SearchProductCard;
