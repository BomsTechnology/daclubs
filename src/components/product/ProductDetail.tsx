import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import ProductDeliveryMode from './ProductDeliveryMode';
import ProductDescription from './ProductDescription';
import ProductExtra from './ProductExtra';
import ProductFooter from './ProductFooter';
import ProductInfo from './ProductInfo';
import ProductSize from './ProductSize';
import ProductSlider from './ProductSlider';
import CustomHeader from '../header/CustomHeader';
import ErrorScreen from '../screen/ErrorScreen';
import LoadingScreen from '../screen/LoadingScreen';

import { getProduct } from '~/src/api/product';
import useShowNotification from '~/src/hooks/useShowNotification';
import { MainProductProps, VariantProps } from '~/src/types/ProductProps';
import { wishlistWithStorage } from '~/src/utils/storage';

const ProductDetail = ({ id, pb }: { id: string; pb?: boolean; }) => {
  const { showMessage } = useShowNotification();
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);
  const [selectedVariant, setSelectedVariant] = useState<VariantProps | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('Standard');

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () =>
      getProduct(id).then((res) => {
        setWishlist((prev) => prev);
        return res;
      }),
  });

  useEffect(() => {
    if (data && selectedSize) {
      findVariant();
    }
  }, [selectedSize, selectedDeliveryMode]);

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

  if (isPending) return <LoadingScreen />;
  if (error)
    return (
      <ErrorScreen
        button
        onPress={() => refetch()}
        message={error?.message || 'Une erreur est survenue'}
      />
    );

  const findVariant = () => {
    if (
      data.options &&
      data.options[0] &&
      data.options[0].name === 'Taille' &&
      data.options[1] &&
      data.options[1].name === 'Livraison'
    ) {
      const variant = data.variants?.edges.filter((variant) => {
        return (
          variant.node.selectedOptions[0].value === selectedSize &&
          variant.node.selectedOptions[1].value === selectedDeliveryMode
        );
      })[0]!.node;
      if (variant && variant.availableForSale) {
        if (selectedDeliveryMode === 'Express' && variant.quantityAvailable === 0) {
          showMessage(
            "Désolé la livraison express n'est pas disponible pour le moment pour ce produit :("
          );
          return;
        }
        setSelectedVariant(variant);
      } else {
        showMessage('Désolé vous ne pouvez pas acheter cette variante pour le moment :(');
      }
    } else if (data.options && data.options[0] && data.options[0].name === 'Taille') {
      const variant = data.variants?.edges.filter((variant) => {
        return variant.node.selectedOptions[0].value === selectedSize;
      })[0]!.node;
      if (variant && variant.availableForSale) {
        setSelectedVariant(variant);
      } else {
        showMessage('Désolé vous ne pouvez pas acheter cette variante pour le moment :(');
      }
    } else {
      showMessage('Désolé vous ne pouvez pas acheter ce produit pour le moment :(');
    }
  };

  return (
    <>
      <CustomHeader title="Détails du produit" />
      <ScrollView style={{ flex: 1, height: '100%' }} showsHorizontalScrollIndicator={false}>
        <ProductSlider images={data.images?.edges || []} />
        <ProductInfo data={data} selectedVariant={selectedVariant!} />
        {data.options && data.options[0] && data.options[0].name === 'Taille' && (
          <ProductSize
            setSelectedSize={setSelectedSize}
            selectedSize={selectedSize}
            sizes={data.options[0].values}
          />
        )}
        {data.options && data.options[1] && data.options[1].name === 'Livraison' && (
          <ProductDeliveryMode
            selectedDeliveryMode={selectedDeliveryMode}
            setSelectedDeliveryMode={setSelectedDeliveryMode}
            deliveryModes={data.options[1].values}
          />
        )}
        <ProductDescription description={data.description!} />
        <ProductExtra />
      </ScrollView>
      <ProductFooter
        pb={pb}
        data={data}
        selectedVariant={selectedVariant!}
        selectedSize={selectedSize}
        wishlist={wishlist}
        setWishlistItem={setWishlistItem}
      />
    </>
  );
};

export default ProductDetail;
