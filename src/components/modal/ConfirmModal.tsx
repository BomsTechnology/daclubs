import { AlertDialog, AlertDialogProps, Button, XStack, YStack } from 'tamagui';

type ConfirmModalProps = AlertDialogProps & {
  title?: string;
  description: string;
  confirmText: string;
  cancelText: string;
  btnConfirmColor?: string;
  btnTextConfirmColor?: string;
  btnCancelColor?: string;
  btnTextCancelColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideConfirmBtn?: boolean;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <AlertDialog {...props}>
      <AlertDialog.Trigger asChild>{props.children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          maxWidth="90%"
          minWidth="80%"
          p={30}
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}>
          <YStack space>
            {props.title && <AlertDialog.Title textAlign="center">{props.title}</AlertDialog.Title>}
            <AlertDialog.Description textAlign="center" fontWeight="500">
              {props.description}
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="center" mt={10}>
              <AlertDialog.Cancel asChild>
                <Button
                  backgroundColor={props.btnCancelColor || '#ff7979'}
                  fontFamily="$heading"
                  onPress={props.onCancel}
                  color={props.btnTextCancelColor || '#fff'}
                  flex={1}>
                  {props.cancelText}
                </Button>
              </AlertDialog.Cancel>
              {!props.hideConfirmBtn && (
                <AlertDialog.Action asChild>
                  <Button
                    backgroundColor={props.btnConfirmColor || '#fff'}
                    color={props.btnTextConfirmColor || '#000'}
                    fontFamily="$heading"
                    onPress={props.onConfirm}
                    flex={1}>
                    {props.confirmText}
                  </Button>
                </AlertDialog.Action>
              )}
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmModal;
