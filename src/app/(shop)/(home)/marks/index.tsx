import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import VerticalCollectionCard from '~/src/components/card/VerticalCollectionCard';
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
      <View style={{ marginTop: 25 }} />
      <FlashList
        data={DATA}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <VerticalCollectionCard peer={(index + 1) % 2 === 0} />}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
