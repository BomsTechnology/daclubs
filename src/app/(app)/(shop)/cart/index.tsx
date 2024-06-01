import { Ionicons } from '@expo/vector-icons';
import {
  CheckoutCompletedEvent,
  PixelEvent,
  useShopifyCheckoutSheet,
} from '@shopify/checkout-sheet-kit';
import { FlashList } from '@shopify/flash-list';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';

import { createCart } from '~/src/api/cart';
import CartProductCard from '~/src/components/card/CartProductCard';
import Button from '~/src/components/form/Button';
import CustomHeader from '~/src/components/header/CustomHeader';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import useShowNotification from '~/src/hooks/useShowNotification';
import { ProductCartProps } from '~/src/types/ProductProps';
import { queryClient } from '~/src/utils/queryClient';
import { cartWithStorage, orderWithStorage, tokenWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const shopifyCheckout = useShopifyCheckoutSheet();
  const { showMessage } = useShowNotification();
  const [token] = useAtom(tokenWithStorage);
  const [cart, setCart] = useAtom(cartWithStorage);
  const [, setOrders] = useAtom(orderWithStorage);
  const lines = cart.map((item) => ({
    attributes: [],
    merchandiseId: item.variant.id,
    quantity: item.quantity,
  }));
  const total = cart.reduce((acc, item) => acc + item.quantity * item.variant.price.amount, 0);

  const mutationCreateCart = useMutation({
    mutationFn: () =>
      createCart({
        lines,
        note: 'Order From mobile App',
        metafields: [],
        attributes: [],
        discountCodes: [],
        buyerIdentity: !token.token
          ? undefined
          : {
              customerAccessToken: token.token!.accessToken,
            },
      }),
    onSuccess(checkout, variables, context) {
      if (checkout) {
        shopifyCheckout.present(checkout.checkoutUrl);
      } else {
        showMessage('Une erreur est survenue');
      }
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const onDelete = (item: ProductCartProps) => {
    setCart((prev) => prev.filter((prod) => prod.variant.id !== item.variant.id));
  };

  const onIncrement = (item: ProductCartProps) => {
    setCart((prev) =>
      prev.map((prod) => {
        if (prod.product.id === item.product.id && prod.variant.id === item.variant.id) {
          return {
            ...prod,
            quantity: prod.quantity + 1,
          };
        }
        return prod;
      })
    );
  };

  const onDecrement = (item: ProductCartProps) => {
    setCart((prev) =>
      prev.map((prod) => {
        if (prod.product.id === item.product.id && prod.variant.id === item.variant.id) {
          return {
            ...prod,
            quantity: prod.quantity === 1 ? 1 : prod.quantity - 1,
          };
        }
        return prod;
      })
    );
  };

  useEffect(() => {
    const close = shopifyCheckout.addEventListener('close', () => {
      // Do something on checkout close
    });

    const completed = shopifyCheckout.addEventListener(
      'completed',
      (event: CheckoutCompletedEvent) => {
        setOrders((prev) => [...prev, event.orderDetails]);
        setCart([]);
        queryClient.invalidateQueries({ queryKey: ['customer', token.token?.accessToken] });
        router.push({
          pathname: '/cart/payment-success',
          params: { orderId: event.orderDetails.id },
        });
      }
    );

    const error = shopifyCheckout.addEventListener('error', (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    });

    const pixel = shopifyCheckout.addEventListener('pixel', (event: PixelEvent) => {
      // Dispatch web pixel events to third-party services
      //if (hasPermissionToTrack) {
      // sendEventToAnalyticsProvider(event);
      //}
    });

    return () => {
      close?.remove();
      completed?.remove();
      error?.remove();
      pixel?.remove();
    };
  }, [shopifyCheckout]);

  return (
    <>
      <CustomHeader
        title="Panier"
        description={`(${cart.length} Produit${cart.length > 1 ? 's' : ''})`}
        icon={<Ionicons name="cart" size={20} color="black" />}
      />
      {cart.length > 0 ? (
        <>
          <Container>
            <FlashList
              data={cart}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }: { item: ProductCartProps; index: number }) => (
                <CartProductCard
                  {...item}
                  onDelete={() => onDelete(item)}
                  onIncrement={() => onIncrement(item)}
                  onDecrement={() => onDecrement(item)}
                />
              )}
              estimatedItemSize={100}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </Container>
          <XStack bg="#fff" px={20} py={10}>
            <YStack flex={1}>
              <SizableText color="#009BF1">Total :</SizableText>
              <SizableText fontWeight="700" fontSize={25}>
                {total} {cart[0].variant.price.currencyCode}
              </SizableText>
            </YStack>
            <Button
              loading={mutationCreateCart.isPending}
              disabled={mutationCreateCart.isPending}
              minWidth={150}
              onPress={() => mutationCreateCart.mutate()}>
              Passer la commande
            </Button>
          </XStack>
        </>
      ) : (
        <>
          <EmptyScreen message="Votre panier est vide" />
        </>
      )}
    </>
  );
};

export default Page;
