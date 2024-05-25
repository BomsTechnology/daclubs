import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { SizableText, XStack, Button as TamaguiButton } from 'tamagui';

import { addLineCart, createCart, updateLineCart } from '~/src/api/cart';
import Button from '~/src/components/form/Button';
import useShowNotification from '~/src/hooks/useShowNotification';
import useUpdateBuyerIdentity from '~/src/hooks/useUpdateBuyerIdentity';
import { CartLineProps } from '~/src/types/CheckoutProps';
import { MainProductProps, ProductCartProps, VariantProps } from '~/src/types/ProductProps';
import {
  cartWithStorage,
  checkoutWithStorage,
  customerAtom,
  tokenWithStorage,
} from '~/src/utils/storage';

const ProductFooter = ({
  data,
  selectedVariant,
  wishlist,
  setWishlistItem,
  selectedSize,
}: {
  data: MainProductProps;
  selectedVariant?: VariantProps;
  wishlist: MainProductProps[];
  selectedSize: string;
  setWishlistItem: (item: MainProductProps) => void;
}) => {
  const { showMessage } = useShowNotification();
  const { customerAddresses, customerDeliveryPreferences } = useUpdateBuyerIdentity();
  const [customer] = useAtom(customerAtom);
  const [token] = useAtom(tokenWithStorage);
  const [cart, setCart] = useAtom(cartWithStorage);
  const [checkout, setCheckout] = useAtom(checkoutWithStorage);
  const isFavorite = wishlist.some((item) => item.id === data.id);

  const mutationAddLineCart = useMutation({
    mutationFn: () =>
      addLineCart({
        lines: [
          {
            attributes: [],
            merchandiseId: selectedVariant?.id!,
            quantity: 1,
          },
        ],
        cartId: checkout?.id!,
      }),
    onSuccess(checkout, variables, context) {
      setCheckout(checkout);
      setCart((prev) => [...prev, { product: data!, variant: selectedVariant!, quantity: 1 }]);
      showMessage('Ajouté au panier', 'success');
      setTimeout(() => router.push('/cart'), 1000);
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const mutationUpdateLineCart = useMutation({
    mutationFn: ({
      cart,
      quantity,
      lineId,
    }: {
      cart: ProductCartProps[];
      quantity: number;
      lineId: string;
    }) =>
      updateLineCart({
        lines: [
          {
            attributes: [],
            merchandiseId: selectedVariant?.id!,
            quantity,
            id: lineId,
          },
        ],
        cartId: checkout?.id!,
      }),
    onSuccess(checkout, variables, context) {
      setCheckout(checkout);
      setCart([...variables.cart]);
      showMessage('Ajouté au panier', 'success');
      setTimeout(() => router.push('/cart'), 1000);
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const mutationCreateCart = useMutation({
    mutationFn: () =>
      createCart({
        lines: [
          {
            attributes: [],
            merchandiseId: selectedVariant?.id!,
            quantity: 1,
          },
        ],
        note: 'Product From mobile App',
        metafields: [],
        attributes: [],
        discountCodes: [],
        buyerIdentity:
          !customer.customer || !token.token
            ? undefined
            : {
                email: customer.customer.email!,
                phone: customer.customer.phone,
                customerAccessToken: token.token!.accessToken,
                //deliveryAddressPreferences: customerAddresses,
                countryCode: customer.customer.defaultAddress?.countryCodeV2 || 'FR',
                //preferences: {
                //  delivery: customerDeliveryPreferences,
                //},
              },
      }),
    onSuccess(checkout, variables, context) {
      setCheckout(checkout);
      setCart([{ product: data!, variant: selectedVariant!, quantity: 1 }]);
      showMessage('Ajouté au panier', 'success');
      setTimeout(() => router.push('/cart'), 1000);
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const addToCart = async () => {
    if (!selectedSize) {
      showMessage('Veuillez choisir une taille');
    } else {
      let alreadyInCart = false;
      let quantity = 1;
      let line: CartLineProps | undefined = undefined;
      const newCart = cart.map((item) => {
        if (item.product.id === data!.id && item.variant.id === selectedVariant!.id) {
          alreadyInCart = true;
          item.quantity = item.quantity + 1;
          const chekoutItem = checkout?.lines.edges.filter(
            (line) => line.node.merchandise.id === item.variant.id
          )[0];
          if (chekoutItem) line = chekoutItem.node;
          quantity = item.quantity;
          return item;
        }
        return item;
      });
      if (checkout) {
        if (alreadyInCart) {
          mutationUpdateLineCart.mutate({ cart: newCart, quantity, lineId: line!.id });
        } else {
          mutationAddLineCart.mutate();
        }
      } else {
        mutationCreateCart.mutate();
      }
    }
  };
  return (
    <XStack bg="#fff" px={20} pb={20} pt={10} alignItems="center">
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
          loading={
            mutationAddLineCart.isPending ||
            mutationCreateCart.isPending ||
            mutationUpdateLineCart.isPending
          }
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
