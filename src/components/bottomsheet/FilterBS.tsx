import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, ScrollView, SizableText, XStack, YStack } from 'tamagui';

const FilterBS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['80%', '95%'], []);
  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} style={{ paddingHorizontal: 20 }} bottomInset={25}>
        <XStack gap={10}>
          <Button bg="#fff" flex={1} borderRadius={0} borderWidth={1} borderColor="#000">
            <SizableText fontWeight="800" color="#000" fontSize={14}>
              Réinitialiser
            </SizableText>
          </Button>
          <Button bg="#000" flex={1} borderRadius={0}>
            <SizableText fontWeight="800" color="#fff" fontSize={14}>
              Filtrer
            </SizableText>
          </Button>
        </XStack>
      </BottomSheetFooter>
    ),
    []
  );
  const renderItem = ({ item }: { item: string }) => (
    <Button unstyled p={10}>
      {item}
    </Button>
  );
  return (
    <>
      <XStack my={10}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 5 }}>
          <Button bg="#000" onPress={() => setIsOpen(!isOpen)} borderRadius={20} size="$2">
            <Ionicons name="filter" size={14} color="#fff" />
            <SizableText fontWeight="600" color="#fff" fontSize={13}>
              Filtrer
            </SizableText>
          </Button>
        </ScrollView>
      </XStack>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        topInset={20}
        handleIndicatorStyle={{ backgroundColor: 'black' }}
        onDismiss={() => setIsOpen(false)}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}>
        <BottomSheetView style={{ flex: 1 }}>
          <XStack justifyContent="flex-end" p={10}>
            <Button
              onPress={() => setIsOpen(false)}
              bg="#fff"
              unstyled
              w={35}
              borderWidth={1}
              borderColor="#EBEDF3"
              h={35}
              justifyContent="center"
              alignItems="center">
              <Ionicons name="close" size={20} />
            </Button>
          </XStack>
          <XStack flex={1}>
            <YStack w="40%" bg="#ECEFF1">
              <BottomSheetFlatList
                data={['Disponibilité', 'Prix', 'Marque', 'Taille', 'Couleur']}
                keyExtractor={(item) => item.toString()}
                renderItem={renderItem}
              />
            </YStack>
            <YStack w="60%" ></YStack>
          </XStack>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default FilterBS;
