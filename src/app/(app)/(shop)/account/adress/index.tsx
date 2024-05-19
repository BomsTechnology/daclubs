import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAtom } from 'jotai';
import { FlatList } from 'react-native';
import { Button, SizableText } from 'tamagui';

import AdressCard from '~/src/components/card/AddressCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import { customerAtom } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const AdressPage = () => {
  const [customer] = useAtom(customerAtom);
  return (
    <>
      <CustomHeader title="Mes adresses" />
      <Container>
        <FlatList
          data={customer.customer!.addresses?.edges}
          renderItem={({ item }) => (
            <AdressCard
              {...item.node}
              isDefault={item.node.id === customer.customer?.defaultAddress?.id}
            />
          )}
          extraData={[customer.customer?.defaultAddress]}
        />
        <Link href="/account/adress/add" asChild>
          <Button
            flexDirection="row"
            unstyled
            justifyContent="center"
            alignItems="center"
            py={8}
            flexWrap="wrap">
            <Ionicons name="add" size={20} color="#0019FF" />
            <SizableText color="#0019FF" fontWeight="700">
              Ajouter une nouvelle adresse
            </SizableText>
          </Button>
        </Link>
      </Container>
    </>
  );
};

export default AdressPage;
