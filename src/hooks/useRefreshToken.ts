import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import useShowNotification from './useShowNotification';
import { refreshToken } from '../api/customer';
import { tokenWithStorage } from '../utils/storage';

export default function useRefreshToken() {
  const { showMessage } = useShowNotification();
  const [token, setToken] = useAtom(tokenWithStorage);
  const tokenRefresh = useMutation({
    mutationFn: () => refreshToken(token.token?.accessToken!),
    onSuccess(data, variables, context) {
      setToken({
        token: data,
      });
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });
  return {
    tokenRefresh,
  };
}
