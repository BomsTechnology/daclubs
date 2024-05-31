import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollView, SizableText, XStack, YStack } from 'tamagui';

import {
  updateCustomerAdress,
  MailingAddressInput,
  defaultCustomerAddress,
} from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import CountrySelect from '~/src/components/form/CountrySelect';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useRefreshToken from '~/src/hooks/useRefreshToken';
import useShowNotification from '~/src/hooks/useShowNotification';
import CustomError from '~/src/types/CustomError';
import { customerAtom, notificationWithStorage, tokenWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';
const Page = () => {
  const { id } = useLocalSearchParams();
  const { tokenRefresh } = useRefreshToken();
  const [token] = useAtom(tokenWithStorage);
  const [, setNotifications] = useAtom(notificationWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const { showMessage } = useShowNotification();

  const address = customer?.customer?.addresses?.edges.filter(
    (address) => address.node.id === id
  )[0];

  const [country, setCountry] = useState(address?.node.country || 'France');
  const parsedNumber = parsePhoneNumberFromString(address?.node?.phone! || '+33');
  const [phoneCode, setPhoneCode] = useState('+' + parsedNumber?.countryCallingCode);

  const { control, handleSubmit, setError } = useForm<FieldValues>({
    defaultValues: {
      phonenumber: parsedNumber?.nationalNumber,
      firstname: address?.node?.firstName,
      lastname: address?.node?.lastName,
      address1: address?.node?.address1,
      address2: address?.node?.address2,
      city: address?.node?.city,
      province: address?.node?.provinceCode,
      zip: address?.node?.zip,
      company: address?.node?.company,
    },
  });

  const mutationUpdateCustomerAdress = useMutation({
    mutationFn: (input: MailingAddressInput) =>
      updateCustomerAdress({
        token: token.token?.accessToken!,
        props: input,
        id: id as string,
      }),
    onSuccess(data, variables, context) {
      setCustomer({
        customer: {
          ...customer?.customer!,
          addresses: {
            ...customer?.customer?.addresses,
            edges: customer?.customer?.addresses?.edges.map((edge) => {
              if (edge.node.id === id) {
                return {
                  ...edge,
                  node: data,
                };
              }
              return edge;
            })!,
          },
        },
      });
      setNotifications((prev) => [
        {
          message: `Vous avez modifié votre adresse: ${address?.node.address1}, ${address?.node.city} ${address?.node.province ? address?.node.province : ''} ${address?.node.zip}, ${address?.node.country}`,
          read: false,
          title: 'Adresse mise à jour',
        },
        ...prev,
      ]);
      showMessage('Adresse mis a jour', 'success');
      router.back();
    },
    onError: (error: CustomError, variables, context) => {
      if (error.code === 'TOKEN_INVALID' || error.code === 'INVALID_MULTIPASS_REQUEST') {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        mutationUpdateCustomerAdress.mutate(variables);
      } else {
        showMessage(error.message || 'Une erreur est survenue');
      }
    },
  });

  const mutationDefaultCustomerAdress = useMutation({
    mutationFn: () =>
      defaultCustomerAddress({
        token: token.token?.accessToken!,
        id: id as string,
      }),
    onSuccess(data, variables, context) {
      setCustomer({
        customer: data,
      });
      setNotifications((prev) => [
        {
          message: `Vous avez modifié votre adresse: ${address?.node.address1}, ${address?.node.city} ${address?.node.province ? address?.node.province : ''} ${address?.node.zip}, ${address?.node.country}`,
          read: false,
          title: 'Adresse mise à jour',
        },
        ...prev,
      ]);
      showMessage('Adresse définie comme defaut', 'success');
      router.back();
    },
    onError: (error: CustomError, variables, context) => {
      if (error.code === 'TOKEN_INVALID' || error.code === 'INVALID_MULTIPASS_REQUEST') {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        mutationDefaultCustomerAdress.mutate();
      } else {
        showMessage(error.message || 'Une erreur est survenue');
      }
    },
  });

  const onSubmit = (data: FieldValues) => {
    if (!phoneCode) {
      setError('phonenumber', {
        type: 'manual',
        message: 'Le code pays est obligatoire',
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne sont pas identiques',
      });
      return;
    }
    mutationUpdateCustomerAdress.mutate({
      firstName: data.firstname,
      lastName: data.lastname,
      phone: `${phoneCode}${data.phonenumber}`,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      province: data.province,
      country,
      zip: data.zip,
      company: data.company,
    });
  };
  return (
    <>
      <CustomHeader title="Editer une  adresse" />
      <Container p={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20, paddingTop: 20 }}>
          <YStack mb={10}>
            <SizableText mb={10} fontWeight="700">
              Pays
            </SizableText>
            <CountrySelect
              value={country}
              width="100%"
              label="Choisir un pays"
              onValueChange={setCountry}
              type="country"
            />
          </YStack>
          <XStack mb={10} gap={10}>
            <YStack flex={1}>
              <SizableText fontWeight="700">Prénom</SizableText>
              <Input
                name="firstname"
                control={control}
                rules={{
                  required: 'Prénom obligatoire',
                }}
              />
            </YStack>
            <YStack flex={1}>
              <SizableText fontWeight="700">Nom</SizableText>
              <Input
                name="lastname"
                control={control}
                rules={{
                  required: 'Nom obligatoire',
                }}
              />
            </YStack>
          </XStack>
          <YStack mb={10}>
            <SizableText mb={10} fontWeight="700">
              Entreprise (facultatif)
            </SizableText>
            <Input name="company" control={control} />
          </YStack>
          <YStack mb={10}>
            <SizableText mb={10} fontWeight="700">
              Adresse
            </SizableText>
            <Input
              name="address1"
              control={control}
              rules={{
                required: 'Adresse obligatoire',
              }}
            />
          </YStack>
          <YStack mb={10}>
            <SizableText mb={10} fontWeight="700">
              Appartement, suite, batiment, etc. (facultatif)
            </SizableText>
            <Input name="address2" control={control} />
          </YStack>
          <XStack mb={10} gap={10}>
            <YStack flex={1}>
              <SizableText fontWeight="700">Ville</SizableText>
              <Input
                name="city"
                control={control}
                rules={{
                  required: 'Ville obligatoire',
                }}
              />
            </YStack>
            <YStack flex={1}>
              <SizableText fontWeight="700">Province</SizableText>
              <Input name="province" control={control} placeholder="AB" />
            </YStack>
          </XStack>
          <YStack mb={10}>
            <SizableText mb={10} fontWeight="700">
              Code postal
            </SizableText>
            <Input
              name="zip"
              control={control}
              rules={{
                required: 'Code postal obligatoire',
              }}
            />
          </YStack>
          <YStack>
            <SizableText mb={10} fontWeight="700">
              Numéro de téléphone
            </SizableText>
            <XStack alignItems="flex-start" justifyContent="flex-start" space="$2">
              <CountrySelect
                value={phoneCode}
                width="18%"
                label="Choisir un pays"
                onValueChange={setPhoneCode}
                type="phone"
              />
              <YStack width="80%">
                <Input
                  keyboardType="numeric"
                  name="phonenumber"
                  control={control}
                  rules={{
                    required: 'Numéro de téléphone est obligatoire',
                  }}
                />
              </YStack>
            </XStack>
          </YStack>
        </ScrollView>
        <YStack gap={10} bg="#fff" w="100%" p={20}>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={mutationUpdateCustomerAdress.isPending}
            disabled={
              mutationUpdateCustomerAdress.isPending || mutationDefaultCustomerAdress.isPending
            }>
            Enregistrer
          </Button>
          <Button
            bg="#0019FF"
            onPress={() => mutationDefaultCustomerAdress.mutate()}
            loading={mutationDefaultCustomerAdress.isPending}
            disabled={
              mutationDefaultCustomerAdress.isPending || mutationUpdateCustomerAdress.isPending
            }>
            Definir par defaut
          </Button>
        </YStack>
      </Container>
    </>
  );
};

export default Page;
