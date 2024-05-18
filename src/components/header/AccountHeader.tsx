import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import { CustomerProps } from '~/src/types/CustomerProps';

const AccountHeader = ({ customer }: { customer: CustomerProps | undefined }) => {
  return (
    <>
      {!customer ? (
        <Button
          unstyled
          flexDirection="row"
          bg="#F1F2F3"
          p={20}
          alignItems="center"
          onPress={() => router.push('/account/sign-in')}>
          <YStack bg="#07011E" p={15} h={60} w={60} borderRadius={50}>
            <AntDesign name="logout" size={30} color="#fff" />
          </YStack>
          <YStack>
            <SizableText fontWeight="700" color="#0019FF" textDecorationLine="underline">
              Se connecter/ S'inscrire
            </SizableText>
          </YStack>
        </Button>
      ) : (
        <Button
          unstyled
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          bg="#F1F2F3"
          onPress={() => router.push('/account/profile')}
          p={20}>
          <XStack gap={10} alignItems="center" maxWidth="80%">
            <XStack
              bg="#07011E"
              justifyContent="center"
              alignItems="center"
              h={60}
              w={60}
              borderRadius={50}>
              <SizableText color="#fff" fontWeight="700" fontSize={28} lineHeight={36}>
                {customer.lastName && customer.firstName
                  ? customer.firstName[0] + customer.lastName[0]
                  : customer.displayName[0]}
              </SizableText>
            </XStack>
            <YStack>
              <SizableText fontWeight="700" fontSize={16} numberOfLines={1}>
                {customer.displayName}
              </SizableText>
              <YStack mt={5}>
                <SizableText fontSize={12} lineHeight={14} numberOfLines={1}>
                  {customer.email}
                </SizableText>
                <SizableText fontSize={12} lineHeight={14} numberOfLines={1}>
                  {customer.phone}
                </SizableText>
              </YStack>
            </YStack>
          </XStack>
          <SizableText fontWeight="700" color="#0019FF" textDecorationLine="underline">
            Editer
          </SizableText>
        </Button>
      )}
    </>
  );
};

export default AccountHeader;
