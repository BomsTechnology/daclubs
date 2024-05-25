import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useState } from 'react';
import { FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, SizableText, XStack } from 'tamagui';

import { deleteAccessToken } from '~/src/api/customer';
import AccountHeader from '~/src/components/header/AccountHeader';
import CustomHeader from '~/src/components/header/CustomHeader';
import ConfirmModal from '~/src/components/modal/ConfirmModal';
import useShowNotification from '~/src/hooks/useShowNotification';
import { queryClient } from '~/src/utils/queryClient';
import { tokenWithStorage, customerAtom } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { showMessage } = useShowNotification();
  const [token, setToken] = useAtom(tokenWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const mutationdeleteAccessToken = useMutation({
    mutationFn: (token: string) => deleteAccessToken(token),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['customer', token.token?.accessToken] });
      setCustomer({});
      setToken(RESET);
      showMessage('Deconnexion reussie', 'success');
    },
    onError: (error: any) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const ITEM = [
    {
      title: 'Mes commandes',
      icon: <Ionicons name="bag-outline" size={20} color="black" />,
      action: () => router.push('/account/order/'),
      isAuth: true,
    },
    {
      title: 'Mes adresses',
      icon: <Ionicons name="location-outline" size={20} color="black" />,
      action: () => router.push('/account/adress/'),
      isAuth: true,
    },
    {
      title: 'FAQ',
      icon: <Ionicons name="help-circle-outline" size={25} color="black" />,
      action: () => router.push('/account/faq'),
      isAuth: false,
    },
    {
      title: 'Se deconnecter',
      icon: <Ionicons name="log-in-outline" size={20} color="#ff797970" />,
      color: '#ff797970',
      action: () => {
        setIsModalVisible(true);
      },
      isAuth: true,
    },
  ];

  const filterItem = customer.customer ? ITEM : ITEM.filter((item) => item.isAuth === false);

  const ListItem = ({
    title,
    icon,
    action,
    color,
  }: {
    title: string;
    icon: JSX.Element;
    action?: () => void;
    color?: string;
  }) => {
    return (
      <Button
        onPress={action}
        unstyled
        w="100%"
        flexDirection="row"
        p={20}
        borderBottomWidth={1}
        borderColor="#EBEDF3"
        alignItems="center"
        justifyContent="space-between">
        <XStack gap={10}>
          {icon}
          <SizableText fontWeight="500" color={color ? color : 'black'}>
            {title}
          </SizableText>
        </XStack>
        <Ionicons name="chevron-forward" size={20} color={color ? color : 'black'} />
      </Button>
    );
  };

  return (
    <>
      <Spinner visible={mutationdeleteAccessToken.isPending} />
      <CustomHeader title="Mon compte" icon={<Ionicons name="person" size={20} color="black" />} />
      <Container p={0}>
        <AccountHeader customer={customer.customer} />
        <FlatList
          data={filterItem}
          renderItem={({ item }) => (
            <ListItem title={item.title} icon={item.icon} action={item.action} color={item.color} />
          )}
          keyExtractor={(item) => item.title}
        />
      </Container>
      <ConfirmModal
        title="Se deconnecter"
        description="Etes-vous sur de vouloir vous deconnecter ?"
        confirmText="Annuler"
        cancelText="Se deconnecter"
        onCancel={() => {
          setIsModalVisible(false);
          mutationdeleteAccessToken.mutate(token.token?.accessToken!);
        }}
        onConfirm={() => setIsModalVisible(false)}
        open={isModalVisible}
      />
    </>
  );
};

export default Page;
