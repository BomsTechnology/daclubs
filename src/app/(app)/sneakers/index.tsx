import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { Button, SizableText } from 'tamagui';

import { getProducts } from '~/src/api/product';
import ProductCard from '~/src/components/card/ProductCard';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      getProducts().then((res) => {
        return res;
      }),
  });

  return (
    <Container>
      <Button size="$2" alignSelf="flex-end" borderRadius={20} my={15}>
        <Ionicons name="filter" size={14} color="#000" />
        <SizableText fontWeight="600" fontSize={13}>
          Filtrer
        </SizableText>
      </Button>

      <FlashList
        data={data}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ProductCard {...item} peer={(index + 1) % 2 === 0} />}
        estimatedItemSize={500}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
