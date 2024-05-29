import { ProductInfiniteScrollProps, MainProductProps } from '../types/ProductProps';
import SearchProps, { FilterProps } from '../types/SearchProps';
import client from '../utils/shopify';

const queryFilter = `
          id
          label
          type
          values {
            id
            label
            count
            input
          }
`;

const queryMinProduct = `
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

const queryProduct = `
        ${queryMinProduct}
        images(first: 10) {
          edges {
            cursor
            node {
              altText
              height
              id
              url(transform: {maxHeight: 500, maxWidth: 500})
              width
            }
          }
        }
        createdAt
        description
        descriptionHtml
        compareAtPriceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        onlineStoreUrl
        options(first: 5) {
          id
          name
          values
        }
        requiresSellingPlan
        tags
        trackingParameters
        updatedAt
        isGiftCard
        variants(first: 100) {
          edges {
            node {
              id
              image {
                url(transform: {maxHeight: 10, maxWidth: 10})
                width
                height
                altText
                id
              }
              availableForSale
              barcode
              currentlyNotInStock
              title
              unitPrice {
                amount
                currencyCode
              }
              unitPriceMeasurement {
                measuredType
                quantityUnit
                quantityValue
                referenceUnit
                referenceValue
              }
              weight
              weightUnit
              taxable
              sku
              selectedOptions {
                name
                value
              }
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
              requiresShipping
              quantityAvailable
            }
          }
        }
`;

export const getProducts = async ({
  pageParam = '',
  filter = { price: { min: '', max: '' }, items: [] },
}: {
  pageParam?: string;
  filter?: SearchProps;
}): Promise<ProductInfiniteScrollProps> => {
  console.log(pageParam);
  const productsQuery = `
      query getProducts {
              products(
                first: 50${pageParam ? `, after: "${pageParam}"` : ''}) {
                edges {
                  cursor
                  node {
                    ${queryMinProduct}
                  }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                }
              }
            }`;
  const { data, errors } = await client.request(productsQuery);
  if (errors) throw errors;
  return data.products;
};
export const getProduct = async (id: string): Promise<MainProductProps> => {
  const productQuery = `
  query getProduct($id: ID!) {
  product(id: $id) {
        ${queryProduct}
      }
    }`;
  const { data, errors } = await client.request(productQuery, {
    variables: {
      id,
    },
  });
  if (errors) throw errors;
  return data.product;
};

export const getFilterByHandle = async (handle: string): Promise<FilterProps[]> => {
  const filterQuery = `
  query Facets($handle: String) {
    collection(handle: $handle) {
      handle
      products(first: 10) {
        filters {
          ${queryFilter}
        }
      }
    }
  }`;
  const { data, errors } = await client.request(filterQuery, {
    variables: {
      handle,
    },
  });
  if (errors) throw errors;
  return data.collection.products.filters;
};

export const getFilterById = async (id: string): Promise<FilterProps[]> => {
  const filterQuery = `
  query Facets($id: ID) {
    collection(id: $id) {
      handle
      products(first: 10) {
        filters {
          ${queryFilter}
        }
      }
    }
  }`;
  const { data, errors } = await client.request(filterQuery, {
    variables: {
      id,
    },
  });
  if (errors) throw errors;
  return data.collection.products.filters;
};
