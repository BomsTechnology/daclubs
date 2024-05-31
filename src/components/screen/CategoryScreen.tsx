import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Spinner } from 'tamagui';

import EmptyScreen from './EmptyScreen';
import ErrorScreen from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { getCollectionById, getProductsInCollectionById } from '../../api/collection';
import { MainProductProps } from '../../types/ProductProps';
import FilterIDBS from '../bottomsheet/FilterIDBS';
import ProductCard from '../card/ProductCard';
import CustomHeader from '../header/CustomHeader';

import formatDataFilter from '~/src/functions/formatDataFilter';
import useShowNotification from '~/src/hooks/useShowNotification';
import SearchProps from '~/src/types/SearchProps';
import { wishlistWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const CategoryScreen = ({ id, from }: { id: string; from: string }) => {
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
    queryFn: ({ pageParam }) =>
      getProductsInCollectionById({ id, pageParam, filter: formatDataFilter(filterData) }),
    initialPageParam: '',
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.products.pageInfo.endCursor,
  });

  useEffect(() => {
    if (status === 'success') {
      if (isFilter) {
        collectionWithProducts.pages.forEach((page) => {
          page.products.edges.forEach((product) => {
            setProducts((prev) => [...prev, product.node]);
          });
        });
      } else {
        collectionWithProducts.pages[
          collectionWithProducts.pages.length - 1
        ].products.edges.forEach((product) => {
          setProducts((prev) => [...prev, product.node]);
        });
      }
      setIsFilter(false);
    }
  }, [collectionWithProducts]);

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

  if (isPendingCollection) return <LoadingScreen />;
  if (errorCollection)
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
          refetchCollection();
        }}
        message={errorCollection?.message || 'Une erreur est survenue'}
      />
    );
  return (
    <>
      <CustomHeader title={collection?.title} />
      <Container>
        <FilterIDBS
          id={id}
          setFilterData={setFilterData}
          filterData={filterData}
          onFilter={() => {
            setIsFilter(true);
            setProducts([]);
            refetchProducts();
          }}
        />
        {status === 'pending' || isFetching ? (
          <LoadingScreen />
        ) : errorProducts ? (
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
              refetchProducts();
            }}
            message={errorProducts?.message || 'Une erreur est survenue'}
          />
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
