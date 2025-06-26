import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { MainLineItemProps } from '~/src/types/CustomerProps';

const OrderListProductCard = ({ ...props }: MainLineItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {(props.variant && props.variant.product) && (
            <FastImage
              source={{
                uri: props.variant.product.featuredImage.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.image}
            />
          )}
        </View>
        { props.variant ? <View style={styles.info}>
          <Text style={styles.brand}>{props.variant.product.vendor}</Text>
          <Text style={styles.name}>{props.title}</Text>
          {props.variant.selectedOptions.map((option, index) => (
            <Text key={`${option.name}-${index}`} style={[styles.name, { color: '#000' }]}>
              {option.value}
            </Text>
          ))}
          <View style={styles.footer}>
            <View style={styles.quantity}>
              <Text style={styles.quantityText}>Qte {props.quantity}</Text>
            </View>
            <Text style={styles.price}>
              {props.variant.price.amount} {props.variant.price.currencyCode}
            </Text>
          </View>
        </View> : <View style={styles.info}>
        <Text style={styles.brand}>Produit introuvable</Text>
        </View>
        }
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
  },
  info: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  imageContainer: {
    width: '35%',
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EBEDF3',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  brand: {
    fontFamily: 'RalewaySemiBold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  name: {
    fontFamily: 'RalewayRegular',
    textTransform: 'uppercase',
    fontSize: 12,
    color: '#4C4C4C',
  },
  price: {
    fontFamily: 'RalewayBold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  quantity: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#EBEDF3',
  },
  quantityText: {
    fontFamily: 'RalewayRegular',
    fontSize: 14,
  },
});

export default OrderListProductCard;
