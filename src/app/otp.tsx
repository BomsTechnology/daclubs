import { Link } from 'expo-router';
import { YStack } from 'tamagui';

import { Container, Main, Title, Button, ButtonText } from '~/tamagui.config';

export default function Page() {
  return (
    <Container>
      <Main>
        <YStack>
          <Title>OTP</Title>
        </YStack>
        <Link href={{ pathname: '/(app)/(shop)/home' }} asChild>
          <Button>
            <ButtonText>Go to Home</ButtonText>
          </Button>
        </Link>
      </Main>
    </Container>
  );
}
