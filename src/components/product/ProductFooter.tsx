import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SizableText, XStack, Button as TamaguiButton } from 'tamagui';

import Button from '~/src/components/form/Button';
import useShowNotification from '~/src/hooks/useShowNotification';
import { MainProductProps, VariantProps } from '~/src/types/ProductProps';
import { cartWithStorage } from '~/src/utils/storage';

const ProductFooter = ({
  data,
  selectedVariant,
  wishlist,
  setWishlistItem,
  selectedSize,
  pb
}: {
  data: MainProductProps;
  selectedVariant?: VariantProps;
  wishlist: MainProductProps[];
  selectedSize: string;
  setWishlistItem: (item: MainProductProps) => void;
  pb?: boolean;
}) => {
  const { bottom } = useSafeAreaInsets();
  const { showMessage } = useShowNotification();
  const [cart, setCart] = useAtom(cartWithStorage);
  const isFavorite = wishlist.some((item) => item.id === data.id);

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
        setCart(newCart);
      } else {
        setCart((prev) => [...prev, { product: data!, variant: selectedVariant!, quantity: 1 }]);
      }
      showMessage('Ajouté au panier', 'success');
      setTimeout(() => router.push('/cart'), 1000);
    }
  };
  return (
    <XStack bg="#fff" px={20} pb={pb ? bottom + 20 : 20} pt={10} alignItems="center">
      <SizableText fontWeight="700" fontSize={25} flex={1}>
        {selectedVariant
          ? `${selectedVariant?.price.amount} ${selectedVariant?.price.currencyCode}`
          : `${data.priceRange.minVariantPrice.amount} ${data.priceRange.minVariantPrice.currencyCode}`}
      </SizableText>

      <XStack gap={10} h={40}>
        <Button
          onPress={() => addToCart()}
          px={10}
          gap={3}
          minWidth={150}
          customIcon={<Ionicons name="cart-outline" size={20} color="#fff" />}>
          Ajouter au Panier
        </Button>
        <TamaguiButton
          onPress={() => setWishlistItem(data)}
          px={12}
          borderRadius={0}
          borderWidth={1}
          borderColor={isFavorite ? '#000' : '#EBEDF3'}
          bg="#fff"
          justifyContent="center"
          alignItems="center">
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color="#000" />
        </TamaguiButton>
      </XStack>
    </XStack>
  );
};

export default ProductFooter;
