import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';

import { ProductCartProps } from '~/src/types/ProductProps';

const CartProductCard = ({
  onDelete,
  onIncrement,
  onDecrement,
  ...props
}: ProductCartProps & {
  onDelete?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.content}
        onPress={() =>
          router.push({
            pathname: '/cart/detail',
            params: {
              id: props.product.id,
            },
          })
        }>
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: props.product.featuredImage.url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.brand}>{props.product.vendor}</Text>
          <Text style={styles.name}>{props.product.title}</Text>
          {props.variant.selectedOptions.map((option, index) => (
            <Text key={`${option.name}-${index}`} style={[styles.name, { color: '#000' }]}>
              {option.value}
            </Text>
          ))}
          <Text style={styles.price}>
            {`${props.variant.price.amount} ${props.variant.price.currencyCode}`}
          </Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.quantity}>
          <TouchableOpacity onPress={onDecrement}>
            <Ionicons name="remove" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{props.quantity}</Text>
          <TouchableOpacity onPress={onIncrement}>
            <Ionicons name="add" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#F85454" />
          <Text style={{ color: '#F85454' }}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EBEDF3',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#EBEDF3',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  info: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  imageContainer: {
    width: '40%',
    height: 140,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EBEDF3',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-30deg' }],
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
    color: '#4C4C4C',
  },
  price: {
    fontFamily: 'RalewayExtraBold',
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#EBEDF3',
  },
  quantityText: {
    fontFamily: 'RalewayExtraBold',
    fontSize: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  quantityBtn: {},
});

export default memo(
  CartProductCard,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.variant.id === next.variant.id &&
    prev.quantity === next.quantity
);
