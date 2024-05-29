import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollView, SizableText, XStack, YStack } from 'tamagui';

import { createCustomerAdress, MailingAddressInput } from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import CountrySelect from '~/src/components/form/CountrySelect';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useRefreshToken from '~/src/hooks/useRefreshToken';
import useShowNotification from '~/src/hooks/useShowNotification';
import CustomError from '~/src/types/CustomError';
import { customerAtom, notificationWithStorage, tokenWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';
const AddAdressPage = () => {
  const { tokenRefresh } = useRefreshToken();
  const [token] = useAtom(tokenWithStorage);
  const [, setNotifications] = useAtom(notificationWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const { showMessage } = useShowNotification();
  const { control, handleSubmit, setError } = useForm();
  const [country, setCountry] = useState('France');
  const [phoneCode, setPhoneCode] = useState('+33');

  const mutationCreateCustomerAdress = useMutation({
    mutationFn: (input: MailingAddressInput) =>
      createCustomerAdress({
        token: token.token?.accessToken!,
        props: input,
      }),
    onSuccess(data, variables, context) {
      setCustomer({
        customer: {
          ...customer.customer!,
          addresses: {
            edges: [
              ...(customer.customer!.addresses!.edges || []),
              {
                cursor: data.id,
                node: data,
              },
            ],
          },
        },
      });
      setNotifications((prev) => [
        ...prev,
        {
          message: `Vous avez modifié votre adresse: ${variables.address1}, ${variables.city} ${variables.province ? variables.province : ''} ${variables.zip}, ${variables.country}`,
          read: false,
          title: 'Nouvelle adresse',
        },
      ]);
      showMessage('Adresse ajouté', 'success');
      router.back();
    },
    onError: (error: CustomError, variables, context) => {
      if (error.code === 'TOKEN_INVALID' || error.code === 'INVALID_MULTIPASS_REQUEST') {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        mutationCreateCustomerAdress.mutate(variables);
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
    mutationCreateCustomerAdress.mutate({
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
      <CustomHeader title="Ajouter une nouvelle adresse" />
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
            loading={mutationCreateCustomerAdress.isPending}
            disabled={mutationCreateCustomerAdress.isPending}>
            Enregistrer
          </Button>
        </YStack>
      </Container>
    </>
  );
};

export default AddAdressPage;
