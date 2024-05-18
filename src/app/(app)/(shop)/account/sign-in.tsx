import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useAtom } from 'jotai';
import { FieldValues, useForm } from 'react-hook-form';
import { SizableText, YStack, ScrollView, XStack } from 'tamagui';

import { createAccessToken, CustomerAccessTokenCreateInput } from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useShowNotification from '~/src/hooks/useShowNotification';
import { queryClient } from '~/src/utils/queryClient';
import { tokenWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

export default function Page() {
  const [, setToken] = useAtom(tokenWithStorage);
  const { showMessage } = useShowNotification();
  const { control, handleSubmit } = useForm();
  const mutationCreateAccessToken = useMutation({
    mutationFn: (input: CustomerAccessTokenCreateInput) => createAccessToken(input),
    onSuccess(data, variables, context) {
      setToken({
        token: data,
      });
      queryClient.invalidateQueries({ queryKey: ['customer', data.accessToken] });
      showMessage('Connexion reussie', 'success');
      router.push('/account/');
    },
    onError: (error: any) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutationCreateAccessToken.mutate({
      email: data.email,
      password: data.password,
    });
  };
  return (
    <>
      <CustomHeader title="Se connecter" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack mt={20}>
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
          <YStack mt={10} mb={30}>
            <SizableText mb={10} fontWeight="700">
              Mot de passe
            </SizableText>
            <Input
              name="password"
              control={control}
              secureTextEntry
              rules={{
                required: 'Mot de passe obligatoire',
              }}
            />
          </YStack>
          <XStack justifyContent="center" mb={10} alignItems="center" flexWrap="wrap" gap="$2">
            <SizableText color="$gray12">Pas encore de compte ?</SizableText>
            <Link href={{ pathname: '/account/sign-up' }} asChild>
              <SizableText fontWeight="700">S'inscrire</SizableText>
            </Link>
          </XStack>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={mutationCreateAccessToken.isPending}
            disabled={mutationCreateAccessToken.isPending}>
            Se connecter
          </Button>
        </ScrollView>
      </Container>
    </>
  );
}
