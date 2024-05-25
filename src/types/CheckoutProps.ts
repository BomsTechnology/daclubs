import { AddressProps, MainCustomerProps } from './CustomerProps';
import { PriceProps, VariantProps } from './ProductProps';

export interface AttributeProps {
  key: string;
  value: string;
}

export interface DiscountAllocations {
  discountedAmount: PriceProps;
}

export interface BuyerIdentityProps {
  contryCode: string;
  deliveryAddressPreferences: AddressProps;
  customer: MainCustomerProps;
  email: string;
  phone: string;
  walletPreferences: string;
  purchasingCompany: {
    company: {
      createdAt: Date;
      externalId: string;
      id: string;
      name: string;
      updatedAt: Date;
    };
    contact: {
      createdAt: Date;
      locale: string;
      title: string;
      id: string;
      updatedAt: Date;
    };
    location: {
      createdAt: Date;
      id: string;
      updatedAt: Date;
      name: string;
      externalId: string;
      locale: string;
    };
  };
}

export interface CartCoastProps {
  checkoutChargeAmount: PriceProps;
  subtotalAmount: PriceProps;
  subtotalAmountEstimated: boolean;
  totalAmount: PriceProps;
  totalAmountEstimated: boolean;
  totalDutyAmount: PriceProps;
  totalDutyAmountEstimated: boolean;
  totalTaxAmount: PriceProps;
  totalTaxAmountEstimated: boolean;
}

export interface CartLineCoastProps {
  amountPerQuantity: PriceProps;
  compareAtAmountPerQuantity: PriceProps;
  subtotalAmount: PriceProps;
  totalAmount: PriceProps;
}

export interface CartLineProps {
  attribute?: AttributeProps;
  attributes: AttributeProps[];
  coast: CartLineCoastProps;
  discountAllocations: DiscountAllocations[];
  id: string;
  merchandise: VariantProps;
}

export default interface CheckoutProps {
  attribute?: AttributeProps;
  attributes: AttributeProps[];
  buyerIdentity?: BuyerIdentityProps;
  totalQuantity: number;
  lines: {
    edges: {
      cursor: string;
      node: CartLineProps;
    }[];
  };
  updatedAt: Date;
  note?: string;
  id: string;
  createdAt: Date;
  checkoutUrl: string;
  coast: CartCoastProps;
  discountAllocations: DiscountAllocations[];
  discountCodes: {
    applicable: boolean;
    code: string;
  }[];
}
