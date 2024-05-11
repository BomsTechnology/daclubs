import { useLocalSearchParams } from 'expo-router';

import CategoryScreen from '~/src/components/CategoryScreen';

const CategoryPage = () => {
  const { id } = useLocalSearchParams();
  return <CategoryScreen id={id as string} />;
};

export default CategoryPage;
