import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import useShowNotification from './useShowNotification';
import { CartDeliveryCoordinatesPreferenceInput, updateBuyerIdentityCart } from '../api/cart';
import { checkoutWithStorage, customerAtom, tokenWithStorage } from '../utils/storage';

export default function useUpdateBuyerIdentity() {
  const { showMessage } = useShowNotification();
  const [token] = useAtom(tokenWithStorage);
  const [checkout, setCheckout] = useAtom(checkoutWithStorage);
  const [customer] = useAtom(customerAtom);

  const customerAddresses =
    customer.customer!.addresses?.edges.map((edge) => {
      return {
        //customerAddressId: edge.node.id,
        deliveryAddress: {
          address1: edge.node.address1!,
          address2: edge.node.address2 || '',
          city: edge.node.city!,
          company: edge.node.company || '',
          country: edge.node.country!,
          firstName: edge.node.firstName!,
          lastName: edge.node.lastName!,
          phone: edge.node.phone || '',
          province: edge.node.province || '',
          zip: edge.node.zip!,
        },
      };
    }) || [];

  const customerDeliveryPreferences: CartDeliveryCoordinatesPreferenceInput[] =
    customer.customer!.addresses?.edges.map((edge) => {
      return {
        coordinates: {
          countryCode: edge.node.countryCodeV2 || 'FR',
          latitude: edge.node.latitude!,
          longitude: edge.node.longitude!,
        },
        deliveryMethod: 'SHIPPING',
      };
    }) || [];
  const updateBuyerIdentity = useMutation({
    mutationFn: () =>
      updateBuyerIdentityCart({
        buyerIdentity:
          !customer.customer || !token.token
            ? undefined
            : {
                email: customer.customer.email!,
                phone: customer.customer.phone,
                customerAccessToken: token.token!.accessToken,
                deliveryAddressPreferences: customerAddresses,
                countryCode: customer.customer.defaultAddress?.countryCodeV2 || 'FR',
              },
        cartId: checkout?.id!,
      }),
    onSuccess(checkout, variables, context) {
      setCheckout(checkout);
    },
    onError: (error) => {
      showMessage(error.message || 'Une erreur est survenue');
    },
  });
  return {
    customerAddresses,
    updateBuyerIdentity,
    customerDeliveryPreferences,
  };
}
