import { Ionicons } from '@expo/vector-icons';
import { Input, XStack } from 'tamagui';

const SearchInput = () => {
  return (
    <XStack borderWidth={1} borderColor="#EBEDF3" mt={10} bg="#fff" px={10} py={12} gap={10}>
      <Ionicons name="search" size={20} color="#000" />
      <Input
        unstyled
        placeholder="Looking for shoes"
        placeholderTextColor="#000"
        fontWeight="200"
      />
    </XStack>
  );
};

export default SearchInput;
