import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { H4, SizableText, XStack } from 'tamagui';

import { getCollections, getProductsInCollectionByHandle } from '~/src/api/collection';
import HorizontalCollectionCard from '~/src/components/card/HorizontalCollectionCard';
import ProductCard from '~/src/components/card/ProductCard';
import SearchInput from '~/src/components/form/SearchInput';
import HomeHeader from '~/src/components/header/HomeHeader';
import ErrorScreen from '~/src/components/screen/ErrorScreen';
import LoadingScreen from '~/src/components/screen/LoadingScreen';
import useShowNotification from '~/src/hooks/useShowNotification';
import { MainProductProps } from '~/src/types/ProductProps';
import { wishlistWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { showMessage } = useShowNotification();
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);
  //const wishlistRef = useRef(wishlist);
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

  const setWishlistItem = (data: MainProductProps) => {
    const index = wishlist.indexOf(data);
    if (index > -1) {
      setWishlist(wishlist.filter((wishlist) => wishlist.id !== data.id));
      showMessage('Supprimé des favoris', 'success');
    } else {
      setWishlist([...wishlist, data]);
      showMessage('Ajouté aux favoris', 'success');
    }
  };

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
            keyExtractor={(item) => item.node.id}
            extraData={wishlist}
            renderItem={({ item, index }) => (
              <ProductCard
                setWishlist={() => setWishlistItem(item.node)}
                isFavorite={wishlist.some((prod) => prod.id === item.node.id)}
                {...item.node}
                peer={(index + 1) % 2 === 0}
                from="(app)/(shop)/home"
              />
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
