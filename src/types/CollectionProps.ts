import { ImageProps, MainProductProps } from './ProductProps';

export interface MainCollectionProps {
  description: string;
  descriptionHtml: string;
  handle: string;
  image: ImageProps;
  id: string;
  onlineStoreUrl: string;
  trackingParameters: string;
  title: string;
  updatedAt: Date;
}

export default interface CollectionProps {
  cursor: string;
  node: MainCollectionProps;
}

export interface CollectionWithProductsProps {
  handle: string;
  id: string;
  title: string;
  products: {
    edges: {
      cursor: string;
      node: MainProductProps;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string;
    };
  };
}
