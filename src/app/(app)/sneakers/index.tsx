import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Spinner } from 'tamagui';

import { getProductsInCollectionByHandle } from '~/src/api/collection';
import FilterHandleBS from '~/src/components/bottomsheet/FilterHandleBS';
import ProductCard from '~/src/components/card/ProductCard';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import ErrorScreen from '~/src/components/screen/ErrorScreen';
import LoadingScreen from '~/src/components/screen/LoadingScreen';
import formatDataFilter from '~/src/functions/formatDataFilter';
import useShowNotification from '~/src/hooks/useShowNotification';
import { MainProductProps } from '~/src/types/ProductProps';
import SearchProps from '~/src/types/SearchProps';
import { wishlistWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { showMessage } = useShowNotification();
  const [filterData, setFilterData] = useState<SearchProps>({
    items: [],
    price: {
      max: '',
      min: '',
    },
  });
  const [isFilter, setIsFilter] = useState(false);
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);
  const [products, setProducts] = useState<MainProductProps[]>([]);
  const { data, error, refetch, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['products'],
      queryFn: ({ pageParam }) =>
        getProductsInCollectionByHandle({
          pageParam,
          filter: formatDataFilter(filterData),
          handle: 'all',
        }),
      initialPageParam: '',
      getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.products.pageInfo.endCursor,
    });

  useEffect(() => {
    if (status === 'success') {
      if (isFilter) {
        data.pages.forEach((page) => {
          page.products.edges.forEach((product) => {
            setProducts((prev) => [...prev, product.node]);
          });
        });
      } else {
        data.pages[data.pages.length - 1].products.edges.forEach((product) => {
          setProducts((prev) => [...prev, product.node]);
        });
      }
      setIsFilter(false);
    }
  }, [data]);

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

  if (status === 'pending') return <LoadingScreen />;
  if (status === 'error')
    return (
      <ErrorScreen
        button
        onPress={() => {
          setIsFilter(false);
          setProducts([]);
          setFilterData({
            items: [],
            price: {
              min: '',
              max: '',
            },
          });
          refetch();
        }}
        message={error?.message || 'Une erreur est survenue'}
      />
    );
  return (
    <>
      <Container>
        <FilterHandleBS
          handle="all"
          setFilterData={setFilterData}
          filterData={filterData}
          onFilter={() => {
            setIsFilter(true);
            setProducts([]);
            refetch();
          }}
        />
        {isFetching ? (
          <LoadingScreen />
        ) : products.length === 0 ? (
          <EmptyScreen message="Aucun produit trouvée" />
        ) : (
          <FlashList
            data={products}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ProductCard
                setWishlist={() => setWishlistItem(item)}
                isFavorite={wishlist.some((prod) => prod.id === item.id)}
                from="(app)/sneakers"
                {...item}
                peer={(index + 1) % 2 === 0}
              />
            )}
            estimatedItemSize={500}
            contentContainerStyle={{ paddingBottom: 50 }}
            extraData={wishlist}
            onEndReached={() => {
              if (!isFetching && data?.pages[data.pages.length - 1].products.pageInfo.hasNextPage)
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

export default Page;
