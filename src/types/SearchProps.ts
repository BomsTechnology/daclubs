import ProductProps from './ProductProps';

export default interface SearchProps {
  price: {
    min: string;
    max: string;
  };
  items: string[];
}

export interface FilterHandle {
  setMinPrice: (minPrice: string) => void;
  setMaxPrice: (maxPrice: string) => void;
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  getSearchProps: () => SearchProps;
  reset: () => void;
}

export interface FilterValueProps {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface FilterProps {
  id: string;
  label: string;
  type: string;
  values: FilterValueProps[];
}

export interface ProductSearchProps {
  edges: ProductProps[];
  productFilters: FilterProps[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string;
  };
}
