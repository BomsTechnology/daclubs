import { Button, SizableText, XStack, YStack } from 'tamagui';

const ProductDeliveryMode = ({
  selectedDeliveryMode,
  setSelectedDeliveryMode,
  deliveryModes,
}: {
  selectedDeliveryMode: string;
  setSelectedDeliveryMode: (value: string) => void;
  deliveryModes: string[];
}) => {
  const DeliveryItem = ({ text }: { text: string }) => {
    return (
      <Button
        onPress={() => setSelectedDeliveryMode(text)}
        bg={selectedDeliveryMode === text ? '#000' : '#ECEFF1'}
        flex={1}
        flexDirection="column"
        gap={0}
        h={100}>
        <SizableText
          lineHeight={14}
          fontWeight="700"
          color={selectedDeliveryMode === text ? '#fff' : '#000'}>
          Livraison {text}
        </SizableText>
        <SizableText
          fontSize={12}
          lineHeight={14}
          color={selectedDeliveryMode === text ? '#fff' : '#000'}>
          {text === 'Express' ? '(48h)' : '(5 à 10 jours ouvrés)'}
        </SizableText>
      </Button>
    );
  };
  return (
    <YStack bg="white" px={20} py={10} mt={5}>
      <SizableText mb={20}>Selectionnez le mode de livraison : </SizableText>
      <XStack gap={20}>
        {deliveryModes.map((type) => (
          <DeliveryItem text={type} />
        ))}
      </XStack>
    </YStack>
  );
};

export default ProductDeliveryMode;
