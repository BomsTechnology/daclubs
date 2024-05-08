import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { Button, SizableText } from 'tamagui';

import ProductCard from '~/src/components/card/ProductCard';
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
      <Button size="$2" alignSelf="flex-end" borderRadius={20} my={15}>
        <Ionicons name="filter" size={14} color="#000" />
        <SizableText fontWeight="600" fontSize={13}>
          Filtrer
        </SizableText>
      </Button>

      <FlashList
        data={DATA}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ProductCard peer={(index + 1) % 2 === 0} />}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
