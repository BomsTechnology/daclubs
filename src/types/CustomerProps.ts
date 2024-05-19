import { PriceProps, VariantProps } from './ProductProps';

export interface CustomerAccessTokenProps {
  accessToken: string;
  expiresAt: Date;
}

export interface MainLineItemProps {
  title: string;
  variant: VariantProps;
  quantity: number;
  currentQuantity: number;
  originalTotalPrice: PriceProps;
  discountedTotalPrice: PriceProps;
}

export interface LineItemProps {
  edges: {
    cursor: string;
    node: MainLineItemProps;
  }[];
}

export interface AddressProps {
  id: string;
  city?: string;
  company?: string;
  countryCodeV2?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  province?: string;
  address1?: string;
  address2?: string;
  zip?: string;
  provinceCode?: string;
  name?: string;
  longitude?: number;
  latitude?: number;
  formattedArea?: string;
  formatted?: string[];
}

export interface OrderProps {
  financialStatus: string;
  fulfillmentStatus: string;
  cancelReason?: string;
  phone: string;
  email: string;
  edited: boolean;
  customerUrl: string;
  customerLocale: string;
  canceledAt: Date;
  currencyCode: string;
  billingAddress: AddressProps;
  currentSubtotalPrice: PriceProps;
  currentTotalDuties: PriceProps;
  currentTotalPrice: PriceProps;
  currentTotalTax: PriceProps;
  customAttributes: {
    key: string;
    value: string;
  }[];
  id: string;
  name: string;
  orderNumber: number;
  statusUrl: string;
  subtotalPrice: PriceProps;
  shippingAddress: AddressProps;
  totalRefundedV2?: PriceProps;
  totalPrice: PriceProps;
  subtotalPriceV2?: PriceProps;
  totalRefunded: PriceProps;
  totalPriceV2?: PriceProps;
  totalShippingPrice: PriceProps;
  totalShippingPriceV2?: PriceProps;
  totalTax: PriceProps;
  totalTaxV2?: PriceProps;
  originalTotalPrice: PriceProps;
  originalTotalDuties: PriceProps;
  processedAt: Date;
  shippingDiscountAllocations: {
    allocatedAmount: PriceProps;
    discountApplication?: {
      allocationMethod: string;
      targetSelection: string;
      targetType: string;
      value: PriceProps;
    };
  };
  lineItems: LineItemProps;
}

export interface MainCustomerProps {
  id: string;
  acceptsMarketing: boolean;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  tags: string[];
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  defaultAddress?: AddressProps;
  numberOfOrders?: number;
}

export interface CustomerProps extends MainCustomerProps {
  addresses?: {
    edges: {
      cursor: string;
      node: AddressProps;
    }[];
  };
  orders?: {
    edges: {
      cursor: string;
      node: OrderProps;
    }[];
  };
}
