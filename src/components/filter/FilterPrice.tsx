import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { SizableText, XStack } from 'tamagui';

import SearchProps from '~/src/types/SearchProps';

const FilterPrice = ({
  filterData,
  setFilterData,
}: {
  filterData: SearchProps | null;
  setFilterData: (filter: SearchProps) => void;
}) => {
  return (
    <XStack gap={10}>
      <XStack flex={1} borderColor="#EBEDF3" borderWidth={1} p={10} alignItems="center" gap={5}>
        <SizableText fontWeight="800" color="#00000050" fontSize={14}>
          €
        </SizableText>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="Min"
          keyboardType="numeric"
          onChangeText={(min) =>
            setFilterData({ ...filterData!, price: { min, max: filterData?.price?.max || '' } })
          }
          value={filterData?.price?.min || ''}
        />
      </XStack>
      <XStack flex={1} borderColor="#EBEDF3" borderWidth={1} p={10} alignItems="center" gap={5}>
        <SizableText fontWeight="800" color="#00000050" fontSize={14}>
          €
        </SizableText>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="Max"
          keyboardType="numeric"
          onChangeText={(max) =>
            setFilterData({ ...filterData!, price: { min: filterData?.price?.min || '', max } })
          }
          value={filterData?.price?.max || ''}
        />
      </XStack>
    </XStack>
  );
};

const styles = StyleSheet.create({
  input: {
    color: 'black',
    fontFamily: 'RalewayRegular',
    flex: 1,
  },
});

export default FilterPrice;
