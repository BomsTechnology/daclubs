export interface PriceProps {
  amount: number;
  currencyCode: string;
}

export interface ImageProps {
  id: string;
  altText: string;
  url: string;
  width: number;
  height: number;
}

export interface OptionProps {
  id: number;
  name: string;
  values: string[];
}

export interface VariantProps {
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  id: string;
  image: ImageProps;
  price: PriceProps;
  quantityAvailable: number;
  barcode: string;
  compareAtPrice: PriceProps;
  selectedOptions: { name: string; value: string }[];
  createdAt: Date;
  requiresShipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  updatedAt: Date;
  weight: number;
  weightUnit: string;
  unitPrice: PriceProps;
}

export default interface ProductProps {
  totalInventory?: number;
  trackingParameters?: string;
  availableForSale: boolean;
  id: string;
  compareAtPriceRange?: {
    maxVariantPrice: PriceProps;
    minVariantPrice: PriceProps;
  };
  title: string;
  description?: string;
  handle: string;
  createdAt?: Date;
  isGiftCard?: boolean;
  requiresSellingPlan?: boolean;
  descriptionHtml?: string;
  publishedAt: Date;
  productType: string;
  options?: OptionProps[];
  images?: ImageProps[];
  tags?: string[];
  featuredImage: ImageProps;
  variants?: VariantProps[];
  vendor?: string;
  onlineStoreUrl?: string;
  updatedAt?: Date;
  priceRange: {
    maxVariantPrice: PriceProps;
    minVariantPrice: PriceProps;
  };
}
