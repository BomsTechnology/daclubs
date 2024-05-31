import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { Button, SizableText } from 'tamagui';

import { deleteCustomerAdress } from '~/src/api/customer';
import AdressCard from '~/src/components/card/AddressCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import ConfirmModal from '~/src/components/modal/ConfirmModal';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import useRefreshToken from '~/src/hooks/useRefreshToken';
import useShowNotification from '~/src/hooks/useShowNotification';
import CustomError from '~/src/types/CustomError';
import { AddressProps } from '~/src/types/CustomerProps';
import { customerAtom, notificationWithStorage, tokenWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const AdressPage = () => {
  const { showMessage } = useShowNotification();
  const { tokenRefresh } = useRefreshToken();
  const [notifications, setNotifications] = useAtom(notificationWithStorage);
  const [token] = useAtom(tokenWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const mutationDeleteCustomerAdress = useMutation({
    mutationFn: (id: string) =>
      deleteCustomerAdress({
        token: token.token?.accessToken!,
        id,
      }),
    onSuccess(data, variables, context) {
      let address: AddressProps | undefined = undefined;
      setCustomer({
        customer: {
          ...customer?.customer!,
          addresses: {
            ...customer?.customer?.addresses,
            edges: customer?.customer?.addresses?.edges.filter((edge) => {
              if (edge.node.id === variables) address = edge.node;
              return edge.node.id !== variables;
            })!,
          },
        },
      });
      setNotifications((prev) => [
        {
          message: `Vous avez supprimé votre adresse: ${address!.address1}, ${address!.city} ${address!.province ? address!.province : ''} ${address!.zip}, ${address!.country}`,
          read: false,
          title: 'Adresse supprimée',
        },
        ...prev,
      ]);
      showMessage('Adresse supprimée', 'success');
    },
    onError: (error: CustomError, variables, context) => {
      if (error.code === 'TOKEN_INVALID' || error.code === 'INVALID_MULTIPASS_REQUEST') {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        mutationDeleteCustomerAdress.mutate(variables);
      } else {
        showMessage(error.message || 'Une erreur est survenue');
      }
    },
  });

  return (
    <>
      <CustomHeader title="Mes adresses" />
      <Container>
        {customer.customer &&
        customer.customer!.addresses?.edges &&
        customer.customer!.addresses?.edges.length > 0 ? (
          <FlatList
            data={customer.customer!.addresses?.edges}
            renderItem={({ item }) => (
              <AdressCard
                {...item.node}
                isDefault={item.node.id === customer.customer?.defaultAddress?.id}
                onDelete={() => mutationDeleteCustomerAdress.mutate(item.node.id)}
              />
            )}
          />
        ) : (
          <EmptyScreen message="Vous n'avez aucune adresse enregistrée" />
        )}
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
      <ConfirmModal
        title="Se deconnecter"
        description="Etes-vous sur de vouloir vous deconnecter ?"
        confirmText="Annuler"
        cancelText="Se deconnecter"
        onCancel={() => {
          setIsModalVisible(false);
          //mutationdeleteAccessToken.mutate(token.token?.accessToken!);
        }}
        onConfirm={() => setIsModalVisible(false)}
        open={isModalVisible}
      />
    </>
  );
};

export default AdressPage;
