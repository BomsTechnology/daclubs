import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import CustomHeader from '~/src/components/header/CustomHeader';
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
    <>
      <CustomHeader
        title="Favoris"
        description="(2 Products)"
        icon={<Ionicons name="heart" size={20} color="black" />}
      />
      <Container>
        <FlashList
          data={DATA}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ProductCard peer={(index + 1) % 2 === 0} />}
          estimatedItemSize={500}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </Container>
    </>
  );
};

export default Page;
