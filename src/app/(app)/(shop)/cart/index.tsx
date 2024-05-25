import { Ionicons } from '@expo/vector-icons';
import {
  CheckoutCompletedEvent,
  CheckoutErrorCode,
  PixelEvent,
  useShopifyCheckoutSheet,
} from '@shopify/checkout-sheet-kit';
import { FlashList } from '@shopify/flash-list';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useCallback, useEffect } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import CartProductCard from '~/src/components/card/CartProductCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import { ProductCartProps } from '~/src/types/ProductProps';
import { cartWithStorage, checkoutWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const shopifyCheckout = useShopifyCheckoutSheet();
  const [cart, setCart] = useAtom(cartWithStorage);
  const [checkout, setCheckout] = useAtom(checkoutWithStorage);
  const total = cart.reduce((acc, item) => acc + item.quantity * item.variant.price.amount, 0);
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
        // Lookup order on checkout completion
        console.log(event);
        const orderId = event.orderDetails.id;
      }
    );

    const error = shopifyCheckout.addEventListener('error', (error) => {
      // Do something on checkout error
      console.log(error);
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

  const handleCheckout = useCallback(() => {
    if (checkout?.checkoutUrl) {
      shopifyCheckout.present(checkout?.checkoutUrl);
    }
  }, []);

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
          <XStack bg="#fff" px={20} pb={10}>
            <YStack flex={1}>
              <SizableText color="#009BF1">Total :</SizableText>
              <SizableText fontWeight="700" fontSize={25}>
                {total} {cart[0].variant.price.currencyCode}
              </SizableText>
            </YStack>
            <Button bg="#000" borderRadius={0} onPress={handleCheckout}>
              <SizableText color="#fff" fontWeight="700">
                Passer la commande
              </SizableText>
            </Button>
          </XStack>
        </>
      ) : (
        <EmptyScreen message="Votre panier est vide" />
      )}
    </>
  );
};

export default Page;
