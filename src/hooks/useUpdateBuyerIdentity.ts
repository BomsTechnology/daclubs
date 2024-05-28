import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import useShowNotification from './useShowNotification';
import { updateBuyerIdentityCart } from '../api/cart';
import { checkoutWithStorage, customerAtom, tokenWithStorage } from '../utils/storage';

export default function useUpdateBuyerIdentity() {
  const { showMessage } = useShowNotification();
  const [token] = useAtom(tokenWithStorage);
  const [checkout] = useAtom(checkoutWithStorage);
  const [customer] = useAtom(customerAtom);

  const updateBuyerIdentity = useMutation({
    mutationFn: () =>
      updateBuyerIdentityCart({
        buyerIdentity:
          !customer.customer || !token.token
            ? undefined
            : {
                customerAccessToken: token.token!.accessToken,
              },
        cartId: checkout?.id!,
      }),
    onSuccess(checkout, variables, context) {
      console.log(checkout);
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });
  return {
    updateBuyerIdentity,
  };
}
