import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const OrderCard = ({
  id,
  orderNumber,
  address,
  price,
  quantity,
  name,
  date,
}: {
  id: string;
  orderNumber: string | number;
  address?: string;
  price: string;
  quantity: number;
  name?: string;
  date?: string | Date;
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.content}
        onPress={() =>
          router.push({
            pathname: '/(app)/(shop)/account/order/[id]',
            params: {
              id,
            },
          })
        }>
        <Feather name="box" size={24} color="black" />

        <View style={styles.info}>
          <View style={styles.footer}>
            <Text style={styles.price}>{orderNumber}</Text>
            {date && <Text style={styles.name}>{new Date(date).toLocaleDateString()}</Text>}
          </View>
          <Text style={styles.brand}>
            {quantity} article{quantity > 1 && 's'}
          </Text>
          {address && (
            <Text style={styles.name} numberOfLines={1}>
              {address}
            </Text>
          )}
          {name && <Text style={[styles.name, { color: '#000' }]}>{name}</Text>}
          <Text style={styles.price}>{price}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EBEDF3',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    gap: 5,
    borderBottomColor: '#EBEDF3',
  },
  info: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
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
    fontFamily: 'RalewayExtraBold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default OrderCard;
