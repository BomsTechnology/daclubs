import { ApolloClient, InMemoryCache } from '@apollo/client';

const BASE_URL = `${process.env.EXPO_PUBLIC_STORE_DOMAIN}/admin/api/${process.env.EXPO_PUBLIC_API_VERSION}/graphql.json`;

const clientAdmin = new ApolloClient({
  uri: BASE_URL,
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Access-Token': process.env.EXPO_PUBLIC_ACCESS_TOKEN!,
  },
});

export default clientAdmin;
