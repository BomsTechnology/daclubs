import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, H5, XStack } from 'tamagui';

import NotificationCard from '../card/NotificationCard';

import { notificationWithStorage } from '~/src/utils/storage';

const NotificationBS = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [notifications, setNotifications] = useAtom(notificationWithStorage);
  const unRead = notifications.filter((item) => !item.read).length;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['80%', '90%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      setNotifications(notifications.map((item) => ({ ...item, read: true })));
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: 'white' }}
      topInset={20}
      index={1}
      handleIndicatorStyle={{ backgroundColor: 'black' }}
      onDismiss={() => setIsOpen(false)}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={{ flex: 1 }}>
        <XStack justifyContent="space-between" p={10} alignItems="center">
          <H5 fontWeight="700">Notifications ({unRead})</H5>
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
        <XStack flex={1} bg="#ECEFF140">
          <BottomSheetFlatList
            data={notifications}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <NotificationCard {...item} />}
          />
        </XStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default NotificationBS;
