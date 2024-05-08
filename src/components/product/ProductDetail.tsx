import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import { Accordion, Button, H4, Paragraph, ScrollView, SizableText, XStack, YStack } from 'tamagui';

import ProductDot from './ProductDot';
import CustomHeader from '../CustomHeader';

const ProductDetail = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<PagerView>(null);

  const SizeItem = ({ size }: { size: string }) => {
    return (
      <Button bg="#ECEFF1" color="#000" w={100}>
        {size}
      </Button>
    );
  };

  return (
    <>
      <CustomHeader title="Détails du produit" />
      <ScrollView flex={1} bg="#ECEFF1">
        <View style={{ height: 30, backgroundColor: 'white' }} />
        <View>
          <PagerView
            ref={pageRef}
            overScrollMode="auto"
            initialPage={0}
            onPageScroll={(e) => setCurrentPage(e.nativeEvent.position)}
            style={{ flex: 1, backgroundColor: 'white', height: 250 }}>
            <View style={{ width: '100%', height: '100%' }} key={1}>
              <FastImage
                source={{
                  uri: 'https://daclub-snkrs.com/cdn/shop/files/new-balance-1906r-protection-pack-black-4_2000x_602c1cd6-e4b1-4397-a3a3-ee6c190a64d4.webp?v=1684882391&width=700',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ width: '100%', height: '100%' }} key={2}>
              <FastImage
                source={{
                  uri: 'https://daclub-snkrs.com/cdn/shop/files/new-balance-1906r-protection-pack-black-3_2000x_a2368c41-c620-4775-a806-252097c35dd8.webp?v=1684882391&width=700',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ width: '100%', height: '100%' }} key={3}>
              <FastImage
                source={{
                  uri: 'https://daclub-snkrs.com/cdn/shop/files/new-balance-1906r-protection-pack-black-1_2000x_fa4004f7-42c0-4d1a-a1c2-ae173c721541.webp?v=1684882391&width=700',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ width: '100%', height: '100%' }} key={4}>
              <FastImage
                source={{
                  uri: 'https://daclub-snkrs.com/cdn/shop/files/new-balance-1906r-protection-pack-black-2_2000x_0c9a286c-9678-4472-bf30-a8fce0eed66f.webp?v=1684882391&width=700',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </PagerView>
          <ProductDot nbItems={4} activeItem={currentPage} />
        </View>
        <YStack py={10} px={20} bg="#fff" my={5}>
          <SizableText fontWeight="700" textTransform="uppercase">
            NEW BALANCE
          </SizableText>
          <SizableText textTransform="uppercase" fontSize={18} mt={5}>
            1906R Protection Pack black
          </SizableText>
          <SizableText textTransform="uppercase" fontSize={25} fontWeight="800" mt={5}>
            € 200
          </SizableText>
        </YStack>
        <YStack bg="white" px={20} py={10}>
          <XStack justifyContent="space-between" alignItems="center">
            <SizableText>Selectionnez votre taille : </SizableText>
            <XStack gap={20}>
              <H4 textDecorationLine="underline">EU</H4>
              <H4>US</H4>
            </XStack>
          </XStack>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            mt={15}
            contentContainerStyle={{ gap: 10 }}>
            <SizeItem size="45" />
            <SizeItem size="46" />
            <SizeItem size="47" />
            <SizeItem size="48" />
            <SizeItem size="49" />
          </ScrollView>
        </YStack>
        <YStack my={5} bg="#fff" px={20} py={10}>
          <Accordion overflow="hidden" width="100%" type="multiple">
            <Accordion.Item value="a1">
              <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                {({ open }: { open: boolean }) => (
                  <>
                    <Paragraph>DESCRIPTION</Paragraph>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.Content
                exitStyle={{ opacity: 0 }}
                enterStyle={{ opacity: 0.5 }}
                animation="bouncy">
                <Paragraph>
                  Avec sa nouvelle silhouette, la 1906D, New Balance présente un coloris inédit de
                  son Protection Pack, caractérisé par son style déstructuré et original. La New
                  Balance 1906R du Protection Pack Black arbore une empeigne en mesh noir,
                  agrémentée de superpositions en suède gris et en hairy suède noir à l'aspect
                  déchiré. Des accents noirs viennent compléter l'ensemble, se retrouvant au niveau
                  du renfort en TPU, de la semelle et du logo "N" qui se marie harmonieusement avec
                  les oeillets. La semelle intermédiaire N-Ergy, vieillie pour un look vintage à
                  l'instar de la 2002R, garantit un confort exceptionnel à chaque pas. En tant que
                  nouvelle addition au catalogue de New Balance, la 1906R se joint à la collection
                  très appréciée du Protection Pack, offrant aux amateurs de sneakers un choix varié
                  et une esthétique distinctive. Son style déconstructuré et ses détails travaillés
                  en font un modèle unique qui ne manquera pas d'attirer l'attention des passionnés
                  de chaussures.
                </Paragraph>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </YStack>
        <YStack mb={5} bg="#fff" px={20} py={10}>
          <XStack alignItems="center" gap={10}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="black" />
            <SizableText>Free delivery from 200€</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="star-outline" size={20} color="black" />
            <SizableText>Authentic and new products</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="card-outline" size={20} color="black" />
            <SizableText>Payment in 3x without fees</SizableText>
          </XStack>
          <XStack alignItems="center" gap={10}>
            <Ionicons name="headset-outline" size={20} color="black" />
            <SizableText>Payment in 3x without fees</SizableText>
          </XStack>
        </YStack>
      </ScrollView>
      <XStack bg="#fff" px={20} pb={20} pt={10} alignItems="center">
        <SizableText fontWeight="700" fontSize={25} flex={1}>
          € 200
        </SizableText>

        <XStack gap={10} h={40}>
          <Button
            bg="#000"
            borderRadius={0}
            unstyled
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            px={10}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <SizableText color="#fff" fontWeight="700">
              Ajouter au Panier
            </SizableText>
          </Button>
          <Button
            px={12}
            borderRadius={0}
            borderWidth={1}
            borderColor="#EBEDF3"
            unstyled
            justifyContent="center"
            alignItems="center">
            <Ionicons name="heart-outline" size={20} color="#000" />
          </Button>
        </XStack>
      </XStack>
    </>
  );
};

export default ProductDetail;
