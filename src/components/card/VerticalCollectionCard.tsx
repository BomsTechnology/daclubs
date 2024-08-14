import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import CollectionProps from '~/src/types/CollectionProps';

const VerticalCollectionCard = ({ peer, ...collection }: CollectionProps & { peer: boolean }) => {
  return (
    <TouchableOpacity
      style={[styles.container, peer ? styles.ml : styles.mr]}
      onPress={() =>
        router.push({
          pathname: `/marks/category`,
          params: {
            id: collection.node.id,
          },
        })
      }>
      {collection.node.image && (
        <FastImage
          source={{
            uri: collection.node.image.url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.text} numberOfLines={2}>
          {collection.node.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    aspectRatio: 3 / 4,
    zIndex: -1
  },
  image: {
    height: '100%',
    borderRadius: 8,
    width: '100%',
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
  ml: {
    marginLeft: 5,
  },
  mr: {
    marginRight: 5,
  },
});

export default VerticalCollectionCard;
