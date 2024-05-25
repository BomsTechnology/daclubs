import { MailingAddressInput } from './customer';
import CheckoutProps, { AttributeProps } from '../types/CheckoutProps';
import CustomError from '../types/CustomError';
import client from '../utils/shopify';

export type AttributeInput = AttributeProps[];

export interface CartBuyerIdentityInput {
  companyLocationId?: string;
  countryCode: string;
  customerAccessToken: string;
  deliveryAddressPreferences: {
    customerAddressId: string;
    deliveryAddress: MailingAddressInput;
    deliveryAddressValidationStrategy?: 'COUNTRY_CODE_ONLY' | 'STRICT';
  }[];
  email: string;
  phone?: string;
  walletPreferences?: string[];
}

export interface CartLineInput {
  attributes: AttributeInput;
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
  id?: string;
}

export interface CartInputMetafieldInput {
  key: string;
  type: string;
  value: string;
}

const cartQuery = `
attributes {
    key
    value
  }
  buyerIdentity {
    countryCode
    customer {
      id
      email
      phone
      firstName
      displayName
      lastName
    }
    deliveryAddressPreferences {
      ... on MailingAddress {
        id
        name
        longitude
        latitude
        lastName
        phone
        province
        provinceCode
        zip
        formattedArea
        formatted(withCompany: false, withName: false)
        firstName
        countryCodeV2
        countryCode
        country
        company
        city
        address2
        address1
      }
    }
    email
    phone
    walletPreferences
    purchasingCompany {
      company {
        createdAt
        externalId
        id
        name
        updatedAt
      }
      contact {
        createdAt
        id
        locale
        title
        updatedAt
      }
      location {
        createdAt
        externalId
        id
        locale
        name
        updatedAt
      }
    }
  }
  checkoutUrl
  createdAt
  discountAllocations {
    discountedAmount {
      amount
      currencyCode
    }
  }
  discountCodes {
    applicable
    code
  }
  updatedAt
  totalQuantity
  note
  lines(first: 100) {
    edges {
      node {
        id
        merchandise {
          ... on ProductVariant {
            id
          }
        }
        quantity
      }
      cursor
    }
  }
  id
  cost {
    subtotalAmountEstimated
    totalAmount {
      amount
      currencyCode
    }
    totalAmountEstimated
    totalDutyAmount {
      currencyCode
      amount
    }
    totalTaxAmountEstimated
    totalDutyAmountEstimated
    totalTaxAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    checkoutChargeAmount {
      amount
      currencyCode
    }
  }
`;

export const createCart = async ({
  attributes,
  buyerIdentity,
  discountCodes,
  lines,
  note,
  metafields,
}: {
  attributes: AttributeInput;
  buyerIdentity?: CartBuyerIdentityInput;
  discountCodes: string[];
  lines: CartLineInput[];
  note?: string;
  metafields: CartInputMetafieldInput[];
}): Promise<CheckoutProps> => {
  const createCartMutation = `
  mutation createCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      cart {
        ${cartQuery}
        }
        userErrors {
          field
          message
          code
        }
      }
    }
      `;
    //  console.log(buyerIdentity!.deliveryAddressPreferences);
  const { data, errors } = await client.request(createCartMutation, {
    variables: {
      cartInput: {
        attributes,
        buyerIdentity,
        discountCodes,
        lines,
        note,
        metafields,
      },
    },
  });
  if (errors) {
    console.log(errors);
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.cartCreate.userErrors.length > 0) {
    const graphQLError = data.cartCreate.userErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.cartCreate.cart;
};

export const addLineCart = async ({
  lines,
  cartId,
}: {
  lines: CartLineInput[];
  cartId: string;
}): Promise<CheckoutProps> => {
  const addLineCartMutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${cartQuery}
          }
          userErrors {
            field
            message
            code
          }
        }
      }
        `;
  const { data, errors } = await client.request(addLineCartMutation, {
    variables: {
      cartId,
      lines,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.cartLinesAdd.userErrors.length > 0) {
    const graphQLError = data.cartLinesAdd.userErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.cartLinesAdd.cart;
};

export const updateLineCart = async ({
  lines,
  cartId,
}: {
  lines: CartLineInput[];
  cartId: string;
}): Promise<CheckoutProps> => {
  const updateLineCartMutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${cartQuery}
            }
            userErrors {
              field
              message
              code
            }
          }
        }
          `;
  const { data, errors } = await client.request(updateLineCartMutation, {
    variables: {
      cartId,
      lines,
    },
  });
  if (errors) {
    throw new CustomError(
      errors.graphQLErrors![0].message || errors.message || 'Une erreur est survenue',
      errors.graphQLErrors![0].networkStatusCode || errors.networkStatusCode
    );
  }
  if (data.cartLinesUpdate.userErrors.length > 0) {
    const graphQLError = data.cartLinesUpdate.userErrors[0];
    throw new CustomError(getErrorMessage(graphQLError), graphQLError.code);
  }
  return data.cartLinesUpdate.cart;
};

function getErrorMessage(error: any) {
  switch (error.code) {
    case 'ADDRESS_FIELD_CONTAINS_EMOJIS':
      return "Le champ d'adresse spécifié contient des emojis.";
    case 'ADDRESS_FIELD_CONTAINS_HTML_TAGS':
      return "Le champ d'adresse spécifié contient des balises HTML.";
    case 'ADDRESS_FIELD_CONTAINS_URL':
      return "Le champ d'adresse spécifié contient une URL.";
    case 'ADDRESS_FIELD_DOES_NOT_MATCH_EXPECTED_PATTERN':
      return "Le champ d'adresse spécifié ne correspond pas au modèle attendu.";
    case 'ADDRESS_FIELD_IS_REQUIRED':
      return "Le champ d'adresse spécifié est obligatoire.";
    case 'ADDRESS_FIELD_IS_TOO_LONG':
      return "Le champ d'adresse spécifié est trop long.";
    case 'INVALID':
      return "La valeur saisie n'est pas valide.";
    case 'INVALID_COMPANY_LOCATION':
      return "L'emplacement de l'entreprise n'a pas été trouvé ou n'est pas autorisé.";
    case 'INVALID_DELIVERY_GROUP':
      return "Le groupe de livraison n'a pas été trouvé dans le panier.";
    case 'INVALID_DELIVERY_OPTION':
      return "L'option de livraison n'était pas valide.";
    case 'INVALID_INCREMENT':
      return "La quantité doit être un multiple de l'incrément spécifié.";
    case 'INVALID_MERCHANDISE_LINE':
      return "La ligne de marchandise n'a pas été trouvée dans le panier.";
    case 'INVALID_METAFIELDS':
      return "Les méta-champs n'étaient pas valides.";
    case 'INVALID_ZIP_CODE_FOR_COUNTRY':
      return "Le code postal indiqué n'est pas valide pour le pays indiqué.";
    case 'INVALID_ZIP_CODE_FOR_PROVINCE':
      return "Le code postal indiqué n'est pas valide pour la province indiquée.";
    case 'LESS_THAN':
      return "La valeur d'entrée doit être inférieure à la valeur maximale autorisée.";
    case 'MAXIMUM_EXCEEDED':
      return "La quantité doit être inférieure au maximum spécifié pour l'article.";
    case 'MINIMUM_NOT_MET':
      return "La quantité doit être supérieure au minimum spécifié pour l'article.";
    case 'MISSING_CUSTOMER_ACCESS_TOKEN':
      return "Le jeton d'accès client est nécessaire pour définir la localisation d'une entreprise.";
    case 'MISSING_DISCOUNT_CODE':
      return 'Code de réduction manquant.';
    case 'MISSING_NOTE':
      return 'Note manquante.';
    case 'PROVINCE_NOT_FOUND':
      return 'La province indiquée est introuvable.';
    case 'UNSPECIFIED_ADDRESS_ERROR':
      return "Une erreur générale s'est produite lors de la validation de l'adresse.";
    case 'VALIDATION_CUSTOM':
      return 'La validation a échoué.';
    case 'ZIP_CODE_NOT_SUPPORTED':
      return "Le code postal donné n'est pas pris en charge.";
    default:
      return error.message || 'Une erreur est survenue';
  }
}
