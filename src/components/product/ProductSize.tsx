import { useEffect, useState } from 'react';
import { Button, ScrollView, SizableText, XStack, YStack } from 'tamagui';

const SizeTypes = ['EU', 'US'];

type SizeProps = {
  value: string;
  eu: string;
  us: string;
};

const ProductSize = ({
  selectedSize,
  setSelectedSize,
  sizes,
}: {
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  sizes: string[];
}) => {
  const [selectedSizeType, setSelectedSizeType] = useState('EU');
  const [listSizes, setListSizes] = useState<SizeProps[]>([]);

  useEffect(() => {
    sizes.forEach((size: string) => {
      const sizes = size.split('-');
      setListSizes((prev) => [
        ...prev,
        {
          value: size,
          eu: sizes[0].replace('EU', ''),
          us: sizes[1].replace('US', ''),
        },
      ]);
    });
  }, [sizes]);

  const SizeItem = ({ ...size }: SizeProps) => {
    return (
      <Button
        bg={selectedSize === size.value ? '#000' : '#ECEFF1'}
        color={selectedSize === size.value ? '#fff' : '#000'}
        w={95}
        onPress={() => setSelectedSize(size.value)}>
        {selectedSizeType === 'US' ? size.us : size.eu}
      </Button>
    );
  };

  const SizeTypeItem = ({ type }: { type: string }) => {
    return (
      <Button
        onPress={() => setSelectedSizeType(type)}
        borderWidth={selectedSizeType === type ? 0 : 1}
        borderColor="#000"
        bg={selectedSizeType === type ? '#000' : '#fff'}
        color={selectedSizeType === type ? '#fff' : '#000'}>
        {`${type} ${selectedSizeType === type ? '✓' : ''}`}
      </Button>
    );
  };
  return (
    <YStack bg="white" px={20} py={10}>
      <XStack justifyContent="space-between" alignItems="center" mb={20}>
        <SizableText>Selectionnez votre taille : </SizableText>
        <XStack gap={20}>
          {SizeTypes.map((type) => (
            <SizeTypeItem type={type} key={type} />
          ))}
        </XStack>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}>
        {listSizes.map((size, index) => (
          <SizeItem {...size} key={`${size.value}-${index}`} />
        ))}
      </ScrollView>
    </YStack>
  );
};

export default ProductSize;
