import { YStack } from 'tamagui';

import Accordion from '../Accordion';

const ProductDescription = ({ description }: { description: string }) => {
  return (
    <YStack my={5} bg="#fff" px={20} py={10}>
      <Accordion title="DESCRIPTION" details={description || 'Pas de description'} />
    </YStack>
  );
};

export default ProductDescription;
