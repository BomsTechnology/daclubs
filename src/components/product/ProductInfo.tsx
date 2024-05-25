import React from 'react';
import { SizableText, YStack } from 'tamagui';

import { MainProductProps } from '~/src/types/ProductProps';

const ProductInfo = ({
  data,
  selectedVariant,
}: {
  data: MainProductProps;
  selectedVariant: any;
}) => {
  return (
    <YStack py={10} px={20} bg="#fff" my={5}>
      <SizableText fontWeight="700" textTransform="uppercase">
        {data.vendor}
      </SizableText>
      <SizableText textTransform="uppercase" fontSize={18} mt={5}>
        {data.title}
      </SizableText>
      <SizableText textTransform="uppercase" fontSize={25} fontWeight="800" mt={5}>
        {selectedVariant
          ? `${selectedVariant?.price.amount} ${selectedVariant?.price.currencyCode}`
          : `${data.priceRange.minVariantPrice.amount} ${data.priceRange.minVariantPrice.currencyCode}`}
      </SizableText>
    </YStack>
  );
};

export default ProductInfo;
