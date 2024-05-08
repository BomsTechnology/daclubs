import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import CustomHeader from '~/src/components/CustomHeader';
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

const CategoryPage = () => {
  return (
    <>
      <CustomHeader title="Nike" description="270 Products" />
      <Container>
        <FlashList
          data={DATA}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ProductCard peer={(index + 1) % 2 === 0} />}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </Container>
    </>
  );
};

export default CategoryPage;
