import { useLocalSearchParams } from 'expo-router';

import CategoryScreen from '~/src/components/screen/CategoryScreen';

const CategoryPage = () => {
  const { id } = useLocalSearchParams();
  return <CategoryScreen id={id as string} from="(app)/marks" />;
};

export default CategoryPage;
