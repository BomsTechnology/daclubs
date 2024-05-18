import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useAtom } from 'jotai';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import CartProductCard from '~/src/components/card/CartProductCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import { ProductCartProps } from '~/src/types/ProductProps';
import { cartWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const [cart, setCart] = useAtom(cartWithStorage);
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
          <XStack bg="#F8F9FA" px={20} pb={10}>
            <YStack flex={1}>
              <SizableText color="#009BF1">Total :</SizableText>
              <SizableText fontWeight="700" fontSize={25}>
                {total} {cart[0].variant.price.currencyCode}
              </SizableText>
            </YStack>
            <Button bg="#000" borderRadius={0}>
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
