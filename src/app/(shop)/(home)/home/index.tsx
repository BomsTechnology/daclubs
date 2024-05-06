import { FlashList } from '@shopify/flash-list';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { H4, SizableText, XStack } from 'tamagui';

import HorizontalCollectionCard from '~/src/components/card/HorizontalCollectionCard';
import ProductCard from '~/src/components/card/ProductCard';
import SearchInput from '~/src/components/form/SearchInput';
import { Container } from '~/tamagui.config';

const DATA = [
  {
    title: 'First Item',
  },
  {
    title: 'Second Item',
  },
  {
    title: 'Second Item',
  },
];

const Page = () => {
  return (
    <Container>
      <SearchInput />
      <Animated.View style={{ marginTop: 15 }}>
        <ScrollView
          contentContainerStyle={{ gap: 15 }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <HorizontalCollectionCard />
          <HorizontalCollectionCard />
          <HorizontalCollectionCard />
          <HorizontalCollectionCard />
        </ScrollView>
      </Animated.View>
      <XStack mt={15} mb={10} justifyContent="space-between" alignItems="center">
        <H4>Populaires</H4>
        <SizableText>Voir tout</SizableText>
      </XStack>
      <FlashList
        data={DATA}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ProductCard peer={(index + 1) % 2 === 0} />}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
