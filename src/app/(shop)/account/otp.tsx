import { Input, ScrollView, SizableText, YStack, Button } from 'tamagui';

import CustomHeader from '~/src/components/CustomHeader';
import { Container } from '~/tamagui.config';

export default function Page() {
  return (
    <>
      <CustomHeader title="OTP Code" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SizableText textAlign="center" maxWidth="90%">
            Veuillez vérifier votre e-mail pour voir le code de vérification.
          </SizableText>
          <SizableText textAlign="center" fontWeight="700" maxWidth="90%">
            bomstechnology@gmail.com
          </SizableText>
          <YStack mt={20} mb={30}>
            <SizableText mb={10} fontWeight="700">
              Code de vérification
            </SizableText>
            <Input borderRadius={0} bg="#fff" />
          </YStack>
          <Button bg="#000" borderRadius={0}>
            <SizableText fontWeight="700" color="#fff">
              Verifier
            </SizableText>
          </Button>
        </ScrollView>
      </Container>
    </>
  );
}
