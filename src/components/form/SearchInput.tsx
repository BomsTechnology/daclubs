import { Ionicons } from '@expo/vector-icons';
import { Button, Input, XStack } from 'tamagui';

const SearchInput = ({
  value,
  setValue,
  onSearch,
}: {
  value: string;
  setValue: (value: string) => void;
  onSearch: () => void;
}) => {
  return (
    <XStack borderWidth={1} borderColor="#EBEDF3" alignItems="center" mt={10} bg="#fff">
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
      <Button
        onPress={onSearch}
        unstyled
        bg="#000"
        py={5}
        px={10}
        h={39}
        justifyContent="center"
        alignItems="center">
        <Ionicons name="search" size={20} color="#fff" />
      </Button>
    </XStack>
  );
};

export default SearchInput;
