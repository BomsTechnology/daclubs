import { CheckoutCompletedEvent } from '@shopify/checkout-sheet-kit';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import React from 'react';
import { Text, FlatList } from 'react-native';
import { SizableText } from 'tamagui';

import OrderListProductCard from '~/src/components/card/OrderListProductCard';
import OrderSuccessProductCard from '~/src/components/card/OrderSuccessProductCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import { OrderProps } from '~/src/types/CustomerProps';
import { customerAtom, orderWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

type OrderDetails = CheckoutCompletedEvent.OrderDetails;

const Page = () => {
  const { id } = useLocalSearchParams();
  const [customer] = useAtom(customerAtom);
  const [orders] = useAtom(orderWithStorage);
  const order = customer.customer
    ? customer.customer.orders?.edges.filter((item) => item.node.id === id)[0].node
    : orders.filter((item) => item.id === id)[0];
  return (
    <>
      <CustomHeader
        title={`Commande: ${customer.customer ? (order as OrderProps).name : `#${order!.id.replace('gid://shopify/OrderIdentity/', '')}`}`}
      />
      <Container justifyContent="center" alignItems="center">
      <SizableText fontWeight="700" textAlign="center" fontSize={20}>
          {customer.customer
            ? `${(order as OrderProps).totalPrice.amount} ${(order as OrderProps).totalPrice.currencyCode}`
            : `${(order as OrderDetails).cart.price.total?.amount} ${(order as OrderDetails).cart.price.total?.currencyCode}`}
        </SizableText>
        <SizableText fontWeight="600" textAlign="center" fontSize={18}>
          {order?.billingAddress!.firstName} {order?.billingAddress!.lastName}
        </SizableText>
        <SizableText textAlign="center" mb={10}>
          {order?.billingAddress!.address1} {order?.billingAddress!.city}
          {customer.customer
            ? ` ${(order as OrderProps)?.billingAddress!.provinceCode} ${(order as OrderProps)?.billingAddress!.country} ${(order as OrderProps)?.billingAddress!.zip}`
            : ` ${(order as OrderDetails)?.billingAddress!.zoneCode} ${(order as OrderDetails)?.billingAddress!.countryCode} ${(order as OrderDetails)?.billingAddress!.postalCode}`}
        </SizableText>
        {customer.customer ? (
          <FlatList
            data={(order as OrderProps).lineItems.edges}
            contentContainerStyle={{ width: '100%' }}
            style={{ width: '100%' }}
            renderItem={({ item }) => <OrderListProductCard {...item.node} />}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={(order as OrderDetails).cart.lines}
            contentContainerStyle={{ width: '100%' }}
            style={{ width: '100%' }}
            renderItem={({ item }) => <OrderSuccessProductCard {...item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </Container>
    </>
  );
};

export default Page;
