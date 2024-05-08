import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';

const CartProductCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: 'https://daclub-snkrs.com/cdn/shop/files/D97943EB-92C7-4B23-BA9F-90508444F49D.jpg?v=1710327557&width=922',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.brand}>AIR JORDAN</Text>
          <Text style={styles.name}>AIR JORDAN 1 RETRO LOW OG TROPHY ROOM</Text>
          <Text style={[styles.name, { color: '#000' }]}>42.5 E - 9 US (1)</Text>
          <Text style={styles.price}>€ 100</Text>
        </View>
      </View>
      <Pressable style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color="#F85454" />
        <Text style={{ color: '#F85454' }}>Supprimer</Text>
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
    padding: 15,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#EBEDF3',
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
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
});

export default CartProductCard;
