import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { H4, SizableText, XStack } from 'tamagui';

import { getCollections, getProductsInCollectionByHandle } from '~/src/api/collection';
import ErrorScreen from '~/src/components/ErrorScreen';
import LoadingScreen from '~/src/components/LoadingScreen';
import HorizontalCollectionCard from '~/src/components/card/HorizontalCollectionCard';
import ProductCard from '~/src/components/card/ProductCard';
import SearchInput from '~/src/components/form/SearchInput';
import HomeHeader from '~/src/components/header/HomeHeader';
import { Container } from '~/tamagui.config';

const Page = () => {
  const {
    data: collections,
    isPending: isPendingCollections,
    error: errorCollections,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () =>
      getCollections().then((res) => {
        return res.filter((collection) => collection.node.image);
      }),
  });

  const {
    data: collectionWithProduct,
    isPending: isPendingCollection,
    error: errorCollection,
    refetch: refetchCollection,
  } = useQuery({
    queryKey: ['collection_with_product_by_handle'],
    queryFn: () => getProductsInCollectionByHandle('nouveaute'),
  });

  if (isPendingCollections) return <LoadingScreen />;

  if (errorCollections || errorCollection)
    return (
      <ErrorScreen
        button
        onPress={() => {
          refetchCollections();
          refetchCollection();
        }}
        message={errorCollections?.message || errorCollection?.message || 'Une erreur est survenue'}
      />
    );

  return (
    <>
    <HomeHeader />
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
        <SizableText
          onPress={() =>
            router.push({
              pathname: `/home/category`,
              params: {
                id: collectionWithProduct?.id!,
              },
            })
          }>
          Voir tout
        </SizableText>
      </XStack>

      {isPendingCollection ? (
        <LoadingScreen />
      ) : (
        <FlashList
          data={collectionWithProduct?.products.edges}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ProductCard {...item.node} peer={(index + 1) % 2 === 0} from="(app)/(shop)/home" />
          )}
          estimatedItemSize={50}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </Container>
    </>
  );
};

export default Page;
