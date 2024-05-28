import { useLocalSearchParams } from 'expo-router';

import ProductDetail from '~/src/components/product/ProductDetail';

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  return <ProductDetail id={id as string} pb />;
};

export default DetailPage;
