import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList } from 'react-native';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import CustomHeader from '~/src/components/CustomHeader';
import { Container } from '~/tamagui.config';

const ITEM = [
  {
    title: 'Mes commandes',
    icon: <Ionicons name="bag-outline" size={20} color="black" />,
  },
  {
    title: 'FAQ',
    icon: <Ionicons name="help-circle-outline" size={25} color="black" />,
  },
];

const Page = () => {
  const ListItem = ({
    title,
    icon,
    action,
  }: {
    title: string;
    icon: JSX.Element;
    action?: () => void;
  }) => {
    return (
      <Button
        onPress={action}
        unstyled
        w="100%"
        flexDirection="row"
        p={20}
        borderTopWidth={1}
        borderTopColor="#EBEDF3"
        alignItems="center"
        justifyContent="space-between">
        <XStack gap={10}>
          {icon}
          <SizableText fontWeight="500">{title}</SizableText>
        </XStack>
        <Ionicons name="chevron-forward" size={20} color="black" />
      </Button>
    );
  };

  return (
    <>
      <CustomHeader title="Mon compte" icon={<Ionicons name="person" size={20} color="black" />} />
      <Container p={0}>
        <Button
          unstyled
          flexDirection="row"
          bg="#F1F2F3"
          p={20}
          alignItems="center"
          onPress={() => router.push('/account/sign-in')}>
          <YStack bg="#07011E" p={15} borderRadius={50}>
            <AntDesign name="logout" size={30} color="#fff" />
          </YStack>
          <YStack>
            <SizableText fontWeight="700" color="#0019FF" textDecorationLine="underline">
              Se connecter
            </SizableText>
          </YStack>
        </Button>
        <FlatList
          data={ITEM}
          renderItem={({ item }) => <ListItem title={item.title} icon={item.icon} />}
          keyExtractor={(item) => item.title}
        />
      </Container>
    </>
  );
};

export default Page;
