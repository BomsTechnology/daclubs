import { useAtom } from 'jotai';
import { FlatList } from 'react-native';

import OrderCard from '~/src/components/card/OrderCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import { customerAtom, orderWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const [customer] = useAtom(customerAtom);
  const [orders] = useAtom(orderWithStorage);
  return (
    <>
      <CustomHeader title="Mes commandes" />
      <Container>
        {customer.customer &&
        customer.customer!.orders?.edges &&
        customer.customer!.orders?.edges.length > 0 ? (
          <FlatList
            data={customer.customer!.orders?.edges}
            renderItem={({ item }) => (
              <OrderCard
                orderNumber={item.node.name}
                id={item.node.id}
                name={`${item.node.billingAddress.name}`}
                date={item.node.processedAt}
                quantity={item.node.lineItems.edges.length}
                address={`${item.node.billingAddress.address1}, ${item.node.billingAddress.city}, ${item.node.billingAddress.province}, ${item.node.billingAddress.zip}, ${item.node.billingAddress.country}`}
                price={`${item.node.totalPrice.amount} ${item.node.totalPrice.currencyCode}`}
              />
            )}
          />
        ) : orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <OrderCard
                orderNumber={`#${item?.id.replace('gid://shopify/OrderIdentity/', '')}`}
                id={item.id}
                name={`${item.billingAddress!.firstName} ${item.billingAddress!.lastName}`}
                quantity={item.cart.lines.length}
                address={`${item.billingAddress!.address1}, ${item.billingAddress!.city} ${item.billingAddress!.zoneCode} ${item.billingAddress!.postalCode}, ${item.billingAddress!.countryCode}`}
                price={`${item.cart.price.total?.amount} ${item.cart.price.total?.currencyCode}`}
              />
            )}
          />
        ) : (
          <EmptyScreen message="Vous n'avez pas encore de commandes" />
        )}
      </Container>
    </>
  );
};

export default Page;
