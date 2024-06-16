import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

import { AddressProps } from '~/src/types/CustomerProps';

const AdressCard = ({
  onDelete,
  isDefault,
  ...props
}: AddressProps & {
  onDelete?: () => void;
  isDefault: boolean;
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.content}
        onPress={() =>
          router.push({
            pathname: '/(app)/(shop)/account/adress/[id]',
            params: {
              id: props.id,
            },
          })
        }>
        <View style={styles.info}>
          <Text style={styles.price}>{`${props.firstName} ${props.lastName}`}</Text>
          <Text style={styles.brand}>{props.address1}</Text>
          {props.address2 && <Text style={styles.brand}>{props.address2}</Text>}
          <Text style={styles.name}>
            {props.city} {props.province} {props.zip}
          </Text>
          <Text style={[styles.name, { color: '#000' }]}>{props.country}</Text>
          <Text style={{ color: '#000', fontSize: 12 }}>{props.phone}</Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        {isDefault ? (
          <View style={styles.default}>
            <Text style={styles.defautText}>Par défaut</Text>
          </View>
        ) : (
          <View />
        )}
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={14} color="#F85454" />
          <Text style={{ color: '#F85454', fontSize: 12 }}>Supprimer</Text>
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
    marginTop: 10,
  },
  default: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#EBEDF3',
  },
  defautText: {
    fontFamily: 'RalewayRegular',
    fontSize: 10,
    fontStyle: 'italic',
    color: '#000',
  },
});

export default AdressCard;
