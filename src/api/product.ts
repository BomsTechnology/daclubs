import ProductProps from '../types/ProductProps';
import client from '../utils/shopify';

export const getProducts = async ({ pageParam = '' }): Promise<ProductProps[]> => {
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
                    startCursor
                }
              }
            }`;
  const { data, errors } = await client.request(productsQuery);
  if (errors) throw errors;
  return data.products;
}
export const getProduct = async (): Promise<ProductProps> => {
  ` products(first: 2) {
    edges {
      cursor
      node {
        id
        availableForSale
        handle
        featuredImage {
          altText
          height
          id
          url(transform: {maxHeight: 10, maxWidth: 10})
          width
        }
        images(first: 10) {
          edges {
            cursor
            node {
              altText
              height
              id
              url(transform: {maxHeight: 10, maxWidth: 10})
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
        variants(first: 1) {
          nodes {
            weightUnit
            weight
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
            title
            taxable
            sku
            availableForSale
            barcode
            id
            currentlyNotInStock
            image {
              altText
              height
              id
              url(transform: {maxHeight: 10, maxWidth: 10})
              width
            }
            quantityAvailable
            requiresShipping
            price {
              amount
              currencyCode
            }
            priceV2 {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
        isGiftCard
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }`;
  return [];
};
