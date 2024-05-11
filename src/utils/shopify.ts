import { createStorefrontApiClient } from '@shopify/storefront-api-client';

/*const BASE_URL = `${process.env.EXPO_PUBLIC_STORE_DOMAIN}/admin/api/${process.env.EXPO_PUBLIC_API_VERSION}`;
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('X-Shopify-Access-Token', `${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`);*/

const client = createStorefrontApiClient({
  storeDomain: process.env.EXPO_PUBLIC_STORE_DOMAIN!,
  apiVersion: process.env.EXPO_PUBLIC_API_VERSION!,
  publicAccessToken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_STOREFRONT!,
});

export default client;
