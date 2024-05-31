import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { getCollections } from '~/src/api/collection';
import VerticalCollectionCard from '~/src/components/card/VerticalCollectionCard';
import SearchInput from '~/src/components/form/SearchInput';
import { Container } from '~/tamagui.config';

const Page = () => {
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['collections'],
    queryFn: () =>
      getCollections().then((res) => {
        return res.filter((collection) => collection.node.image);
      }),
  });
  return (
    <Container>
      <SearchInput
        value={search}
        setValue={setSearch}
        onSearch={() =>
          router.push({
            pathname: '/home/search',
            params: {
              query: search,
            },
          })
        }
      />
      <View style={{ marginTop: 25 }} />
      <FlashList
        data={data}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <VerticalCollectionCard {...item} peer={(index + 1) % 2 === 0} />
        )}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </Container>
  );
};

export default Page;
