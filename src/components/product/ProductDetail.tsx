import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import { Accordion, Button, Paragraph, SizableText, XStack, YStack } from 'tamagui';

import ProductDot from './ProductDot';
import CustomHeader from '../header/CustomHeader';
import ErrorScreen from '../screen/ErrorScreen';
import LoadingScreen from '../screen/LoadingScreen';

import { getProduct } from '~/src/api/product';
import useShowNotification from '~/src/hooks/useShowNotification';
import { VariantProps } from '~/src/types/ProductProps';
import { cartWithStorage, wishlistWithStorage } from '~/src/utils/storage';

const SizeTypes = ['EU', 'US'];

type SizeProps = {
  value: string;
  eu: string;
  us: string;
};

const ProductDetail = ({ id }: { id: string }) => {
  const { showMessage } = useShowNotification();
  const [cart, setCart] = useAtom(cartWithStorage);
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);
  const [selectedVariant, setSelectedVariant] = useState<VariantProps | null>(null);
  const [selectedSizeType, setSelectedSizeType] = useState('EU');
  const [listSizes, setListSizes] = useState<SizeProps[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('Standard');
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<PagerView>(null);

  const isFavorite = wishlist.some((item) => item.id === id);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () =>
      getProduct(id).then((res) => {
        if (res.options && res.options[0].name === 'Taille') {
          res.options[0].values.forEach((size: string) => {
            const sizes = size.split('-');
            setListSizes((prev) => [
              ...prev,
              {
                value: size,
                eu: sizes[0].replace('EU', ''),
                us: sizes[1].replace('US', ''),
              },
            ]);
          });
        }
        return res;
      }),
  });

  useEffect(() => {
    if (data && selectedSize) {
      findVariant();
    }
  }, [selectedSize, selectedDeliveryMode]);

  const SizeItem = ({ ...size }: SizeProps) => {
    return (
      <Button
        bg={selectedSize === size.value ? '#000' : '#ECEFF1'}
        color={selectedSize === size.value ? '#fff' : '#000'}
        w={95}
        onPress={() => setSelectedSize(size.value)}>
        {selectedSizeType === 'US' ? size.us : size.eu}
      </Button>
    );
  };

  const SizeTypeItem = ({ type }: { type: string }) => {
    return (
      <Button
        onPress={() => setSelectedSizeType(type)}
        borderWidth={selectedSizeType === type ? 0 : 1}
        borderColor="#000"
        bg={selectedSizeType === type ? '#000' : '#fff'}
        color={selectedSizeType === type ? '#fff' : '#000'}>
        {`${type} ${selectedSizeType === type ? '✓' : ''}`}
      </Button>
    );
  };

  const DeliveryItem = ({ text }: { text: string }) => {
    return (
      <Button
        onPress={() => setSelectedDeliveryMode(text)}
        bg={selectedDeliveryMode === text ? '#000' : '#ECEFF1'}
        flex={1}
        flexDirection="column"
        gap={0}
        h={100}>
        <SizableText
          lineHeight={14}
          fontWeight="700"
          color={selectedDeliveryMode === text ? '#fff' : '#000'}>
          Livraison {text}
        </SizableText>
        <SizableText
          fontSize={12}
          lineHeight={14}
          color={selectedDeliveryMode === text ? '#fff' : '#000'}>
          {text === 'Express' ? '(48h)' : '(5 à 10 jours ouvrés)'}
        </SizableText>
      </Button>
    );
  };

  const setWishlistItem = () => {
    if (data) {
      const index = wishlist.indexOf(data);
      if (index > -1) {
        setWishlist(wishlist.filter((wishlist) => wishlist.id !== data.id));
        showMessage('Supprimé des favoris', 'success');
      } else {
        setWishlist([...wishlist, data]);
        showMessage('Ajouté aux favoris', 'success');
      }
    }
  };

  const addToCart = async () => {
    if (!selectedSize) {
      showMessage('Veuillez choisir une taille');
    } else {
      let alreadyInCart = false;
      const newCart = cart.map((item) => {
        if (item.product.id === data!.id && item.variant.id === selectedVariant!.id) {
          alreadyInCart = true;
          item.quantity = item.quantity + 1;
          return item;
        }
        return item;
      });

      if (alreadyInCart) {
        setCart([...newCart]);
      } else {
        setCart([...cart, { product: data!, variant: selectedVariant!, quantity: 1 }]);
      }

      showMessage('Ajouté au panier', 'success');
      setTimeout(() => router.push('/cart'), 1000);
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
        <PagerView
          ref={pageRef}
          overScrollMode="auto"
          initialPage={0}
          onPageScroll={(e) => setCurrentPage(e.nativeEvent.position)}
          style={{ backgroundColor: 'white', aspectRatio: 3 / 2 }}>
          {data.images?.edges.map((image, index) => (
            <View style={{ width: '100%', height: '100%' }} key={index + 1}>
              <FastImage
                source={{
                  uri: image.node.url,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          ))}
        </PagerView>
        <ProductDot nbItems={data.images?.edges.length || 0} activeItem={currentPage} />

        <YStack py={10} px={20} bg="#fff" my={5}>
          <SizableText fontWeight="700" textTransform="uppercase">
            {data.vendor}
          </SizableText>
          <SizableText textTransform="uppercase" fontSize={18} mt={5}>
            {data.title}
          </SizableText>
          <SizableText textTransform="uppercase" fontSize={25} fontWeight="800" mt={5}>
            {selectedVariant
              ? `${selectedVariant?.price.amount} ${selectedVariant?.price.currencyCode}`
              : `${data.priceRange.minVariantPrice.amount} ${data.priceRange.minVariantPrice.currencyCode}`}
          </SizableText>
        </YStack>
        {data.options && data.options[0] && data.options[0].name === 'Taille' && (
          <YStack bg="white" px={20} py={10}>
            <XStack justifyContent="space-between" alignItems="center" mb={20}>
              <SizableText>Selectionnez votre taille : </SizableText>
              <XStack gap={20}>
                {SizeTypes.map((type) => (
                  <SizeTypeItem type={type} key={type} />
                ))}
              </XStack>
            </XStack>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}>
              {listSizes.map((size, index) => (
                <SizeItem {...size} key={`${size.value}-${index}`} />
              ))}
            </ScrollView>
          </YStack>
        )}
        {data.options && data.options[1] && data.options[1].name === 'Livraison' && (
          <YStack bg="white" px={20} py={10} mt={5}>
            <SizableText mb={20}>Selectionnez le mode de livraison : </SizableText>
            <XStack gap={20}>
              {data.options[1].values.map((type) => (
                <DeliveryItem text={type} />
              ))}
            </XStack>
          </YStack>
        )}
        <YStack my={5} bg="#fff" px={20} py={10}>
          <Accordion overflow="hidden" width="100%" type="multiple">
            <Accordion.Item value="a1">
              <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                {({ open }: { open: boolean }) => (
                  <>
                    <Paragraph>DESCRIPTION</Paragraph>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.Content
                exitStyle={{ opacity: 0 }}
                enterStyle={{ opacity: 0.5 }}
                animation="bouncy">
                <Paragraph>{data.description || 'Pas de description'}</Paragraph>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </YStack>
        <YStack mb={5} bg="#fff" px={20} py={10}>
          <XStack alignItems="center" gap={10}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="black" />
            <SizableText>Livraison gratuite à partir de 200€</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="star-outline" size={20} color="black" />
            <SizableText>Produits authentiques et neufs</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="card-outline" size={20} color="black" />
            <SizableText>Paiement en 3x sans frais</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="headset-outline" size={20} color="black" />
            <SizableText>Service Client disponible 24/7</SizableText>
          </XStack>
        </YStack>
      </ScrollView>
      <XStack bg="#fff" px={20} pb={20} pt={10} alignItems="center">
        <SizableText fontWeight="700" fontSize={25} flex={1}>
          {selectedVariant
            ? `${selectedVariant?.price.amount} ${selectedVariant?.price.currencyCode}`
            : `${data.priceRange.minVariantPrice.amount} ${data.priceRange.minVariantPrice.currencyCode}`}
        </SizableText>

        <XStack gap={10} h={40}>
          <Button
            onPress={() => addToCart()}
            bg="#000"
            borderRadius={0}
            unstyled
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            px={10}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <SizableText color="#fff" fontWeight="700">
              Ajouter au Panier
            </SizableText>
          </Button>
          <Button
            onPress={() => setWishlistItem()}
            px={12}
            borderRadius={0}
            borderWidth={1}
            borderColor={isFavorite ? '#000' : '#EBEDF3'}
            unstyled
            justifyContent="center"
            alignItems="center">
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color="#000" />
          </Button>
        </XStack>
      </XStack>
    </>
  );
};

export default ProductDetail;
