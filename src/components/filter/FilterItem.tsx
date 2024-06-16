import { FlatList } from 'react-native';

import CheckboxWithLabel from '../form/CheckboxWithLabel';

import SearchProps, { FilterProps, FilterValueProps } from '~/src/types/SearchProps';

const FilterItem = ({
  filterData,
  setFilterData,
  ...props
}: FilterProps & {
  filterData: SearchProps | null;
  setFilterData: (filter: SearchProps) => void;
}) => {
  const setFilterItem = (item: FilterValueProps) => {
    const already = filterData?.items?.find((val) => val === item.input);
    if (already) {
      setFilterData({
        ...filterData!,
        items: filterData?.items?.filter((val) => val !== item.input) || [],
      });
    } else {
      setFilterData({
        ...filterData!,
        items: [...(filterData?.items || []), item.input],
      });
    }
  };
  const renderItem = ({ item }: { item: FilterValueProps }) => (
    <CheckboxWithLabel
      label={`${item.label} (${item.count})`}
      onCheckedChange={() => setFilterItem(item)}
      defaultChecked={!!filterData?.items?.find((val) => val === item.input)}
    />
  );
  return (
    <>
      <FlatList
        data={props.values}
        keyExtractor={(item, index) => `${item.id}-${index}-${props.id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      />
    </>
  );
};

export default FilterItem;
