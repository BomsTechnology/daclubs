import { ProductInfiniteScrollProps, MainProductProps } from '../types/ProductProps';
import client from '../utils/shopify';

export const getProducts = async ({ pageParam = '' }): Promise<ProductInfiniteScrollProps> => {
  const productsQuery = `
      query getProducts {
              products(first: 50${pageParam ? `, after: "${pageParam}"` : ''}) {
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
        id
        availableForSale
        handle
        featuredImage {
          altText
          height
          id
          url(transform: {maxHeight: 500, maxWidth: 500})
          width
        }
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
        vendor
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
        options(first: 5) {
          id
          name
          values
        }
        productType
        publishedAt
        requiresSellingPlan
        tags
        title
        totalInventory
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
