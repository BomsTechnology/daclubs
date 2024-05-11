import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { H4, SizableText, XStack } from 'tamagui';

import { getCollections, getProductsInCollectionByHandle } from '~/src/api/collection';
import HorizontalCollectionCard from '~/src/components/card/HorizontalCollectionCard';
import ProductCard from '~/src/components/card/ProductCard';
import SearchInput from '~/src/components/form/SearchInput';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { data: collections } = useQuery({
    queryKey: ['collections'],
    queryFn: () =>
      getCollections().then((res) => {
        return res.filter((collection) => collection.node.image);
      }),
  });

  const { data: collectionWithProduct } = useQuery({
    queryKey: ['collection_with_product_by_handle'],
    queryFn: () => getProductsInCollectionByHandle('nouveaute'),
  });

  return (
    <Container>
      <SearchInput />
      <Animated.View style={{ marginTop: 15 }}>
        <ScrollView
          contentContainerStyle={{ gap: 15 }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {collections?.map((collection) => (
            <HorizontalCollectionCard key={collection.node.id} collection={collection} />
          ))}
        </ScrollView>
      </Animated.View>
      <XStack mt={15} mb={10} justifyContent="space-between" alignItems="center">
        <H4>{collectionWithProduct?.title}</H4>
        <SizableText>Voir tout</SizableText>
      </XStack>
      <FlashList
        data={collectionWithProduct?.products.edges}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductCard {...item.node} peer={(index + 1) % 2 === 0} />
        )}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
