import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.EXPO_PUBLIC_STORE_DOMAIN!,
  apiVersion: process.env.EXPO_PUBLIC_API_VERSION!,
  publicAccessToken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_STOREFRONT!,
});

export default client;
