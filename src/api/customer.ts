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

const adressQuery = `
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
            zip`;

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
            ${adressQuery}
        }
        addresses(first: 50) {
            edges {
              cursor
              node {
                ${adressQuery}
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
                    ${adressQuery}
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
                    ${adressQuery}
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
        ${adressQuery}
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

export const deleteCustomerAdress = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<void> => {
  const deleteCustomerAdressMutation = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        field
        message
        code
      }
      deletedCustomerAddressId
    }
  }
    `;
  const { data, errors } = await client.request(deleteCustomerAdressMutation, {
    variables: {
      customerAccessToken: token,
      id,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    const graphQLError = data.customerAddressDelete.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
};

export const updateCustomerAdress = async ({
  props,
  token,
  id,
}: {
  props: MailingAddressInput;
  token: string;
  id: string;
}): Promise<AddressProps> => {
  const updateCustomerAdressMutation = `
  mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
    customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
      customerAddress {
        ${adressQuery}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
    `;
  const { data, errors } = await client.request(updateCustomerAdressMutation, {
    variables: {
      address: props,
      customerAccessToken: token,
      id,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    const graphQLError = data.customerAddressUpdate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerAddressUpdate.customerAddress;
};

export const defaultCustomerAddress = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<CustomerProps> => {
  const defaultCustomerAddressMutation = `
  mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
    customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
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
  const { data, errors } = await client.request(defaultCustomerAddressMutation, {
    variables: {
      addressId: id,
      customerAccessToken: token,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
    const graphQLError = data.customerDefaultAddressUpdate.customerUserErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.customerDefaultAddressUpdate.customer;
};

function getErrorMessage(error: any) {
  switch (error.code) {
    case 'ALREADY_ENABLED':
      return 'Votre compte a déjà été activé';
    case 'BAD_DOMAIN':
      return "L'e-mail ou le mot de passe saisi contient un nom de domaine invalide.";
    case 'BLANK':
      return "La valeur d'entrée est vide.";
    case 'CUSTOMER_DISABLED':
      return 'Votre compte est désactivé';
    case 'CONTAINS_HTML_TAGS':
      return "L'e-mail ou le mot de passe saisi contient des caractères HTML.";
    case 'CONTAINS_URL':
      return "L'e-mail ou le mot de passe saisi contient une URL.";
    case 'INVALID':
      return "La valeur saisie n'est pas valide.";
    case 'INVALID_MULTIPASS_REQUEST':
      return 'Une erreur est survenue, veillez ressayer.';
    case 'NOT_FOUND':
      return "L'adresse entrée n'existe pas.";
    case 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE':
      return 'Le mot de passe saisi commence ou se termine par un espace.';
    case 'TAKEN':
      return 'La valeur entrée existe déjà.';
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
