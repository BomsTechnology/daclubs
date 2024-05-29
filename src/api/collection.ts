import CollectionProps, {
  CollectionWithProductsProps,
  MainCollectionProps,
} from '../types/CollectionProps';
import SearchProps from '../types/SearchProps';
import client from '../utils/shopify';

const queryCollection = `
                description
                descriptionHtml
                handle
                id
                title
                trackingParameters
                updatedAt
                onlineStoreUrl
                image {
                    altText
                    height
                    id
                    url(transform: {maxHeight: 500, maxWidth: 500})
                    width
                }
`;

const queryProduct = `
featuredImage {
  altText
  height
  id
  url(transform: {maxHeight: 500, maxWidth: 500})
  width
}
availableForSale
handle
id
productType
publishedAt
priceRange {
  maxVariantPrice {
    amount
    currencyCode
  }
  minVariantPrice {
    amount
    currencyCode
  }
}
title
totalInventory
vendor
`;

export const getCollectionById = async (id: string): Promise<MainCollectionProps> => {
  const collectionQuery = `
        query getCollectionById($id: ID!) {
            collection(id: $id) {
                ${queryCollection}
            }
        }`;

  const { data, errors } = await client.request(collectionQuery, {
    variables: { id },
  });
  if (errors) throw errors;
  return data.collection;
};

export const getCollections = async (): Promise<CollectionProps[]> => {
  const collectionsQuery = `
      query getCollections {
          collections(first: 50, sortKey: TITLE, reverse: false) {
              edges {
                  cursor
                  node {
                    ${queryCollection}
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
          }
        }
  `;

  const { data, errors } = await client.request(collectionsQuery);
  if (errors) throw errors;
  return data.collections.edges;
};

export const getProductsInCollectionByHandle = async ({
  handle,
  pageParam = '',
  filter = { price: { min: '', max: '' }, items: [] },
}: {
  handle: string;
  pageParam?: string;
  filter?: SearchProps;
}): Promise<CollectionWithProductsProps> => {
  const productsInCollectionQuery = `
  query getProductsInCollectionByHandle($handle: String) {
    collection(handle: $handle) {
              handle
              title
              id
              products(
                first: 50${pageParam ? `, after: "${pageParam}"` : ''}
                ${
                  filter.items.length > 0 || filter.price.min || filter.price.max
                    ? `,filters: [
                    ${filter.items.length > 0 ? `${filter.items.join(`, `)},` : ``}
                    ${
                      filter.price.min || filter.price.max
                        ? `
                        {price: { ${filter.price.min && filter.price.max ? `min:${filter.price.min}, max:${filter.price.max}` : filter.price.min ? `min:${filter.price.min}` : filter.price.max ? `max:${filter.price.max}` : ''}}}
                        `
                        : ''
                    }]`
                    : ''
                }) {
                edges {
                  cursor
                  node {
                    ${queryProduct}
                  }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                }
              }
            }
      }`;
  const { data, errors } = await client.request(productsInCollectionQuery, {
    variables: {
      handle,
    },
  });
  if (errors) {
    throw errors;
  }
  return data.collection;
};

export const getProductsInCollectionById = async ({
  id,
  pageParam,
  filter = { price: { min: '', max: '' }, items: [] },
}: {
  id: string;
  pageParam?: string;
  filter?: SearchProps;
}): Promise<CollectionWithProductsProps> => {
  const productsInCollectionQuery = `
      query getProductsInCollectionByHandle($id: ID!) {
          collection(id: $id) {
              handle
              title
              id
              products(first: 50${pageParam ? `, after: "${pageParam}"` : ''}
              ${
                filter.items.length > 0 || filter.price.min || filter.price.max
                  ? `,filters: [
                  ${filter.items.length > 0 ? `${filter.items.join(`, `)},` : ``}
                  ${
                    filter.price.min || filter.price.max
                      ? `
                      {price: { ${filter.price.min && filter.price.max ? `min:${filter.price.min}, max:${filter.price.max}` : filter.price.min ? `min:${filter.price.min}` : filter.price.max ? `max:${filter.price.max}` : ''}}}
                      `
                      : ''
                  }]`
                  : ''
              }) {
                edges {
                  cursor
                  node {
                    ${queryProduct}
                  }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                }
              }
            }
      }`;
  const { data, errors } = await client.request(productsInCollectionQuery, {
    variables: {
      id,
    },
  });
  if (errors) throw errors;
  return data.collection;
};
