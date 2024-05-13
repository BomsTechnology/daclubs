import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Spinner } from 'tamagui';

import CustomHeader from './header/CustomHeader';
import ErrorScreen from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import ProductCard from './card/ProductCard';
import { getCollectionById, getProductsInCollectionById } from '../api/collection';
import { MainProductProps } from '../types/ProductProps';

import { Container } from '~/tamagui.config';

const CategoryScreen = ({ id, from }: { id: string; from: string }) => {
  const [products, setProducts] = useState<MainProductProps[]>([]);
  const {
    data: collection,
    isPending: isPendingCollection,
    error: errorCollection,
    refetch: refetchCollection,
  } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollectionById(id),
  });

  const {
    data: collectionWithProducts,
    error: errorProducts,
    refetch: refetchProducts,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['collection_with_product_by_id', id],
    queryFn: ({ pageParam }) => getProductsInCollectionById({ id, pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.products.pageInfo.endCursor,
  });

  useEffect(() => {
    if (status === 'success') {
      collectionWithProducts.pages[collectionWithProducts.pages.length - 1].products.edges.forEach(
        (product) => {
          setProducts((prev) => [...prev, product.node]);
        }
      );
    }
  }, [collectionWithProducts]);

  if (isPendingCollection) return <LoadingScreen />;
  if (errorCollection)
    return (
      <ErrorScreen
        button
        onPress={() => {
          refetchCollection();
        }}
        message={errorCollection?.message || 'Une erreur est survenue'}
      />
    );
  return (
    <>
      <CustomHeader title={collection?.title} />
      <Container>
        {status === 'pending' ? (
          <LoadingScreen />
        ) : errorProducts ? (
          <ErrorScreen
            button
            onPress={() => {
              refetchProducts();
            }}
            message={errorProducts?.message || 'Une erreur est survenue'}
          />
        ) : (
          <FlashList
            data={products}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <ProductCard {...item} peer={(index + 1) % 2 === 0} from={from} />}
            estimatedItemSize={500}
            //onEndReachedThreshold={4}
            onEndReached={() => {
              if (
                !isFetching &&
                collectionWithProducts?.pages[collectionWithProducts.pages.length - 1].products
                  .pageInfo.hasNextPage
              )
                fetchNextPage();
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            ListFooterComponent={() => isFetchingNextPage && <Spinner color="#000" />}
          />
        )}
      </Container>
    </>
  );
};

export default CategoryScreen;
