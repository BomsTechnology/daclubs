import { Ionicons } from '@expo/vector-icons';
import { Button, Input, SizableText, XStack, YStack } from 'tamagui';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import { predictiveSearchProducts } from '~/src/api/product';
import { useQuery } from '@tanstack/react-query';
import SearchProductCard from '../card/SearchProductCard';
import { useEffect, useState } from 'react';

const SearchInput = ({
  value,
  setValue,
  onSearch,
  isPrefetch = false,
}: {
  value: string;
  setValue: (value: string) => void;
  onSearch: () => void;
  isPrefetch?: boolean;
}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if(isPrefetch){
      setDebouncedValue(value);
      }else{
        onSearch();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  const {
    status,
    fetchStatus,
    data: products,
  } = useQuery({
    queryKey: ['predictiveSearch', debouncedValue],
    queryFn: () => predictiveSearchProducts(debouncedValue),
    enabled: !!debouncedValue && !!isPrefetch,
  });
  return (
    <YStack position="relative">
      <XStack borderWidth={1} borderColor="#EBEDF3" alignItems="center" mt={10} bg="#fff" px={10}>
        <Ionicons name="search" size={20} color="#000" />
        <Input
          unstyled
          placeholder="À la recherche de ma sneakers"
          placeholderTextColor="#000"
          fontWeight="200"
          borderWidth={0}
          h={40}
          px={10}
          flex={1}
          value={value}
          onChangeText={setValue}
        />
        {value && (
          <Button
            onPress={() => {
              setDebouncedValue('');
              setValue('');
            }}
            unstyled
            py={5}
            pl={5}
            h={39}
            justifyContent="center"
            alignItems="center">
            <Ionicons name="close" size={20} color="#000" />
          </Button>
        )}
      </XStack>
      {debouncedValue && isPrefetch && (
        <YStack
          position="absolute"
          top="100%"
          zIndex={10}
          borderWidth={1}
          borderColor="#EBEDF3"
          left={0}
          right={0}
          bg="#fff"
          minHeight={100}
          w="100%"
          p={10}>
          {fetchStatus === 'fetching' ? (
            <XStack justifyContent="center" alignItems="center" h="100%">
              <ActivityIndicator />
            </XStack>
          ) : status === 'error' ? (
            <XStack justifyContent="center" alignItems="center" h="100%">
              <SizableText>Une erreur est survenue</SizableText>
            </XStack>
          ) : products && products?.length > 0 ? (
            <>
              <View style={{ marginBottom: 10 }}>
                <ScrollView
                  contentContainerStyle={{ gap: 15 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {products?.map((product) => (
                    <SearchProductCard key={product.id} product={product} />
                  ))}
                </ScrollView>
              </View>
              <Button onPress={onSearch} unstyled justifyContent="center" alignItems="center">
                Voir tout
              </Button>
              
            </>
          ) : (
            <XStack justifyContent="center" alignItems="center" h="100%">
              <SizableText>Votre recherche n'a donné aucun résultat</SizableText>
            </XStack>
          )}
        </YStack>
      )}
    </YStack>
  );
};

export default SearchInput;
