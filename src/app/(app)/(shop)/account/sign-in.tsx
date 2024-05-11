import { router } from 'expo-router';
import { SizableText, YStack, Button, Input, ScrollView } from 'tamagui';

import CustomHeader from '~/src/components/CustomHeader';
import { Container } from '~/tamagui.config';

export default function Page() {
  return (
    <>
      <CustomHeader title="Se connecter" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack mt={20} mb={30}>
            <SizableText mb={10} fontWeight="700">
              Adresse E-mail
            </SizableText>
            <Input borderRadius={0} bg="#fff" />
          </YStack>
          <Button bg="#000" borderRadius={0} onPress={() => router.push('/account/otp')}>
            <SizableText fontWeight="700" color="#fff">
              Se Connecter
            </SizableText>
          </Button>
        </ScrollView>
      </Container>
    </>
  );
}
