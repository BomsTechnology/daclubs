import { Accordion, Paragraph, YStack } from 'tamagui';

const ProductDescription = ({ description }: { description: string }) => {
  return (
    <YStack my={5} bg="#fff" px={20} py={10}>
      <Accordion overflow="hidden" width="100%" type="single">
        <Accordion.Item value="a1">
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            <Paragraph>DESCRIPTION</Paragraph>
          </Accordion.Trigger>
          <Accordion.Content
            exitStyle={{ opacity: 0 }}
            enterStyle={{ opacity: 0.5 }}
            animation="bouncy">
            <Paragraph>{description || 'Pas de description'}</Paragraph>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </YStack>
  );
};

export default ProductDescription;
