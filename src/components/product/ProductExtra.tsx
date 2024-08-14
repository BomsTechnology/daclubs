import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SizableText, XStack, YStack } from 'tamagui';

const ProductExtra = () => {
  return (
    <YStack mb={5} bg="#fff" px={20} py={10}>
      <XStack alignItems="center" gap={10}>
        <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="black" />
        <SizableText>Livraison gratuite à partir de 200€</SizableText>
      </XStack>
      <XStack alignItems="center" gap={10}>
        <Ionicons name="star-outline" size={20} color="black" />
        <SizableText>Produits authentiques et neufs</SizableText>
      </XStack>
      <XStack alignItems="center" gap={10}>
        <Ionicons name="card-outline" size={20} color="black" />
        <SizableText>Paiement en 3x sans frais</SizableText>
      </XStack>
      <XStack alignItems="center" gap={10}>
        <Ionicons name="headset-outline" size={20} color="black" />
        <SizableText numberOfLines={1}>
          Service Client disponible Lundi au samedi 9h-18h
        </SizableText>
      </XStack>
    </YStack>
  );
};

export default ProductExtra;
