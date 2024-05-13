import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, SizableText, Spinner } from 'tamagui';

import { getProducts } from '~/src/api/product';
import ErrorScreen from '~/src/components/screen/ErrorScreen';
import LoadingScreen from '~/src/components/screen/LoadingScreen';
import ProductCard from '~/src/components/card/ProductCard';
import { MainProductProps } from '~/src/types/ProductProps';
import { Container } from '~/tamagui.config';

const Page = () => {
  const [products, setProducts] = useState<MainProductProps[]>([]);
  const { data, error, refetch, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['products'],
      queryFn: getProducts,
      initialPageParam: '',
      getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
    });

  useEffect(() => {
    if (status === 'success') {
      data.pages[data.pages.length - 1].edges.forEach((product) => {
        setProducts((prev) => [...prev, product.node]);
      });
    }
  }, [data]);

  if (status === 'pending') return <LoadingScreen />;
  if (status === 'error')
    return (
      <ErrorScreen
        button
        onPress={() => refetch()}
        message={error?.message || 'Une erreur est survenue'}
      />
    );
  return (
    <Container>
      <Button size="$2" alignSelf="flex-end" borderRadius={20} my={15}>
        <Ionicons name="filter" size={14} color="#000" />
        <SizableText fontWeight="600" fontSize={13}>
          Filtrer
        </SizableText>
      </Button>

      <FlashList
        data={products}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductCard from="(app)/sneakers" {...item} peer={(index + 1) % 2 === 0} />
        )}
        estimatedItemSize={500}
        contentContainerStyle={{ paddingBottom: 50 }}
        onEndReached={() => {
          if (!isFetching && data?.pages[data.pages.length - 1].pageInfo.hasNextPage)
            fetchNextPage();
        }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={() => isFetchingNextPage && <Spinner color="#000" />}
      />
    </Container>
  );
};

export default Page;
