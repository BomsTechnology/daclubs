import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ScrollView, SizableText, XStack, YStack } from 'tamagui';

import FilterItem from '../filter/FilterItem';
import FilterPrice from '../filter/FilterPrice';

import SearchProps, { FilterProps } from '~/src/types/SearchProps';

const FilterManualBS = ({
  filterData,
  setFilterData,
  onFilter,
  data,
}: {
  data: FilterProps[];
  filterData: SearchProps | null;
  setFilterData: (filter: SearchProps) => void;
  onFilter: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} style={{ paddingHorizontal: 20 }} bottomInset={25}>
        <XStack gap={10}>
          <Button
            bg="#fff"
            flex={1}
            borderRadius={0}
            borderWidth={1}
            borderColor="#000"
            onPress={() => reset()}>
            <SizableText fontWeight="800" color="#000" fontSize={14}>
              Réinitialiser
            </SizableText>
          </Button>
          <Button
            bg="#000"
            flex={1}
            borderRadius={0}
            onPress={() => {
              onFilter();
              setIsOpen(false);
            }}>
            <SizableText fontWeight="800" color="#fff" fontSize={14}>
              Filtrer
            </SizableText>
          </Button>
        </XStack>
      </BottomSheetFooter>
    ),
    [filterData]
  );

  const renderItem = ({ item }: { item: FilterProps }) => (
    <Button
      unstyled
      p={10}
      onPress={() => setSelectedItem(item.id)}
      bg={selectedItem === item.id ? '#fff' : 'transparent'}>
      {item.label}
    </Button>
  );

  const reset = () => {
    setSelectedItem('');
    setFilterData({
      items: [],
      price: {
        min: '',
        max: '',
      },
    });
    setIsOpen(false);
    setTimeout(() => onFilter(), 500);
  };
  return (
    <>
      <XStack my={10}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 5 }}>
          <Button bg="#000" onPress={() => setIsOpen(!isOpen)} borderRadius={20} size="$2">
            <Ionicons name="filter" size={14} color="#fff" />
            <SizableText fontWeight="600" color="#fff" fontSize={13}>
              Filtrer
            </SizableText>
          </Button>
          {(filterData!.items!.length > 0 || filterData?.price.max || filterData?.price.min) && (
            <Button circular size="$2" bg="#000" onPress={() => reset()}>
              <Ionicons name="close" size={14} color="#fff" />
            </Button>
          )}
        </ScrollView>
      </XStack>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        topInset={20}
        handleIndicatorStyle={{ backgroundColor: 'black' }}
        enablePanDownToClose={false}
        onDismiss={() => setIsOpen(false)}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}>
        <BottomSheetView style={{ flex: 1 }}>
          <XStack justifyContent="flex-end" p={10}>
            <Button
              onPress={() => setIsOpen(false)}
              bg="#fff"
              unstyled
              w={35}
              borderWidth={1}
              borderColor="#EBEDF3"
              h={35}
              justifyContent="center"
              alignItems="center">
              <Ionicons name="close" size={20} />
            </Button>
          </XStack>
          <XStack flex={1}>
            <YStack w="40%" bg="#ECEFF1" pt={10}>
              <BottomSheetFlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
              />
            </YStack>
            <YStack w="60%" px={10}>
              {data?.map((item) => {
                if (selectedItem === item.id) {
                  return item.type === 'PRICE_RANGE' ? (
                    <FilterPrice
                      key={item.id}
                      filterData={filterData}
                      setFilterData={setFilterData}
                    />
                  ) : (
                    <FilterItem
                      key={item.id}
                      {...item}
                      filterData={filterData}
                      setFilterData={setFilterData}
                    />
                  );
                }
              })}
            </YStack>
          </XStack>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default FilterManualBS;
