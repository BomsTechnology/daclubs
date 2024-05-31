import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Spinner } from 'tamagui';

import EmptyScreen from './EmptyScreen';
import ErrorScreen from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { MainProductProps } from '../../types/ProductProps';
import FilterManualBS from '../bottomsheet/FilterManualBS';
import ProductCard from '../card/ProductCard';
import SearchInput from '../form/SearchInput';
import CustomHeader from '../header/CustomHeader';

import { searchProducts } from '~/src/api/product';
import formatDataFilter from '~/src/functions/formatDataFilter';
import useShowNotification from '~/src/hooks/useShowNotification';
import SearchProps from '~/src/types/SearchProps';
import { wishlistWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const SearchScreen = ({ query, from }: { query: string; from: string }) => {
  const { showMessage } = useShowNotification();
  const [search, setSearch] = useState(query);
  const [filterData, setFilterData] = useState<SearchProps>({
    items: [],
    price: {
      max: '',
      min: '',
    },
  });
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);
  const [products, setProducts] = useState<MainProductProps[]>([]);

  const { data, error, refetch, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['search'],
      queryFn: ({ pageParam }) =>
        searchProducts({
          query: search,
          pageParam,
          filter: formatDataFilter(filterData),
        }),
      initialPageParam: '',
      getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.pageInfo.endCursor,
    });

  useEffect(() => {
    if (status === 'success') {
      setProducts([]);
      data.pages.forEach((page) => {
        page.edges.forEach((product) => {
          setProducts((prev) => [...prev, product.node]);
        });
      });
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
  if (error)
    return (
      <ErrorScreen
        button
        onPress={() => {
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
      <CustomHeader title={`Recherche '${search}'`} />
      <Container>
        <SearchInput value={search} setValue={setSearch} onSearch={() => refetch()} />
        <FilterManualBS
          data={data.pages[0].productFilters || []}
          setFilterData={setFilterData}
          filterData={filterData}
          onFilter={() => {
            setProducts([]);
            refetch();
          }}
        />
        {isFetching ? (
          <LoadingScreen />
        ) : products.length === 0 ? (
          <EmptyScreen message="Aucun produit trouvé" />
        ) : (
          <FlashList
            data={products}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            extraData={wishlist}
            renderItem={({ item, index }) => (
              <ProductCard
                isFavorite={wishlist.some((prod) => prod.id === item.id)}
                setWishlist={() => setWishlistItem(item)}
                {...item}
                peer={(index + 1) % 2 === 0}
                from={from}
              />
            )}
            estimatedItemSize={500}
            //onEndReachedThreshold={4}
            onEndReached={() => {
              if (!isFetching && data?.pages[data.pages.length - 1].pageInfo.hasNextPage)
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

export default SearchScreen;
