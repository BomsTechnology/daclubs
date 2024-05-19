import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { SizableText, YStack, ScrollView, XStack } from 'tamagui';

import { CustomerCreateInput, updateCustomer } from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import CountrySelect from '~/src/components/form/CountrySelect';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useRefreshToken from '~/src/hooks/useRefreshToken';
import useShowNotification from '~/src/hooks/useShowNotification';
import CustomError from '~/src/types/CustomError';
import { tokenWithStorage, customerAtom } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

export default function Page() {
  const { tokenRefresh } = useRefreshToken();
  const [token, setToken] = useAtom(tokenWithStorage);
  const [customer, setCustomer] = useAtom(customerAtom);
  const { showMessage } = useShowNotification();
  const parsedNumber = parsePhoneNumberFromString(customer.customer?.phone!);
  const [phoneCode, setPhoneCode] = useState('+' + parsedNumber?.countryCallingCode);
  const { control, handleSubmit, setError } = useForm<FieldValues>({
    defaultValues: {
      phonenumber: parsedNumber?.nationalNumber,
      firstname: customer.customer?.firstName,
      lastname: customer.customer?.lastName,
      email: customer.customer?.email,
      password: '',
      confirmPassword: '',
    },
  });

  const mutationUpdateCustomer = useMutation({
    mutationFn: (input: CustomerCreateInput) =>
      updateCustomer({
        token: token.token?.accessToken!,
        props: input,
      }),
    onSuccess(data, variables, context) {
      setCustomer({
        customer: data.customer,
      });
      setToken({
        token: data.customerAccessToken,
      });
      showMessage('Votre profil a bien été mis a jour', 'success');
    },
    onError: (error: CustomError, variables, context) => {
      if (error.code === 'TOKEN_INVALID' || error.code === 'INVALID_MULTIPASS_REQUEST') {
        tokenRefresh.mutate();
        showMessage('Veillez patienter...', 'normal');
        mutationUpdateCustomer.mutate(variables);
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
    mutationUpdateCustomer.mutate({
      firstName: data.firstname,
      lastName: data.lastname,
      acceptsMarketing: true,
      email: data.email,
      phone: `${phoneCode}${data.phonenumber}`,
      password: data.password,
    });
  };
  return (
    <>
      <CustomHeader title="Editer mon profil" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack mt={20}>
            <SizableText mb={10} fontWeight="700">
              Prénom
            </SizableText>
            <Input
              name="firstname"
              control={control}
              rules={{
                required: 'Prénom obligatoire',
              }}
            />
          </YStack>
          <YStack mt={10}>
            <SizableText mb={10} fontWeight="700">
              Nom
            </SizableText>
            <Input
              name="lastname"
              control={control}
              rules={{
                required: 'Nom obligatoire',
              }}
            />
          </YStack>
          <YStack mt={10}>
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
          <YStack mt={10}>
            <SizableText mb={10} fontWeight="700">
              Adresse E-mail
            </SizableText>
            <Input
              name="email"
              control={control}
              rules={{
                required: 'Email obligatoire',
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Email invalide',
                },
              }}
            />
          </YStack>
          <YStack mt={10}>
            <SizableText mb={10} fontWeight="700">
              Mot de passe
            </SizableText>
            <Input
              name="password"
              control={control}
              secureTextEntry
              rules={{
                required: 'Mot de passe obligatoire',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
              }}
            />
          </YStack>
          <YStack mt={10} mb={30}>
            <SizableText mb={10} fontWeight="700">
              Confirmer le mot de passe
            </SizableText>
            <Input
              name="confirmPassword"
              control={control}
              secureTextEntry
              rules={{
                required: 'Confirmation de mot de passe obligatoire',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
              }}
            />
          </YStack>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={mutationUpdateCustomer.isPending}
            disabled={mutationUpdateCustomer.isPending}>
            Editer
          </Button>
        </ScrollView>
      </Container>
    </>
  );
}
