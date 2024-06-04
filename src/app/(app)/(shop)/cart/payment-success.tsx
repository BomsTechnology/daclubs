import { router, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H4, SizableText, YStack } from 'tamagui';

import OrderSuccessProductCard from '~/src/components/card/OrderSuccessProductCard';
import Button from '~/src/components/form/Button';
import { orderWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const PaymentSuccess = () => {
  const { top } = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams();
  const [orders] = useAtom(orderWithStorage);
  const order = orders.filter((item) => item.id === orderId)[0];
  return (
    <>
      <Container pt={top + 40} justifyContent="center" alignItems="center">
        <Image
          source={require('~/assets/images/payment.png')}
          resizeMode="contain"
          style={{ height: 150 }}
        />
        <H4 mt={10} textAlign="center">
          Votre commande a été passée avec succès !
        </H4>
        <SizableText textAlign="center" mb={10}>
          Nous traitons votre commande avec le plus grand soin et vous tiendrons informé(e) de son
          expédition.
        </SizableText>
        <SizableText textAlign="center" mb={10}>
          Numéro de commande : {`#${order?.id.replace('gid://shopify/OrderIdentity/', '')}`}
        </SizableText>
        <SizableText textAlign="center" mb={10}>
          Montant : {`#${order?.cart.price.total?.amount} ${order?.cart.price.total?.currencyCode}`}
        </SizableText>
        <FlatList
          data={order.cart.lines}
          contentContainerStyle={{ width: '100%' }}
          style={{ width: '100%' }}
          renderItem={({ item }) => <OrderSuccessProductCard {...item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </Container>
      <YStack bg="#fff" w="100%" p={20} onPress={() => router.back()}>
        <Button>Retour</Button>
      </YStack>
    </>
  );
};

export default PaymentSuccess;
