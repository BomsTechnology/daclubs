import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollView, SizableText, YStack, XStack } from 'tamagui';

import { recoverCustomer } from '~/src/api/customer';
import Button from '~/src/components/form/Button';
import Input from '~/src/components/form/Input';
import CustomHeader from '~/src/components/header/CustomHeader';
import useShowNotification from '~/src/hooks/useShowNotification';
import { Container } from '~/tamagui.config';

export default function Page() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { showMessage } = useShowNotification();
  const { control, handleSubmit } = useForm();

  const mutationRecoverCustomer = useMutation({
    mutationFn: (email: string) => recoverCustomer(email),
    onSuccess(data, variables, context) {
      setEmail(variables);
      setEmailSent(true);
      showMessage('Lien de réinitialisation envoyé', 'success');
    },
    onError: (error, variables, context) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutationRecoverCustomer.mutate(data.email);
  };
  return (
    <>
      <CustomHeader title="Réinitialisation du mot de passe" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          {emailSent ? (
            <YStack bg="white" p={10}>
              <SizableText textAlign="center" fontSize={13}>
                Nous envoyons un email à votre adresse
              </SizableText>
              <SizableText textAlign="center" fontWeight="700">
                {email}
              </SizableText>
              <SizableText textAlign="center" fontSize={13}>
                pour vous permettre de réinitialiser votre mot de passe. Veuillez suivre les
                instructions dans cet email pour changer votre mot de passe. Une fois que votre mot
                de passe a été mis à jour, vous pouvez vous reconnecter.
              </SizableText>
              <Button mt={20} onPress={() => router.back()}>
                Se Connecter
              </Button>
            </YStack>
          ) : (
            <YStack>
              <YStack mt={20} mb={30}>
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
              <XStack justifyContent="center" mb={10} alignItems="center" flexWrap="wrap" gap="$2">
                <SizableText color="$gray12">Vous connaissez votre mot de passe ?</SizableText>
                <Link href={{ pathname: '/account/sign-in' }} asChild>
                  <SizableText fontWeight="700">Se connecter</SizableText>
                </Link>
              </XStack>
              <Button
                loading={mutationRecoverCustomer.isPending}
                disabled={mutationRecoverCustomer.isPending}
                onPress={handleSubmit(onSubmit)}>
                Récupérer
              </Button>
            </YStack>
          )}
        </ScrollView>
      </Container>
    </>
  );
}
