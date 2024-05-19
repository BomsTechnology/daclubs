import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, SizableText, XStack } from 'tamagui';

import { getCustomer, deleteAccessToken } from '~/src/api/customer';
import AccountHeader from '~/src/components/header/AccountHeader';
import CustomHeader from '~/src/components/header/CustomHeader';
import useRefreshToken from '~/src/hooks/useRefreshToken';
import useShowNotification from '~/src/hooks/useShowNotification';
import CustomError from '~/src/types/CustomError';
import { tokenWithStorage, customerAtom } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { tokenRefresh } = useRefreshToken();
  const { showMessage } = useShowNotification();
  const [token, setToken] = useAtom(tokenWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const { refetch, status, error, data } = useQuery({
    queryKey: ['customer', token.token?.accessToken],
    queryFn: () => getCustomer(token.token?.accessToken!),
  });

  useEffect(() => {
    if (status === 'success') {
      setCustomer({
        customer: data,
      });
    } else if (status === 'error') {
      if (
        (error as CustomError).code === 'TOKEN_INVALID' ||
        (error as CustomError).code === 'INVALID_MULTIPASS_REQUEST'
      ) {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        refetch();
      }
    }
  }, [status]);

  const mutationdeleteAccessToken = useMutation({
    mutationFn: (token: string) => deleteAccessToken(token),
    onSuccess(data, variables, context) {
      refetch();
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
        mutationdeleteAccessToken.mutate(token.token?.accessToken!);
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
      <Spinner
        visible={(token.token && status === 'pending') || mutationdeleteAccessToken.isPending}
      />
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
    </>
  );
};

export default Page;
