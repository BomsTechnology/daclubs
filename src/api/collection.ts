import CollectionProps, { CollectionWithProductsProps } from '../types/CollectionProps';
import client from '../utils/shopify';

export const getCollections = async (): Promise<CollectionProps[]> => {
  const collectionsQuery = `
      query getCollections {
          collections(first: 50, sortKey: TITLE, reverse: false) {
              edges {
                  cursor
                  node {
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

export const getProductsInCollectionByHandle = async (
  handle: string
): Promise<CollectionWithProductsProps> => {
  const productsInCollection = `
    query getProductsInCollectionByHandle($handle: String) {
        collection(handle: $handle) {
            handle
            title
            id
            products(first: 20) {
              edges {
                cursor
                node {
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
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
    }`;
  const { data, errors } = await client.request(productsInCollection, {
    variables: {
      handle,
    },
  });
  if (errors) throw errors;
  return data.collection;
};
