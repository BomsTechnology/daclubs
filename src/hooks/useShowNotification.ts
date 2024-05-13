import { useToast } from 'react-native-toast-notifications';

export default function useShowNotification() {
  const toast = useToast();

  const showMessage = (message: string, type: string = 'danger') => {
    toast.show(message || 'Une erreur est survenue', {
      type,
      placement: 'top',
      animationType: 'slide-in',
    });
  };
  return {
    showMessage,
  };
}
