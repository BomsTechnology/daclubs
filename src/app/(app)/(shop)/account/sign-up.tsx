import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useAtom } from 'jotai';
import { FieldValues, useForm } from 'react-hook-form';
import { SizableText, YStack, ScrollView, XStack } from 'tamagui';

import {
  createCustomer,
  CustomerCreateInput,
  createAccessToken,
  CustomerAccessTokenCreateInput,
} from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useShowNotification from '~/src/hooks/useShowNotification';
import { customerWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

export default function Page() {
  const [, setCustomer] = useAtom(customerWithStorage);
  const { showMessage } = useShowNotification();
  const { control, handleSubmit, setError } = useForm<FieldValues>({
    defaultValues: {
      isocode: '+33',
      phonenumber: '',
    },
  });

  const mutationCreateCustomer = useMutation({
    mutationFn: (input: CustomerCreateInput) => createCustomer(input),
    onSuccess(data, variables, context) {
      setCustomer({
        customer: data,
      });
      mutationCreateAccessToken.mutate({
        email: variables.email,
        password: variables.password,
      });
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const mutationCreateAccessToken = useMutation({
    mutationFn: (input: CustomerAccessTokenCreateInput) => createAccessToken(input),
    onSuccess(data, variables, context) {
      setCustomer({
        token: data,
      });
      showMessage('Votre compte a bien été crée', 'success');
      router.push('/account/');
    },
    onError: (error: any) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const onSubmit = (data: FieldValues) => {
    if (!data.isocode) {
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
    mutationCreateCustomer.mutate({
      firstName: data.firstname,
      lastName: data.lastname,
      acceptsMarketing: true,
      email: data.email,
      phone: `${data.isocode}${data.phonenumber}`,
      password: data.password,
    });
  };
  return (
    <>
      <CustomHeader title="S'inscrire" />
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
            <XStack alignItems="center" justifyContent="flex-start" space="$2">
              <Input
                maxLength={5}
                keyboardType="numeric"
                width="18%"
                name="isocode"
                textAlign="center"
                control={control}
              />
              <Input
                keyboardType="numeric"
                name="phonenumber"
                width="80%"
                control={control}
                rules={{
                  required: 'Numéro de téléphone est obligatoire',
                }}
              />
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
          <XStack justifyContent="center" mb={10} alignItems="center" flexWrap="wrap" gap="$2">
            <SizableText color="$gray12">Vous avez deja un compte ?</SizableText>
            <Link href={{ pathname: '/account/sign-in' }} asChild>
              <SizableText fontWeight="700">Se connecter</SizableText>
            </Link>
          </XStack>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={mutationCreateCustomer.isPending || mutationCreateAccessToken.isPending}
            disabled={mutationCreateCustomer.isPending || mutationCreateAccessToken.isPending}>
            S'inscrire
          </Button>
        </ScrollView>
      </Container>
    </>
  );
}
