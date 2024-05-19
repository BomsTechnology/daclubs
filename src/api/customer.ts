import CustomError from '../types/CustomError';
import { AddressProps, CustomerAccessTokenProps, CustomerProps } from '../types/CustomerProps';
import client from '../utils/shopify';

export interface CustomerCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
  password: string;
}

export interface CustomerAccessTokenCreateInput {
  email: string;
  password: string;
}

export interface MailingAddressInput {
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  zip: string;
}

const customerQuery = `
        acceptsMarketing
        createdAt
        displayName
        email
        firstName
        id
        lastName
        numberOfOrders
        phone
        tags
        updatedAt
        defaultAddress {
            address1
            address2
            city
            country
            company
            countryCodeV2
            firstName
            formatted(withCompany: true, withName: true)
            formattedArea
            id
            lastName
            latitude
            longitude
            name
            phone
            province
            provinceCode
            zip
        }
        addresses(first: 50) {
            edges {
              cursor
              node {
                address1
                address2
                city
                company
                country
                countryCode
                countryCodeV2
                firstName
                formatted(withCompany: true, withName: true)
                formattedArea
                id
                lastName
                latitude
                longitude
                name
                phone
                province
                provinceCode
                zip
              }
            }
        }
        orders(first: 100) {
            edges {
              cursor
              node {
                lineItems(first: 100) {
                    edges {
                      node {
                        originalTotalPrice {
                          currencyCode
                          amount
                        }
                        discountedTotalPrice {
                          currencyCode
                          amount
                        }
                        discountAllocations {
                          allocatedAmount {
                            currencyCode
                            amount
                          }
                          discountApplication {
                            allocationMethod
                            targetSelection
                            targetType
                            value {
                              ... on MoneyV2 {
                                __typename
                                amount
                                currencyCode
                              }
                              ... on PricingPercentageValue {
                                __typename
                                percentage
                              }
                            }
                          }
                        }
                        customAttributes {
                          value
                          key
                        }
                        title
                        quantity
                        currentQuantity
                      }
                      cursor
                    }
                  }
                  cancelReason
                  currencyCode
                  totalTax {
                    currencyCode
                    amount
                  }
                  totalShippingPrice {
                    currencyCode
                    amount
                  }
                  totalRefunded {
                    currencyCode
                    amount
                  }
                  totalPrice {
                    currencyCode
                    amount
                  }
                  subtotalPrice {
                    currencyCode
                    amount
                  }
                  shippingAddress {
                    address1
                    address2
                    city
                    company
                    country
                    countryCodeV2
                    firstName
                    formatted(withCompany: true, withName: true)
                    formattedArea
                    id
                    lastName
                    latitude
                    longitude
                    name
                    phone
                    province
                  }
                  processedAt
                  orderNumber
                  name
                  originalTotalDuties {
                    amount
                    currencyCode
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  phone
                  shippingDiscountAllocations {
                    allocatedAmount {
                      amount
                      currencyCode
                    }
                    discountApplication {
                      allocationMethod
                      targetSelection
                      targetType
                      value {
                        ... on MoneyV2 {
                          __typename
                          amount
                          currencyCode
                        }
                        ... on PricingPercentageValue {
                          __typename
                          percentage
                        }
                      }
                    }
                  }
                  fulfillmentStatus
                  financialStatus
                  customerUrl
                  customerLocale
                  canceledAt
                  edited
                  email
                  id
                  statusUrl
                  billingAddress {
                    address1
                    address2
                    city
                    company
                    country
                    countryCodeV2
                    firstName
                    formatted(withCompany: true, withName: true)
                    formattedArea
                    id
                    lastName
                    latitude
                    longitude
                    name
                    phone
                    province
                    provinceCode
                    zip
                  }
                  currentSubtotalPrice {
                    amount
                    currencyCode
                  }
                  currentTotalDuties {
                    amount
                    currencyCode
                  }
                  currentTotalPrice {
                    amount
                    currencyCode
                  }
                  currentTotalTax {
                    amount
                    currencyCode
                  }
                  customAttributes {
                    key
                    value
                  }
                }
              }
            }
       `;

export const createCustomer = async (props: CustomerCreateInput): Promise<CustomerProps> => {
  const createCustomerMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ${customerQuery}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
    `;
  const { data, errors } = await client.request(createCustomerMutation, {
    variables: {
      input: props,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerCreate.customerUserErrors.length > 0) {
    const graphQLError = data.customerCreate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerCreate.customer;
};

export const updateCustomer = async ({
  props,
  token,
}: {
  props: CustomerCreateInput;
  token: string;
}): Promise<{
  customer: CustomerProps;
  customerAccessToken: CustomerAccessTokenProps;
}> => {
  const updateCustomerMutation = `
    mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
        customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
        customer {
          ${customerQuery}
        }
        customerAccessToken {
            accessToken
            expiresAt
          }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
      `;
  const { data, errors } = await client.request(updateCustomerMutation, {
    variables: {
      customer: props,
      customerAccessToken: token,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerUpdate.customerUserErrors.length > 0) {
    const graphQLError = data.customerUpdate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return {
    customer: data.customerUpdate.customer,
    customerAccessToken: data.customerUpdate.customerAccessToken,
  };
};

export const recoverCustomer = async (email: string): Promise<void> => {
  const recoverCustomerMutation = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
    `;
  const { data, errors } = await client.request(recoverCustomerMutation, {
    variables: {
      email,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerRecover.customerUserErrors.length > 0) {
    const graphQLError = data.customerRecover.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
};

export const createAccessToken = async (
  props: CustomerAccessTokenCreateInput
): Promise<CustomerAccessTokenProps> => {
  const createAccessTokenMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
    `;
  const { data, errors } = await client.request(createAccessTokenMutation, {
    variables: {
      input: props,
    },
  });
  if (errors)
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    const graphQLError = data.customerAccessTokenCreate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerAccessTokenCreate.customerAccessToken;
};

export const deleteAccessToken = async (token: string): Promise<void> => {
  const deleteAccessTokenMutation = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
  `;
  const { data, errors } = await client.request(deleteAccessTokenMutation, {
    variables: {
      customerAccessToken: token,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerAccessTokenDelete.userErrors.length > 0) {
    const graphQLError = data.customerAccessTokenDelete.userErrors[0];
    console.log(graphQLError);
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
};

export const refreshToken = async (token: string): Promise<CustomerAccessTokenProps> => {
  const refreshTokenMutation = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
    `;
  const { data, errors } = await client.request(refreshTokenMutation, {
    variables: {
      customerAccessToken: token,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerAccessTokenRenew.userErrors.length > 0) {
    const graphQLError = data.customerAccessTokenRenew.userErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerAccessTokenRenew.customerAccessToken;
};

export const getCustomer = async (token: string): Promise<CustomerProps> => {
  const getCustomerQuery = `
  query customer($token: String!) {
    customer(customerAccessToken: $token) {
        ${customerQuery}
    }
  }
    `;
  const { data, errors } = await client.request(getCustomerQuery, {
    variables: {
      token,
    },
  });
  if (errors) throw errors;
  return data.customer;
};

export const createCustomerAdress = async ({
  props,
  token,
}: {
  props: MailingAddressInput;
  token: string;
}): Promise<AddressProps> => {
  const createCustomerAdressMutation = `
  mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
    customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
      customerAddress {
        address1
        address2
        city
        company
        country
        countryCode
        countryCodeV2
        firstName
        formatted(withCompany: true, withName: true)
        formattedArea
        id
        lastName
        latitude
        longitude
        name
        phone
        province
        provinceCode
        zip
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
    `;
  const { data, errors } = await client.request(createCustomerAdressMutation, {
    variables: {
      address: props,
      customerAccessToken: token,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerAddressCreate.customerUserErrors.length > 0) {
    const graphQLError = data.customerAddressCreate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerAddressCreate.customerAddress;
};

function getErrorMessage(error: any) {
  switch (error.code) {
    case 'ALREADY_ENABLED':
      return 'Votre compte a déjà été activé';
    case 'BAD_DOMAIN':
      return "L'e-mail ou le mot de passe saisi contient un nom de domaine invalide.";
    case 'BLANK':
      return "L'e-mail ou le mot de passe saisi est vide.";
    case 'CUSTOMER_DISABLED':
      return 'Votre compte est désactivé';
    case 'CONTAINS_HTML_TAGS':
      return "L'e-mail ou le mot de passe saisi contient des caractères HTML.";
    case 'CONTAINS_URL':
      return "L'e-mail ou le mot de passe saisi contient une URL.";
    case 'INVALID':
      return "L'e-mail, numéro(Ex: +33xxxxxxx) ou le mot de passe saisi est invalide(votre mot de passe doit être fort).";
    case 'INVALID_MULTIPASS_REQUEST':
      return 'Une erreur est survenue, veillez ressayer.';
    case 'NOT_FOUND':
      return "L'adresse entrée n'existe pas.";
    case 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE':
      return 'Le mot de passe saisi commence ou se termine par un espace.';
    case 'TAKEN':
      return 'Ce compte existe déjà.';
    case 'TOKEN_INVALID':
      return 'Une erreur est survenue, veillez ressayer.';
    case 'TOO_LONG':
      return "L'e-mail ou Le mot de passe saisi est trop long.";
    case 'TOO_SHORT':
      return "L'e-mail ou Le mot de passe saisi est trop court.";
    case 'UNIDENTIFIED_CUSTOMER':
      return "Ce compte n'a pas pu être trouvé.";
    default:
      return error.message || 'Une erreur est survenue';
  }
}
