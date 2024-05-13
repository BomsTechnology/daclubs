import { Ionicons } from '@expo/vector-icons';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import CustomHeader from '~/src/components/header/CustomHeader';
import CartProductCard from '~/src/components/card/CartProductCard';
import { Container } from '~/tamagui.config';

const Page = () => {
  return (
    <>
      <CustomHeader
        title="Panier"
        description="(2 Products)"
        icon={<Ionicons name="cart" size={20} color="black" />}
      />
      <Container gap={10}>
        <CartProductCard />
        <CartProductCard />
      </Container>
      <XStack bg="#F8F9FA" px={20} pb={10}>
        <YStack flex={1}>
          <SizableText color="#009BF1">Total</SizableText>
          <SizableText fontWeight="700" fontSize={25}>
            € 200
          </SizableText>
        </YStack>
        <Button bg="#000" borderRadius={0}>
          <SizableText color="#fff" fontWeight="700">
            Passer la commande
          </SizableText>
        </Button>
      </XStack>
    </>
  );
};

export default Page;
