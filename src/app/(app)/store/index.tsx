import { Ionicons } from '@expo/vector-icons';
import { Linking, ScrollView } from 'react-native';
import { Button, H3, SizableText, YStack } from 'tamagui';

import { Container } from '~/tamagui.config';

const Page = () => {
  return (
    <Container pt={40}>
      <ScrollView>
        <H3>Magasin DaClub Perpignan</H3>
        <Button
          unstyled
          flexDirection="row"
          alignItems="flex-start"
          mt={15}
          onPress={() => Linking.openURL('https://maps.app.goo.gl/Pqizjj836NRr1ooG8')}>
          <Ionicons name="location" size={16} color="#000" />
          <YStack alignItems="flex-start" gap={0}>
            <SizableText fontSize={14} lineHeight={14} numberOfLines={1}>
              1 Av. André Ampère
            </SizableText>
            <SizableText fontSize={14} numberOfLines={1}>
              Cabestany, 66330
            </SizableText>
          </YStack>
        </Button>
        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          mt={15}
          onPress={() => Linking.openURL('tel:0783392441')}>
          <Ionicons name="call" size={16} color="#000" />
          <SizableText fontSize={14} lineHeight={14} numberOfLines={1}>
            07 83 39 24 41
          </SizableText>
        </Button>
        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          mt={15}
          onPress={() => Linking.openURL('mailto:da_clubsnkrs@hotmail.com')}>
          <Ionicons name="mail" size={16} color="#000" />
          <SizableText fontSize={14} lineHeight={14} numberOfLines={1}>
            da_clubsnkrs@hotmail.com
          </SizableText>
        </Button>
        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          mt={15}
          onPress={() => Linking.openURL('https://daclub-snkrs.com')}>
          <Ionicons name="globe" size={16} color="#000" />
          <SizableText fontSize={14} numberOfLines={1}>
            https://daclub-snkrs.com
          </SizableText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default Page;
